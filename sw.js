/* Offline cache. Raise the version number when you publish an update. */
const V='panne-spot-v1',FILES=["./", "fonts.css", "fonts/bricolage-grotesque-latin-600-normal.woff2", "fonts/bricolage-grotesque-latin-700-normal.woff2", "fonts/bricolage-grotesque-latin-ext-600-normal.woff2", "fonts/bricolage-grotesque-latin-ext-700-normal.woff2", "fonts/bricolage-grotesque-vietnamese-600-normal.woff2", "fonts/bricolage-grotesque-vietnamese-700-normal.woff2", "fonts/figtree-latin-400-normal.woff2", "fonts/figtree-latin-500-normal.woff2", "fonts/figtree-latin-600-normal.woff2", "fonts/figtree-latin-ext-400-normal.woff2", "fonts/figtree-latin-ext-500-normal.woff2", "fonts/figtree-latin-ext-600-normal.woff2", "icons/apple-touch-icon.png", "icons/favicon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "index.html", "manifest.webmanifest", "tailwind.css", "vendor/dexie.min.js"];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||!r.url.startsWith(self.location.origin))return;
  e.respondWith((async()=>{
    const c=await caches.open(V),hit=await c.match(r,{ignoreSearch:true});
    const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>null);
    e.waitUntil(net);
    return hit||await net||(r.mode==='navigate'?await c.match('index.html'):Response.error());
  })());
});
