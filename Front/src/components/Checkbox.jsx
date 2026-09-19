// Se o defaultChecked não tiver um valor padrão e não passado como prop pelo elemento pai, ele será considerado como um elemento não controlado(uncontrolledCheckbox)

const Checkbox = ({textlabel, diasSelecionados, id, name, checked = false, changeHandler})=>{
  return (
    <div className="border border-zinc-500 rounded-md flex has-focus:outline-2 has-focus:outline-yellow-600/80 relative w-30 h-10 has-checked:disabled text-center justify-center items-center has-checked:text-yellow-400 has-checked:border-yellow-400 has-disabled:text-zinc-400">
      <label htmlFor={id || name} className="pointer-events-none">{textlabel}</label>
      <input className="w-full h-full absolute cursor-pointer disabled:cursor-not-allowed" type="checkbox" name={name || id} id={id} defaultChecked={checked}  onChange={changeHandler} disabled={diasSelecionados.recorrencia.has("*") && id != "*"}/>
    </div>
  );
}

export default Checkbox;