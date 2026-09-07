import webpush from 'web-push';
import dotenvConf from '../config/dotenv.js';

// Configurando as VAPID Keys
console.log(dotenvConf.PUBLIC_VAPID_KEY, dotenvConf.PRIVATE_VAPID_KEY)
webpush.setVapidDetails('mailto:example@teste.com', dotenvConf.PUBLIC_VAPID_KEY, dotenvConf.PRIVATE_VAPID_KEY);

export const sendPush = async (subscription, data) => {
  try {
    const notified = await webpush.sendNotification(subscription, data);
    console.log(notified);
    return true;
  }catch(error){
    throw error;
  }
}