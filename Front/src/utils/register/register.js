export async function registerServiceWorker(){
  try {
    // Fazendo o registro do serviceWorker
    // Por ser uma promise é permitido o uso de async/await
    ///sw.js porque esta na pasta public
    const registration = await navigator.serviceWorker.register('/js/service-worker.js');

    // A chamada de register retorna um ServiceWorkerRegistration
    // que será utilizado para acesso da Push API
    return registration;
  }catch(error){
    console.error(error);
    return "Falha ao registrar service worker!";
  }
}

// Inscrevendo o usuário para receber as mensagens push
export async function subscribeUserToPush(registration){
  try{
    const options = {
      userVisibleOnly:true, // necessário para indicar que aplicação enviará a notificação sempre que um push for feito
      applicationServerKeyOption:import.meta.env.VITE_VAPID_PUBLIC_KEY,// Key pública VAPID gerada pelo servidor 
    }
    const subscription = await registration.pushManager.subscribe(options);
    return subscription;
  }catch(error){
    console.error(error);
    throw error;
  }
}

export async function askingPermission(){
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

export async function verificarCompatibilidade(){
  const result = {
    erro:false
  }
  // Verificando se o navegador suporta ServiceWorker
  if(!('serviceWorker' in navigator)){
    result.erro = true;
    result.message = "Seu navegador não suporta esta funcionalidade.";
    return result;
  }
  // Verificando se o navegador suporta a API PushManager
  if(!('PushManager' in window)){
    result.erro = true;
    result.message = "Seu navegador não suporta esta funcionalidade.";
    return result;
  } 

  result.message = "Funcionalidade suportada!";

  return result;
}