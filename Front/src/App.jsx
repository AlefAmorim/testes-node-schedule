import { useEffect, useState } from "react";
import "./App.css";
import { DIAS_SEMANA, CATEGORIAS, RECORRENCIA } from "./assets/json/text.json";
import Input from "./components/Input";
import Select from "./components/Select.jsx";
import Checkbox from "./components/Checkbox.jsx";

import Button from "./components/Button.jsx";
import {
  askingPermission,
  registerServiceWorker,
  subscribeUserToPush,
  verificarCompatibilidade,
} from "./utils/register/register";
import { show } from "./utils/alert/alert";
import { MdNotifications, MdNotificationsOff } from "react-icons/md";
import api from "./service/api.js";

const after =
  "after:scale-0 after:w-3 after:h-3 after:rounded-xs after:content-[''] after:absolute after:transition-all after:bg-zinc-500";

function App() {
  const [registration, setRegistration] = useState(null);
  const [dataAtual, setDataAtual] = useState();
  const [hasNotify, setHasNotify] = useState(Notification.permission);
  const [dados, setDados] = useState({
    titulo: "",
    horario: "",
    categoria: "",
    recorrencia: "",
    horario_fixo: false,
    datas: new Set(),
  });

  const notifyHandler = async () => {
    try {
      if (Notification.permission === "denied") {
        show(
          "Info-toast",
          "Altere as configurações de notificação do navegador!",
        );
        return;
      }

      const compatibilidade = await verificarCompatibilidade();
      if (compatibilidade.erro) {
        show("Erro-toast", compatibilidade.message);
      }

      console.log(Notification.permission);
      console.log(hasNotify);
      console.log(registration)
      const granted = await askingPermission();
      const subscription = await subscribeUserToPush(registration);
      const response = await api.post("/registrar-inscricao", { subscription });
      console.log(response);
    } catch (error) {
      console.error(error);
      setHasNotify(Notification.permission);
      show("Error-toast", "Falha ao regstrar o usuário!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const [horas, minutos] = dados.horario.split(':');
    // console.log(dados.horario);
    // // const [ano, mes, dia] = dados.datas.split('-');
    // const data = new Date(2026, 7, 7, horas, minutos);
    // console.log(data)
    // console.log(new Intl.DateTimeFormat('pt-BR').format(data));
    let dadosLembrete = {...dados};
    if(typeof dados.datas == 'object'){
      dadosLembrete = {
        ...dadosLembrete,
        datas:Array.from(dados.datas)
      };
    }
    try {
      const response = await api.post('/agendar', dadosLembrete);
      console.log(response)
      show('Sucesso-Toast', 'Lembrete criado com sucesso!');
    }catch(error) {
      console.error(error);
      show('Erro-Toast', 'Falha ao criar lembrete!Tente novamente mais tarde.');
    }
  };

  const handleCheck = (e) => {
    const { id, checked } = e.target;
    const { datas } = dados;
    console.log(id);
    checked ? datas.add(id) : datas.delete(id);
    setDados({
      ...dados,
      datas,
    });
    console.log(dados);
  };

  const changeHandler = (e) => {
    const campo = e.target.name;
    const currentData = { ...dados };
    currentData[campo] =
      campo == "horario_fixo" ? e.target.checked : e.target.value;

    setDados(currentData);
    console.log(dados);
  };

  useEffect(() => {
    // Quando o usuário clicar no botão de notificação
    // Verificar a compatibilidade com a funcionalidade
    // Caso não tenha, notificá-lo
    // Caso o contrário, pedir permissão para notificações
    (async () => {
      setRegistration(await registerServiceWorker());

      const date = new Date();
      setDataAtual(date.toISOString());
      console.log(date.toISOString());

      console.log(Date.now().toLocaleString());
    })();
  }, []);

  return (
    <main className="min-h-dvh min-w-dwh bg-zinc-900 p-2  text-zinc-800  items-center">
      <section className="bg-zinc-800 text-white rounded-md w-full min-h-full p-2">
        <header className="p-3 h-1/3 w-2/2 flex justify-evenly items-center">
          <div>
            <h1 className="text-2xl font-semibold">Crie os seus lembretes</h1>
            <p className="balance text-zinc-500">
              {" "}
              Selecione o horário e os dias da semana ou data para o lembrete.
            </p>
          </div>
          <button
            className="bg-yellow-600 p-2 w-15 h-10 flex items-center justify-center  text-center text-white rounded-md cursor-pointer hover:scale-103 transition-all"
            title={`${hasNotify ? "Desativar" : "Ativar"} notificações`}
            onClick={notifyHandler}
          >
            {hasNotify === "granted" ? (
              <MdNotifications size={20} />
            ) : (
              <MdNotificationsOff size={20} />
            )}
          </button>
        </header>
        <section className="flex p-5 justify-baseline overflow-y-scroll scroll-smooth">
          <form
            onSubmit={(e) => handleSubmit(e)} // Isso faz com que a checbox pare de funcionar
            className="w-full flex flex-col gap-3 overflow-y-scroll scroll-smooth"
          >
            <Input
              labelText="Título"
              id="titulo"
              name="titulo"
              required={true}
              placeholder="Titulo para o lembrete"
              changeHandler={(e) => changeHandler(e)}
            />

            <div className="flex flex-col gap-2">
              <Input
                labelText="Horário"
                id="horario"
                name="horario"
                required={true}
                placeholder="EX: 09:30"
                type="time"
                changeHandler={(e) => changeHandler(e)}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className={`flex justify-center items-center w-5 h-5 rounded-md border-2 border-zinc-500 cursor-pointer relative ${after} checked:after:scale-100`}
                  name="horario_fixo"
                  id="horario_fixo"
                  onChange={(e) => changeHandler(e)}
                />
                <label htmlFor="horario_fixo">Horário fixo</label>
              </div>
            </div>

            <Select
              labelText="Categoria"
              name="categoria"
              id="categoria"
              options={CATEGORIAS}
              required={true}
              changeHandler={(e) => changeHandler(e)}
            />

            <Select
              labelText="Recorrencia"
              name="recorrencia"
              id="recorrencia"
              options={RECORRENCIA}
              required={true}
              changeHandler={(e) => changeHandler(e)}
            />

            {dados.recorrencia == "" ? (
              <span className="text-center font-semibold text-zinc-400">
                Selecione acima para ver as opções.
              </span>
            ) : dados.recorrencia == 2 ? (
              <Input
                id="datas"
                name="datas"
                min={dataAtual}
                labelText="Data"
                type="date"
                changeHandler={(e) => changeHandler(e)}
              />
            ) : (
              <div className="flex flex-wrap justify-center gap-2">
                {DIAS_SEMANA.map((dia, index) => (
                  <Checkbox
                    key={index}
                    id={dia.value}
                    name="datas"
                    diasSelecionados={dados}
                    textlabel={dia.label}
                    checked={dia.checked}
                    changeHandler={(e) => handleCheck(e)}
                  />
                ))}
              </div>
            )}

            <Button type="submit" textButton="Criar lembrete" />
          </form>
        </section>
      </section>
      {/* <section className="flex flex-col">
        <header className="flex justify-center">
          <h2 className="text-white font-semibold text-2xl">Seus Lmebretes</h2>
        </header>
        <section className="text-center">
          <span className="text-center font-semibold text-zinc-400">
            Nenhuma agenda!Crie uma no formulário a esquerda.
          </span>{" "}
        </section>
      </section> */}
    </main>
  );
}

export default App;
