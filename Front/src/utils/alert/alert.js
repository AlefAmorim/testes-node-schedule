import Swal from 'sweetalert2';


export async function show(type, message, timer) {
  switch(type){
    case "Sucesso-toast":
      await Swal.fire({
        toast:true,
        title:message || "Sucesso",
        timer:timer || 2000,
        timerProgressBar:true,
        showConfirmButton:false,
        position:"top-end",
        icon:"success",
        didOpen:(toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      })
      break;
    case "Erro-toast":
      await Swal.fire({
        toast:true,
        title:message || "Erro",
        timer:timer || 2000,
        timerProgressBar:true,
        showConfirmButton:false,
        position:"top-end",
        icon:"error",
        didOpen:(toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      })
      break;
      case "Info-toast":
      await Swal.fire({
        toast:true,
        title:message || "Erro",
        timer:timer || 2000,
        timerProgressBar:true,
        showConfirmButton:false,
        position:"top-end",
        icon:"info",
        didOpen:(toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      })
      break;
    default:
      break;
  }
}