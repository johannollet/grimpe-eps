const C="grimpe-eps-v6";
const F=["./","index.html","manifest.json","icon-192.png","icon-512.png","icon-180.png","modele_classes.xlsx","modele_voies.xlsx"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
function putCache(req,res){if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(req,cp))}return res}
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;
  const url=new URL(req.url);const same=url.origin===location.origin;if(url.pathname.startsWith("/api/"))return;
  const isPage=req.mode==="navigate"||(same&&(url.pathname==="/"||url.pathname.endsWith(".html")));
  if(isPage){
    // Page : toujours la version en ligne si le réseau répond (3 s max), sinon la copie hors ligne.
    e.respondWith(new Promise(resolve=>{
      let done=false;const fallback=()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match("index.html"));
      const t=setTimeout(()=>{if(!done){done=true;resolve(fallback())}},3000);
      fetch(req,{cache:"no-store"}).then(res=>{putCache("index.html",res.clone());if(!done){done=true;clearTimeout(t);resolve(res)}})
        .catch(()=>{if(!done){done=true;clearTimeout(t);resolve(fallback())}});
    }));
    return;
  }
  if(!same&&!url.hostname.includes("fonts.g"))return;
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>{const net=fetch(req).then(res=>putCache(req,res)).catch(()=>r);return r||net}));
});
