

const Checkbox = ({id, name, changeHandler})=>{
  return (
    <div className="">
      <input type="checkbox" name={name || id} id={id} onChange={changeHandler} />
    </div>
  );
}

export default Checkbox;