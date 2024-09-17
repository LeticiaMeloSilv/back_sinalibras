const validarData = (data) => {

    
    if (data === "00-00-0000") {
        return false;
    }

     
    if (data === "0000-00-00") {
        return false;
    }
    
    const [dia, mes, ano] = data.split('-').map(Number);

    if (dia < 1 || dia > 31) {
        return false;
    }

    if (mes < 1 || mes > 12) {
        return false;
    }

    
 



    return true; 
}


function converterData(data) {

const partes = data.split('-');
  try{
  if (partes.length === 3) {

    const dia = partes[0];
    const mes = partes[1];
    const ano = partes[2];
      
    const dataFormatada = `${ano}-${mes}-${dia}`
      return dataFormatada;
    } else {
      return false
    }
}catch(error){
    console.log(error);
    return false
}
  }

module.exports = {
    validarData,
    converterData
}