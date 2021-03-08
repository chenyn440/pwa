const CACHE_NAME = 'pwa_demo'
self.addEventListener('install', event => {
    self.skipWaiting() // 跳过等待
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll([
            './404.html',
            'serviceWorker.html',
            'logo.png',
            'wx-hover.png'
        ]))
    )
})

self.addEventListener('activate', event => {
    console.log(33333)
    console.log(333333333)
    self.clients.claim() // 立即受控
})

self.addEventListener('fetch', event => {
    if (/wx-hover\.png$/.test(event.request.url)) {
        return event.respondWith(fetch("./logo.png"))
    }
    return event.respondWith(
        fetch(event.request).then( res => {
            if (event.request.mode == "navigate" && res.status == 404) {
                return fetch("404.html")
            }
            return res
        }).catch(() => {
            return caches.open(CACHE_NAME).then(
                cache => {
                    return cache.match(event.request).then(response => {
                        if(response) {
                            return response
                        }
                        return cache.match("404.html")
                    })
                }
            )
        })
    )
})
self.addEventListener("sync", e => {
    e.tag == "send_chat" && e.waitUntil(
        db.getAll("chatList").then(allData => Promise.all(allData.map(data=>fetch(data))))
    )
})

self.addEventListener('push', function(e) {
    var options = {
      body: 'This notification was generated from a push!',
      icon: 'logo.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2'
      },
      actions: [
        {action: 'explore', title: 'Explore this new world',
          icon: './logo.png'},
        {action: 'close', title: 'Close',
          icon: './logo.png'},
      ]
    };
    e.waitUntil(
      self.registration.showNotification('Hello world!', options)
    );
  });