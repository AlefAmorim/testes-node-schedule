const Input = ({
  labelText,
  type = "text",
  min,
  max,
  id,
  name,
  changeHandler,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {labelText && <label htmlFor={id || name}></label>}
      <input type={type} min={min} max={max} id={id} name={name || id} onChange={changeHandler} className="p-2 border-2 rounded-lg font-semibold focus:bg-white focus:text-taupe-950"/>
    </div>
  );
};

export default Input;
