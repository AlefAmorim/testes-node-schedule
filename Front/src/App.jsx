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
    recorrencia: new Set(),
    horario_fixo: "false",
    tipo_recorrencia: "",
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

      const granted = await askingPermission();
      const subscription = await subscribeUserToPush(registration);
      const response = await api.post("/dispositivos/cadastrar-dispositivo", {
        subscription,
      });
      const { data } = response;
      show("Sucesso-toast", data.mensagem);
    } catch (error) {
      console.error(error);
      const { data } = error.response;
      setHasNotify(Notification.permission);
      show("Error-toast", data.erro || "Falha ao regstrar o usuário!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let dadosLembrete = { ...dados };
    if (typeof dados.recorrencia == "object") {
      dadosLembrete = {
        ...dadosLembrete,
        recorrencia: Array.from(dados.recorrencia),
      };
    }
    try {
      const response = await api.post("/lembretes/criar-lembrete", {
        dados: dadosLembrete,
      });
      const { data } = response;
      show("Sucesso-toast", data.mensagem);
    } catch (error) {
      console.error(error);
      const { data } = error.response;
      show(
        "Erro-toast",
        data.erro || "Falha ao criar lembrete!Tente novamente mais tarde.",
      );
    }
  };

  const handleCheck = (e) => {
    const { id, checked } = e.target;
    const { recorrencia } = dados;
    checked ? recorrencia.add(id) : recorrencia.delete(id);
    setDados({
      ...dados,
      recorrencia,
    });
  };

  const changeHandler = (e) => {
    const campo = e.target.name;
    const currentData = { ...dados };
    currentData[campo] =
      campo == "horario_fixo"
        ? e.target.checked
          ? "true"
          : "false"
        : e.target.value;

    setDados(currentData);
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
      // console.log(date.toISOString());

      // console.log(Date.now().toLocaleString());
    })();
  }, []);

  return (
    <main className="min-h-dvh min-w-dvw bg-zinc-900 p-2  text-zinc-800 flex justify-center  items-center">
      <section className="bg-zinc-800 text-white rounded-md w-150 min-h-full p-2">
        <header className="p-3 h-1/3 w-2/2 flex justify-evenly items-center">
          <div>
            <h1 className="text-2xl font-semibold">Crie os seus lembretes</h1>
            <p className="balance text-zinc-500">
              {" "}
              Selecione o horário e os dias da semana ou data para o lembrete.
            </p>
          </div>
          {hasNotify !== "granted" && (
            <button
              className="bg-yellow-600 p-2 w-15 h-10 flex items-center justify-center  text-center text-white rounded-md cursor-pointer hover:scale-103 transition-all"
              title={`${hasNotify ? "Desativar" : "Ativar"} notificações`}
              onClick={notifyHandler}
            >
              <MdNotifications size={20} />
            </button>
          )}
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
              name="tipo_recorrencia"
              id="tipo_recorrencia"
              options={RECORRENCIA}
              required={true}
              changeHandler={(e) => changeHandler(e)}
            />

            {dados.tipo_recorrencia == "" ? (
              <span className="text-center font-semibold text-zinc-400">
                Selecione acima para ver as opções.
              </span>
            ) : dados.tipo_recorrencia == 2 ? (
              <Input
                id="recorrencia"
                name="recorrencia"
                min={dataAtual}
                labelText="Recorrencia"
                type="date"
                changeHandler={(e) => changeHandler(e)}
              />
            ) : (
              <div className="flex flex-wrap justify-center gap-2">
                {DIAS_SEMANA.map((dia, index) => (
                  <Checkbox
                    key={index}
                    id={dia.value}
                    name="recorrencia"
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
