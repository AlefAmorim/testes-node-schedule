const Select = ({
  options = [],
  labelText,
  icon,
  required = false,
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
        <select
          id={id}
          name={name || id}
          onChange={changeHandler}
          className="w-full outline-0 p-2 cursor-pointer"
          required={required}
        >
          {options.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;
