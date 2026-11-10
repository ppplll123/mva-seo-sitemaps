
window.__h=async v=>{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,16)};
window.__get=async k=>{const r=await fetch('https://sitemap.injuriescases.com/_stage/'+k+'.txt',{cache:'no-store'});if(!r.ok)throw new Error('fetch '+r.status);return r.text()};
window.__pages=null;window.__pg=async s=>{if(!__pages){__pages=await (await fetch('https://sitemap.injuriescases.com/_stage/pages.json',{cache:'no-store'})).json()}return __pages[s]};
window.__code=async s=>{const p=await __pg(s);const ed=ace.edit(document.querySelectorAll('.ace_editor')[0]);const before=await __h(ed.getValue());
 if(before!==p.snap&&before!==p.code.slice(0,16))return 'REFUSED editor holds '+before+' expected '+p.snap;
 ed.setValue(await __get(p.code),-1);await new Promise(r=>setTimeout(r,800));const after=await __h(ed.getValue());return JSON.stringify({before,after,ok:after===p.code.slice(0,16)})};
window.__settings=async s=>{const p=await __pg(s),V=p.V,res={};const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const set=(el,val)=>{const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;el.focus();Object.getOwnPropertyDescriptor(proto,'value').set.call(el,val);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));el.blur();el.dispatchEvent(new Event('blur',{bubbles:true}))};
 const tab=t=>{const r=[...document.querySelectorAll('[role=radio],label,button')].find(e=>e.textContent.trim()===t);r&&r.click();return !!r};
 const fld=lab=>{const ls=[...document.querySelectorAll('label,div,span,p')].filter(e=>e.textContent.trim()===lab&&e.childElementCount<=1);for(const l of ls){let q=l;for(let i=0;i<5&&q;i++){q=q.parentElement;const f=q&&q.querySelector('input[type=text],input:not([type]),textarea');if(f)return f}}return null};
 tab('Basic');await wait(500);for(const k of ['Page Title','Page Description']){set(fld(k),V[k]);await wait(200);res[k]=fld(k).value===V[k]}
 tab('Page Meta');await wait(600);for(const k of ['Social Media Title','Social Media Description']){set(fld(k),V[k]);await wait(200);res[k]=fld(k).value===V[k]}
 if(![...document.querySelectorAll('textarea')].some(t=>/Lennon/.test(t.placeholder))){const x=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0&&e.textContent.trim()==='SEO Meta');x&&x.click();await wait(600)}
 const ta=[...document.querySelectorAll('textarea')].find(t=>/Lennon/.test(t.placeholder));set(ta,await __get(p.schema));await wait(500);res.schema=(await __h(ta.value))===p.schema.slice(0,16);
 const canon=[...document.querySelectorAll('input')].map(i=>i.value).find(x=>/^https:\/\/injuriescases\.autos\/new-jersey\//.test(x))||null;res.canonOk=canon==='https://injuriescases.autos/new-jersey/'+s;
 tab('Basic');await wait(500);res.recheckTitle=fld('Page Title').value===V['Page Title'];
 const allok=Object.values(res).every(v=>v===true);
 if(allok){const b=[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='Save'&&!e.disabled);b&&b.click();await wait(4000);const pb=[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='Publish'&&!e.disabled);pb&&pb.click();res.saved=true}else{res.canon=canon}
 return JSON.stringify(res)};
'helpers loaded'
