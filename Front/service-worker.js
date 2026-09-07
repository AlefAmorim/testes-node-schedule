// Para receber os pushs
self.addEventListener('push', (event) => {
  console.log(event);
  event.waitUntil(
    self.registration.showNotification("Opa", {
      body:"Teste de notificação",
      icon:'/public/logo_rosa.png', 
      // tag:tag,
    })
  )
})  