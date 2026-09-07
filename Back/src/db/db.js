import { MongoClient } from "mongodb"; // Client para conexão com mongodb
import dotenvConf from "../config/dotenv.js";

async function connect(){
  // URI de conexão com o banco
  // Configurada no .env
  const uri = dotenvConf.DB_URI;
  console.log(uri)
  const client = new MongoClient(uri, {
    maxConnecting:10,
    // waitQueueTimeoutMS:3000
  }); // Criando um client de conexão com o banco 

  try {
    console.log(dotenvConf.DB_NAME,dotenvConf.DB_COLLECTION)
    const database = client.db(dotenvConf.DB_NAME);
    console.log(database);
    const collection = database.collection(dotenvConf.DB_COLLECTION);
    return {collection, client}; 
  }catch(error) {
    throw error;
  } 
}

export default connect;