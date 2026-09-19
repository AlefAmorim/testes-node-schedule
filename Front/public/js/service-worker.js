// Para receber os pushs
// Adiciona um listener no service-worker para que ele receba/escute os eventos push enviados pelo servidor
self.addEventListener('push', (event) => {
  const data = event.data.json(); // Dados enviados na notificação push
  event.waitUntil( //Faz com que o service-worker espere até que a notificação seja enviada
    self.registration.showNotification(data.titulo, { // Para fazer o registro e envio da notificação
      body:data.categoria,
      icon:"/logo_rosa.png", 
      badge:"/lightGestCareLogo.png", 
      // tag:tag,
    })
  )
}) 

self.addEventListener("activate", () => console.log("INICIADO"))