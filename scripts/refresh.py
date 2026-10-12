#!/usr/bin/env python3
"""GET public guide pages and rebuild a public URL-only sitemap portfolio."""
import concurrent.futures
import html
from html.parser import HTMLParser
from pathlib import Path
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'
PUBLIC_HOST = 'https://sitemap.injuriescases.com'
SITES = {
    'com': 'https://www.injuriescases.com',
    'autos': 'https://injuriescases.autos',
    'info': 'https://injuriescases.info',
    'page': 'https://injuriescases.page',
}
NS = 'http://www.sitemaps.org/schemas/sitemap/0.9'
ET.register_namespace('', NS)
MAX_BODY = 6_000_000

def canonical(url):
    u = urllib.parse.urlsplit(url)
    if u.scheme != 'https' or u.username or u.password or u.port or u.query:
        raise ValueError(f'Noncanonical URL: {url}')
    if u.netloc not in {urllib.parse.urlsplit(b).netloc for b in SITES.values()}:
        raise ValueError(f'Unexpected hostname: {url}')
    if any(x in u.path for x in ['//', '/./', '/../', '%', '\\']):
        raise ValueError(f'Unexpected URL path: {url}')
    return urllib.parse.urlunsplit(('https', u.netloc, u.path.rstrip('/') or '/', '', ''))

def load_urls(path):
    if not path.exists():
        return set()
    lines = [line.strip() for line in path.read_text().splitlines() if line.strip()]
    result = {canonical(u) for u in lines}
    if len(result) != len(lines):
        raise ValueError(f'Duplicate URLs in {path}')
    return result

def is_article(url):
    path = urllib.parse.urlsplit(url).path
    return path.startswith('/new-jersey/') and len(path.split('/')) == 3 and bool(path.split('/')[-1])

class GuideLinks(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.noindex = False
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])
        if tag == 'meta' and attrs.get('name', '').lower() in {'robots', 'googlebot'}:
            self.noindex |= 'noindex' in attrs.get('content', '').lower()

def fetch_guides(key, base):
    url = base + '/guides'
    req = urllib.request.Request(url, headers={'User-Agent': 'MVA-Public-Sitemap-Refresh/1.0', 'Accept': 'text/html'})
    with urllib.request.urlopen(req, timeout=45) as res:
        if res.status != 200:
            raise ValueError(f'{url}: HTTP {res.status}')
        final = urllib.parse.urlsplit(res.url)
        if final.netloc != urllib.parse.urlsplit(base).netloc or final.path.rstrip('/') != '/guides':
            raise ValueError(f'{url}: unexpected redirect to {res.url}')
        if res.headers.get_content_type() != 'text/html':
            raise ValueError(f'{url}: expected public HTML')
        if 'noindex' in res.headers.get('X-Robots-Tag', '').lower():
            raise ValueError(f'{url}: noindex response')
        body = res.read(MAX_BODY + 1)
        if len(body) > MAX_BODY:
            raise ValueError(f'{url}: response too large')
        text = body.decode(res.headers.get_content_charset() or 'utf-8', errors='strict')
    parser = GuideLinks()
    parser.feed(text)
    if parser.noindex:
        raise ValueError(f'{url}: noindex HTML')
    urls = set()
    for link in parser.links:
        resolved = urllib.parse.urljoin(url, link)
        parts = urllib.parse.urlsplit(resolved)
        if parts.scheme != 'https' or parts.netloc != urllib.parse.urlsplit(base).netloc:
            continue
        if parts.query or not parts.path.startswith('/new-jersey/'):
            continue
        value = canonical(resolved)
        if is_article(value):
            urls.add(value)
    if not urls:
        raise ValueError(f'{url}: no article links; response may be empty or bot-blocked')
    return key, urls

def xml_document(kind, urls):
    root = ET.Element(f'{{{NS}}}{kind}')
    child_name = 'sitemap' if kind == 'sitemapindex' else 'url'
    for url in urls:
        child = ET.SubElement(root, f'{{{NS}}}{child_name}')
        ET.SubElement(child, f'{{{NS}}}loc').text = url
    ET.indent(root, space='  ')
    data = ET.tostring(root, encoding='utf-8', xml_declaration=True) + b'\n'
    ET.fromstring(data)
    return data

def refresh():
    seed = load_urls(ROOT / 'config/seed-urls.txt')
    if not seed:
        raise ValueError('Verified seed URL set is empty')
    previous = load_urls(DOCS / 'portfolio.txt')
    known = seed | previous
    discovered = {}
    # Every public guide GET must finish successfully before any output is changed.
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        futures = [pool.submit(fetch_guides, key, base) for key, base in SITES.items()]
        for future in concurrent.futures.as_completed(futures):
            key, urls = future.result()
            discovered[key] = urls
    if set(discovered) != set(SITES):
        raise ValueError('Not all guide pages were fetched')
    combined = set()
    groups = {}
    for key, base in SITES.items():
        site_known = {url for url in known if urllib.parse.urlsplit(url).netloc == urllib.parse.urlsplit(base).netloc}
        articles = {url for url in site_known if is_article(url)}
        missing = articles - discovered[key]
        if missing:
            raise ValueError(f'{key}: refusing silent loss of published links: ' + ', '.join(sorted(missing)))
        # Verified nonarticle canonicals are retained, not inferred from navigation.
        groups[key] = sorted(site_known | discovered[key])
        combined.update(groups[key])
    if not known <= combined:
        raise ValueError('Refusing loss of a previously published URL')
    output = {}
    sitemap_links = [PUBLIC_HOST + '/sitemaps/' + key + '.xml' for key in SITES]
    output[DOCS / 'sitemap.xml'] = xml_document('sitemapindex', sitemap_links)
    for key, urls in groups.items():
        if not 1 <= len(urls) <= 50_000:
            raise ValueError(f'{key}: sitemap URL count out of range')
        output[DOCS / 'sitemaps' / f'{key}.xml'] = xml_document('urlset', urls)
    output[DOCS / 'portfolio.txt'] = ('\n'.join(url for key in SITES for url in groups[key]) + '\n').encode()
    sections = ''.join('<section><h2>' + html.escape(SITES[key]) + '</h2><p><a href="sitemaps/' + key + '.xml">XML sitemap</a>: ' + str(len(groups[key])) + ' public URLs</p><ul>' + ''.join('<li><a href="' + html.escape(url, quote=True) + '">' + html.escape(url) + '</a></li>' for url in groups[key]) + '</ul></section>' for key in SITES)
    page = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Injuries Cases public sitemap portfolio</title><meta name="robots" content="noindex,follow"><style>body{max-width:960px;margin:40px auto;padding:0 20px;font:18px/1.6 system-ui,sans-serif}a{overflow-wrap:anywhere}section{margin-top:36px}</style></head><body><h1>Public sitemap portfolio</h1><p>This host contains public sitemap files, links and article illustrations. It collects no accident inquiries.</p><p><a href="sitemap.xml">Sitemap index</a> · <a href="portfolio.txt">Text URL list</a></p>' + sections + '</body></html>\n'
    output[DOCS / 'index.html'] = page.encode()
    output[DOCS / 'CNAME'] = b'sitemap.injuriescases.com\n'
    output[DOCS / '.nojekyll'] = b''
    changed = []
    for path, data in output.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        if not path.exists() or path.read_bytes() != data:
            tmp = path.with_name(path.name + '.tmp')
            tmp.write_bytes(data)
            tmp.replace(path)
            changed.append(str(path.relative_to(ROOT)))
    return {'counts': {key: len(urls) for key, urls in groups.items()}, 'total': len(combined), 'changed': changed}

if __name__ == '__main__':
    import json
    try:
        print(json.dumps(refresh(), indent=2))
    except Exception as exc:
        print(f'Sitemap refresh failed; no partial network result was published: {exc}', file=sys.stderr)
        sys.exit(1)
