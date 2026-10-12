# Injuries Cases public sitemap host

This repository holds public sitemap files, a public URL seed and a Python standard-library refresh script. It contains no website source, credentials, forms, lead information or personal accident records.

The intended host is `https://sitemap.injuriescases.com`. Configure GitHub Pages to publish the `docs` directory from the `main` branch and configure the custom domain and DNS. The committed CNAME file does not itself configure DNS or prove that hosting works.

Files served:

* `/sitemap.xml`: index of four site-specific XML sitemaps.
* `/sitemaps/com.xml`, `/sitemaps/autos.xml`, `/sitemaps/info.xml`, `/sitemaps/page.xml`: canonical public URLs grouped by site.
* `/portfolio.txt`: complete mixed-domain public URL list.
* `/`: simple links to these public resources, marked noindex to avoid creating another content site.

Run `python scripts/refresh.py`. It fetches the four public `/guides` pages using GET only, discovers same-site `/new-jersey/<article>` links and retains verified nonarticle canonical URLs from the seed and previous portfolio. All four fetches must succeed before files change. A missing previously published article link fails the run instead of silently removing it. A blank page, unexpected redirect, noindex response or malformed source also fails. Output is deterministic and unchanged files are not rewritten. XML is parsed before writing. No per-URL availability or Google-indexing claim is made by the generator.

The workflow runs at 06:17 and 18:17 UTC and can be dispatched manually. It commits only changed files under `docs` and uses the standard workflow token, with no added secrets or packages. Changes to the seed, script or workflow are deliberate repository edits rather than automated changes. To remove a retired URL, review and update both the seed and existing public portfolio; the retention guard prevents accidental deletion.

Cross-site sitemap submission requires appropriate Search Console ownership and configuration. A central host or accessible XML file does not prove Google has accepted, crawled or indexed the listed pages. Publishing by the workflow token may not itself trigger a Pages build in every GitHub Pages configuration. Confirm refresh-to-live behavior after setup and use an explicit Pages deployment workflow if needed.

The refresh workflow explicitly requests a Pages rebuild because commits made with GITHUB_TOKEN do not automatically trigger all downstream builds. The public host contains public URLs and approved article illustrations only. Website sources, lead data and credentials remain outside this repository.

## Publication illustrations

The images folder contains three small, generated wordless illustrations from Peter's existing NJLOCAL library for the next approved article batch. They are illustrative, not actual crash evidence or current road surveys. No raw reference frames or private records are published.
