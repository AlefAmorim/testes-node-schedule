// Para receber os pushs
self.addEventListener('push', (event) => {
  const data = event.data.json() ;
  event.waitUntil(
    self.registration.showNotification("Opa", {
      title:data.title,
      // body:,
      icon:'/public/logo_rosa.png', 
      // tag:tag,
    })
  )
})  