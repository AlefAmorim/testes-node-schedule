import nodeschedule from 'node-schedule';

const jobs = new Map();
const error = new Error();

function lembrar(){
  console.log("Está lembrado!😀");
}

export default class Lembretes{
  async Criar(config, id){
    const job = nodeschedule.scheduleJob(config, ()=>{
      console.log("OK")
    });
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
  }
}