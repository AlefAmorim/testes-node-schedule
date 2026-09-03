import express from 'express';
import http from 'http';
import Lembretes from './src/utils/nodeSchedule.js';

const app = express();
app.use(express.json());
const scheduler = new Lembretes();
const server = http.createServer(app);
let id = 1;

app.post('/agendar',async (req, res) => {
  let config;
  try {
    console.log(req.body)
    const { horario, recorrencia, data } = req.body;

    if((!recorrencia && !data) || !horario) {
      return res.status(400).send({erro: "Preencha a recorrencia ou a data e o horário!"});
    }

    const [hora, minuto] = horario.split(":");
    console.log(hora, minuto);
    if(data) {
      const [ano, mes, dia] = data.split('-');
      config = new Date(ano, mes-1, dia, hora, minuto);
    } else {
      config = `* ${minuto} ${hora} * *  ${recorrencia.join(",")}`;
    }    

    const resp = await scheduler.Criar(config, id);
    id++
    console.log(resp);
    return res.status(200).send({mensagem:"Lembrete criado com sucesso!"});
  }catch(error){
    console.error(error);
    return res.status(500).send({erro:"Erro interno no servidor"});
  }
})

server.listen(8000, ()=> {
  console.log(`Server listening on http://localhost:8000`);
})