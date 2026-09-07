const Button = ({type = "button", textButton, id, className, handleClick , icon }) => {
  return (
    <div>
      {icon}
      <button type={type} id={id} className={className || "cursor-pointer h-10 w-full bg-yellow-500 rounded-md hover:bg-yellow-400 transition-colors font-semibold text-lg"} onClick={handleClick}>
        {textButton}
      </button>
    </div>
  )
}


export default Button;