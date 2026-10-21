const C="grimpe-eps-v4";
const F=["./","index.html","manifest.json","icon-192.png","icon-512.png","icon-180.png","modele_classes.xlsx","modele_voies.xlsx"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>{const net=fetch(e.request).then(res=>{if(res.ok&&(new URL(e.request.url).origin===location.origin||e.request.url.includes("fonts.g"))){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp))}return res}).catch(()=>r);return r||net}))});
