import { useState } from "react";
import "./App.css";
import { DIAS_SEMANA, REPETICOES } from "./assets/json/text.json";
import Input from "./components/Input";

function App() {
  const [isHorasMinutos, setIsHorasMinutos] = useState(false);

  const [datas, setDatas] = useState({
    diasSemana: [],
    minutos: "",
    horas: "",
    repeticoes:"",
  });

  const changeHandler = (e) => {
    const campo = e.target.name;
    if (campo === "repeticoes") {
      const novosDados = {...datas};
      novosDados[campo] = e.target.value;
      console.log(novosDados)
      setDatas(novosDados);
      console.log(datas)
      setIsHorasMinutos(e.target.value === 3);
    }
    // // switch(){}
  };

  return (
    <main className="min-h-dvh bg-sky-900  text-mauve-100 flex flex-col  items-center">
      <h1 className="text-5xl text-center font-semibold items-start justify-self-start p-5">
        Agendamento
      </h1>
      <div className="w-content  bg-zinc-900/40 backdrop-blur-4xl text-gray-100 h-full p-3 rounded-lg">
        <form action="" className="w-full h-full">
          <header>
            <h2 className="text-center font-semibold text-2xl">
              Faça seu Agendamento
              <Input />
            </h2>
          </header>
          <section>
            <h3>Dias da Semana</h3>
            <div className="grid grid-cols-2">
              {DIAS_SEMANA.map((dia) => (
                <div>
                  <input
                    id="diasSemana"
                    name="diasSemana"
                    type="checkbox"
                    value={dia.value}
                    onChange={(e) => changeHandler(e)}
                  />
                  <label htmlFor="">{dia.label}</label>
                </div>
              ))}
            </div>
          </section>
          <section className="flex gap-3">
            {/*isHorasMinutos ? (
              <div className="flex flex-col gap-2">
                <label htmlFor="">Horário</label>
                <input
                  type="time"
                  id="horario"
                  name="horario"
                  onClick={(e) => changeHandler(e)}
                  min="00:00"
                  max="23:59"
                  className="p-3 border-1 border-b-mist-400 rounded-xl"
                />
              </div>
            ) : */(
              <div>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex flex-col">
                    <label htmlFor="">A cada </label>
                    <Input
                      changeHandler={(e) => changeHandler(e)}
                      name="valor"
                      id="valor"
                      min={1}
                      max={datas.repeticoes == 1?24:60}
                      type="number"
                    />
                  </div>
                  <div className="h-full flex flex-col gap-2 items-center">
                    <label htmlFor="">Intervalo de :</label>
                    <select
                      onChange={(e) => changeHandler(e)}
                      name="repeticoes"
                      id="repeticoes"
                      className="p-2 border-gray-200 border-2 rounded-lg  font-semibold cursor-pointer focus:bg-white focus:text-taupe-950"
                    >
                      {REPETICOES.map((repeticao) => (
                        <option value={repeticao.value}>
                          {repeticao.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </section>
        </form>
      </div>
    </main>
  );
}

export default App;
