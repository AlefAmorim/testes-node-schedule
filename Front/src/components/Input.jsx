const Input = ({
  labelText,
  icon,
  type = "text",
  required = false,
  min,
  max,
  placeholder,
  id,
  name,
  changeHandler,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {labelText && (
        <label htmlFor={id || name} className="text-lg">
          {labelText}
          <span className={`${required ? "text-red-500" : "text-white"}`}>
            {required ? "*" : "(opicional)"}
          </span>
        </label>
      )}
      <div className="border border-zinc-500 rounded-md flex has-focus:outline-3 has-focus:outline-gray-700">
        {icon && <div className="p-2">{icon}</div>}
        <input
          type={type}
          min={min}
          max={max}
          id={id}
          name={name || id}
          onChange={changeHandler}
          className="w-full outline-0 p-2 cursor-text"
          required={required}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default Input;
