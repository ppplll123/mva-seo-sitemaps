
window.__h=async v=>{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,16)};
window.__get=async k=>{const r=await fetch('https://sitemap.injuriescases.com/_stage/'+k+'.txt',{cache:'no-store'});if(!r.ok)throw new Error('fetch '+r.status);return r.text()};
window.__pages=null;window.__pg=async s=>{if(!__pages){__pages=await (await fetch('https://sitemap.injuriescases.com/_stage/pages.json',{cache:'no-store'})).json()}return __pages[s]};
window.__code=async s=>{window.__codeOk=null;const p=await __pg(s);const ed=ace.edit(document.querySelectorAll('.ace_editor')[0]);const before=await __h(ed.getValue());
 if(!(p.accept||[p.snap]).includes(before)&&before!==p.code.slice(0,16))return 'REFUSED editor holds '+before+' expected '+p.snap;
 ed.setValue(await __get(p.code),-1);await new Promise(r=>setTimeout(r,800));const after=await __h(ed.getValue());window.__codeOk=(after===p.code.slice(0,16))?s:null;return JSON.stringify({before,after,ok:after===p.code.slice(0,16)})};
window.__settings=async s=>{if(window.__codeOk!==s)return 'SKIPPED: code step not confirmed for '+s;const p=await __pg(s),V=p.V,res={};const wait=ms=>new Promise(r=>setTimeout(r,ms));
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
window.__stub=async s=>{const p=await __pg('STUB:'+s);const wait=ms=>new Promise(r=>setTimeout(r,ms));const res={};
 const set=(el,val)=>{const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;el.focus();Object.getOwnPropertyDescriptor(proto,'value').set.call(el,val);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));el.blur();el.dispatchEvent(new Event('blur',{bubbles:true}))};
 const tab=t=>{const r=[...document.querySelectorAll('[role=radio],label,button')].find(e=>e.textContent.trim()===t);r&&r.click();return !!r};
 const lab=t=>[...document.querySelectorAll('label,div,span,p')].find(e=>e.textContent.trim()===t&&e.childElementCount<=1);
 const fld=t=>{let q=lab(t);for(let i=0;i<5&&q;i++){q=q.parentElement;const f=q&&q.querySelector('input[type=text],input:not([type]),textarea');if(f)return f}return null};
 tab('Basic');await wait(500);for(const k of ['Page Title','Page Description']){set(fld(k),p.V[k]);await wait(200);res[k]=fld(k).value===p.V[k]}
 tab('Page Meta');await wait(600);
 if(!lab('Add canonical URL')){const x=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0&&e.textContent.trim()==='SEO Meta');x&&x.click();await wait(600)}
 const c=fld('Add canonical URL');set(c,p.target);await wait(300);res.canon=c.value===p.target;
 let q=lab('Enable noindex Meta');let sw=null;for(let i=0;i<4&&q&&!sw;i++){q=q.parentElement;sw=q&&q.querySelector('input[type=checkbox],[role=switch],button[class*=witch]')}
 res.noindexBefore=sw?(sw.checked??sw.getAttribute('aria-checked')):null;
 if(sw&&!(sw.checked===true||sw.getAttribute('aria-checked')==='true')){sw.click();await wait(400)}
 res.noindex=sw?(sw.checked===true||sw.getAttribute('aria-checked')==='true'):false;
 const ta=[...document.querySelectorAll('textarea')].find(t=>/Lennon/.test(t.placeholder));if(ta){set(ta,'');await wait(300);res.schemaCleared=ta.value===''}
 if(window.__codeOk!=='STUB:'+s)return 'SKIPPED: stub code not confirmed '+JSON.stringify(res);
 if(Object.values(res).filter(v=>typeof v==='boolean').every(v=>v)||res.noindexBefore==='false'||res.noindexBefore===false||res.noindexBefore===true||res.noindexBefore==='true'){
  const ok=res['Page Title']&&res['Page Description']&&res.canon&&res.noindex&&res.schemaCleared;
  if(ok){const b=[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='Save'&&!e.disabled);b&&b.click();await wait(4000);const pb=[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='Publish'&&!e.disabled);pb&&pb.click();res.saved=true}}
 return JSON.stringify(res)};
window.__stubcode=async s=>{const p=await __pg('STUB:'+s);const ed=ace.edit(document.querySelectorAll('.ace_editor')[0]);const before=await __h(ed.getValue());
 if(!p.accept.includes(before)&&before!==p.code.slice(0,16))return 'REFUSED '+before;ed.setValue(await __get(p.code),-1);await new Promise(r=>setTimeout(r,800));const after=await __h(ed.getValue());window.__codeOk=after===p.code.slice(0,16)?'STUB:'+s:null;return JSON.stringify({before,after,ok:after===p.code.slice(0,16)})};
window.__newcode=async s=>{const p=await __pg('NEW:'+s);const ed=ace.edit(document.querySelectorAll('.ace_editor')[0]);const before=await __h(ed.getValue());
 if(!p.accept.includes(before))return 'REFUSED '+before;ed.setValue(await __get(p.code),-1);await new Promise(r=>setTimeout(r,800));const after=await __h(ed.getValue());window.__codeOk=after===p.code.slice(0,16)?'NEW:'+s:null;return JSON.stringify({before,after,ok:after===p.code.slice(0,16)})};
window.__newsettings=async s=>{if(window.__codeOk!=='NEW:'+s)return 'SKIPPED';const p=await __pg('NEW:'+s),V=p.V,res={};const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const set=(el,val)=>{const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;el.focus();Object.getOwnPropertyDescriptor(proto,'value').set.call(el,val);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));el.blur();el.dispatchEvent(new Event('blur',{bubbles:true}))};
 const tab=t=>{const r=[...document.querySelectorAll('[role=radio],label,button')].find(e=>e.textContent.trim()===t);r&&r.click()};
 const lab=t=>[...document.querySelectorAll('label,div,span,p')].find(e=>e.textContent.trim()===t&&e.childElementCount<=1);
 const fld=t=>{let q=lab(t);for(let i=0;i<5&&q;i++){q=q.parentElement;const f=q&&q.querySelector('input[type=text],input:not([type]),textarea');if(f)return f}return null};
 tab('Basic');await wait(500);for(const k of ['Page Title','Page Description']){set(fld(k),V[k]);await wait(200);res[k]=fld(k).value===V[k]}
 tab('Page Meta');await wait(600);for(const k of ['Social Media Title','Social Media Description']){set(fld(k),V[k]);await wait(200);res[k]=fld(k).value===V[k]}
 if(!lab('Add canonical URL')){const x=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0&&e.textContent.trim()==='SEO Meta');x&&x.click();await wait(600)}
 const c=fld('Add canonical URL');set(c,p.canon);await wait(300);res.canon=c.value===p.canon;
 const ta=[...document.querySelectorAll('textarea')].find(t=>/Lennon/.test(t.placeholder));set(ta,await __get(p.schema));await wait(500);res.schema=(await __h(ta.value))===p.schema.slice(0,16);
 if(Object.values(res).every(v=>v===true)){[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='Save'&&!e.disabled).click();await wait(4000);[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='Publish'&&!e.disabled).click();res.saved=true}
 return JSON.stringify(res)};
