/* gym-tracker — service worker: apka działa offline (ekran, katalog, biblioteka Supabase).
   Strona główna: najpierw sieć (nowa wersja apki), bez sieci z pamięci. Pozostałe pliki apki: z pamięci.
   Zapytania do Supabase i innych domen nie przechodzą przez pamięć. Wersja wstawiana przez tools/build_app.py. */
const V="gt-3235cf7b041c";
const SHELL=["./","./index.html","./supabase.js","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png","./fonts/fonts.css","./fonts/barlow-condensed-latin-600-normal.woff2","./fonts/barlow-condensed-latin-700-normal.woff2","./fonts/barlow-condensed-latin-ext-600-normal.woff2","./fonts/barlow-condensed-latin-ext-700-normal.woff2","./fonts/ibm-plex-mono-latin-500-normal.woff2","./fonts/ibm-plex-mono-latin-ext-500-normal.woff2","./fonts/ibm-plex-sans-latin-400-normal.woff2","./fonts/ibm-plex-sans-latin-500-normal.woff2","./fonts/ibm-plex-sans-latin-600-normal.woff2","./fonts/ibm-plex-sans-latin-ext-400-normal.woff2","./fonts/ibm-plex-sans-latin-ext-500-normal.woff2","./fonts/ibm-plex-sans-latin-ext-600-normal.woff2"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET")return;
  if(u.origin===location.origin){
    if(r.mode==="navigate"){
      e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put("./index.html",c));return res})
        .catch(()=>caches.match("./index.html")));
      return;
    }
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res})));
    return;
  }
});
