async function registerServiceWorker(){
  try {
    // Fazendo o registro do serviceWorker
    // Por ser uma promise é permitido o uso de async/await
    const registration = await navigator.serviceWorker.register('/service-worker.js');

    // A chamada de register retorna um ServiceWorkerRegistration
    // que será utilizado para acesso da Push API
    return registration;
  }catch(error){
    console.error(error);
    return "Falha ao registrar service worker!";
  }
}

// Inscrevendo o usuário para receber as mensagens push
async function subscribeUserToPush(registration){
  try{
    const options = {
      userVisibleOnly:true, // necessário para indicar que aplicação enviará a notificação sempre que um push for feito
      // applicationServerKeyOption:keyPublicaServer,// Key pública VAPID gerada pelo servidor 
    }
    const subscription = await registration.pushManager.subscribe(options);
    return subscription;
  }catch(error){
    console.error(error);
    return "Falha ao regstrar o usuário!";
  }
}

async function askingPermission(){
  try {
    const permissionResult = await Notification.requestPermission();
    if(permissionResult !== "granted"){
      throw new Error("Permissão não aceita!");
    }
    return permissionResult;
  }catch(error){
    console.error(error);
    return "Falha ao obter permissão do usuário";
  }
}

// Verificando se o navegador suporta ServiceWorker
if(!('serviceWorker' in navigator)){
  console.log("Seu navegador não suporta esta funcionalidade.");
  // return;
}
// Verificando se o navegador suporta a API PushManager
if(!('PushManager' in window)){
  console.log("Seu navegador não suporta esta funcionalidade.");
  // return;
}

const btnNotify = document.querySelector(".notify");
btnNotify.addEventListener("click", askingPermission);