import express from "express";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import nodeSchedule from 'node-schedule'
import Lembretes from "./src/utils/nodeSchedule.js";
import connect from "./src/db/db.js";
import dotenvConf from "./src/config/dotenv.js";

const app = express();
app.use(
  cors({
    origin: dotenvConf.VERSION === "PROD"?["https://testes-node-schedule-z3tgwa6ey-alefs-projects-b1963f27.vercel.app","https://testes-node-schedule.vercel.app"]:"http://localhost:5173",
  }),
);
app.use(express.json());
app.use(morgan("dev"));

const scheduler = new Lembretes();
const server = http.createServer(app);
let id = 1;

app.post("/agendar", async (req, res) => {
  let config;
  try {
    console.log(req.body);
    const { horario, horario_fixo, datas, titulo, categoria } = req.body;
    //nome, url, config, recorrencia, horario, title, subscription
    if (!datas || !horario) {
      return res
        .status(400)
        .send({ erro: "Preencha a recorrencia ou a data e o horário!" });
    }

    /* -- DADOS --
      categoria: "medicao"
      dias: Set [ "*" ]
      horario: "03:21"
      horario_fixo: false
      titulo: "Mansão Vista Mar2"
    */
    const [hora, minuto] = horario.split(":");
    console.log(hora, minuto);
    if (typeof datas == "object") {
      const dias = Array.from(datas).join(",");
      console.log(dias)
      rule = horario_fixo
        ? `0 ${minuto} ${hora} * * ${dias}`
        : `0 */${minuto} */${hora} * * ${dias}`;
      config = {rule:rule, tz:"America/Sao_Paulo"};
    } else {
      const [ano, mes, dia] = datas.split("-");
      config = {year:ano,month: mes, date:dia, hour:hora, minute:minuto, tz:"America/Sao_Paulo"}
    }
    const resp = await scheduler.Criar(config, id, titulo);
    id++;
    return res.status(200).send({ mensagem: "Lembrete criado com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ erro: "Erro interno no servidor" });
  }
});

app.get("/listar", async (req, res) => {
  try {
    const resp = await scheduler.listar(id);
    return res.status(200).send({ resp });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ erro: "Erro interno no servidor" });
  }
});

app.delete("/remover-agenda/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .send({ erro: "Informe o lembrete a ser removido!" });
    }

    const resp = await scheduler.remover(parseInt(id));
    return res.status(200).send({ mensagem: "Lembrete removido com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ erro: "Erro interno no servidor" });
  }
});

app.post("/registrar-inscricao", async (req, res) => {
  let db, client;
  try {
    const { subscription } = req.body;
    if (!subscription) {
      const error = new Error();
      error.missingSubs = true;
      throw error;
    }
    const connection = await connect();
    db = connection.collection;
    client = connection.client;
    
    const registro = await db.insertOne(subscription);

    return res.status(201).send({ mensagem: "Inscrição feita com sucesso!" });
  } catch (error) {
    console.error(error);
    if (error.missingSubs) {
      return res.status(400).send({ erro: "Inscrição não enviada!" });
    }
    return res.status(500).send({ erro: "Falha no servidor!" });
  } finally {
    if (client) client.close();
  }
});

server.listen(8000, () => {
  console.log(`Server listening on http://localhost:8000`);
});
