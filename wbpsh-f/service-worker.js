// Para receber os pushs
self.addEventListener('push', (event) => {
  event.waitUntil(
    self.registration.showNotification("Opa", {
      body:"Teste de notificação",
      // icon:icon,
      // tag:tag,
    })
  )
})  