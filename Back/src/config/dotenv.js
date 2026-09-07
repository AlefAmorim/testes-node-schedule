import dotenv from "dotenv";

dotenv.config();
//{path:'../../.env'}
console.log(process.env.VAPID_PUBLIC_KEY,process.env.VAPID_PRIVATE_KEY)
const dotenvConf =  {
  DB_URI: process.env.DB_URI,
  DB_NAME: process.env.DB_NAME,
  DB_COLLECTION: process.env.DB_COLLECTION,
  PUBLIC_VAPID_KEY:process.env.VAPID_PUBLIC_KEY,
  PRIVATE_VAPID_KEY:process.env.VAPID_PRIVATE_KEY
}

export default dotenvConf;