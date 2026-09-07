import nodeschedule from 'node-schedule';
import connect from '../db/db.js';
import { sendPush } from './webpush.js';
import { ObjectId } from 'mongodb';
const jobs = new Map();
const error = new Error();

async function lembrar(title){
  let client;
  try {
    const connection = await connect();
    const db = connection.collection;
    client = connection.client;
    const registro = await db.findOne({_id:new ObjectId("6a9f10179478ecbcf0c24d9a")});
    console.log(registro);

    const sended = await sendPush(registro, JSON.stringify({title:title}));
    console.log(`Sended? ${sended}`);
    return true;
  }catch(error) {
    throw error;
  }finally {
    if(client) client.close();
  }
}

export default class Lembretes{
  async Criar(config, id, title){
    const job = nodeschedule.scheduleJob({rule:config, tz:"America/Sao_Paulo"},() => lembrar(title));
    console.log(config);
    console.log(job);

    jobs.set(id, job);
    return true;
  } 
  async atualizar(config, id) {
    const job = jobs.get(id);
    if(!job) {
      error.noFound = true;
      throw error;
    }
    job.cancel();
    const newJob = nodeschedule.scheduleJob(config, lembrar); 
    jobs.set(id, newJob);
  }
  async remover(id) {
    const job = jobs.get(id);
    if(!job) {
      error.noFound = true;
      throw error;
    }
    job.cancel();
    jobs.delete(id);
  }
  async listar() {
    console.log(jobs);
    return jobs;
  }
}