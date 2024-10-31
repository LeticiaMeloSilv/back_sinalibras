const moduloDAO = require('../model/DAO/modulo.js')
const message = require('../modulo/config.js')

const inserirNovoModulo = async function(dadosModulo, contentType){
    try{
        if(String(contentType).toLowerCase() == 'application/json'){
            let novoModuloJson = {}

            if(dadosModulo.modulo == undefined || dadosModulo.modulo == null || dadosModulo.modulo == '' || dadosModulo.modulo.length>20){
                return message.ERROR_REQUIRED_FIELDS
            }else{

                let status = true

                if(status){
                    let novoModulo = await moduloDAO.insertModulo(dadosModulo)

                    if(novoModulo){
                        let ultimoId = await moduloDAO.selectLastId()
                      
                        dadosModulo.id = Number(ultimoId[0].id_modulo)

                        novoModuloJson.modulo = dadosModulo
                        novoModuloJson.status = message.SUCESS_CREATED_ITEM.status
                        novoModuloJson.message = message.SUCESS_CREATED_ITEM.message
                        novoModuloJson.status_code = message.SUCESS_CREATED_ITEM.status_code

                        return novoModuloJson
                    }else{
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
                }

            }
        }else{
         
            return message.ERROR_CONTENT_TYPE
        }

    }catch(error){
        return false
    }
}

const setAtualizarModulo = async function (id, dadosModulo, contentType){
    try{
        console.log(contentType);

        let idModulo = id
        
        if(idModulo == undefined || idModulo == null || idModulo == '' || isNaN(idModulo)){
            return message.ERROR_INVALID_ID
            
        } else {
            if(String(contentType).toLowerCase() == 'application/json'){
                
                let updateModuloJson = {}

                 if(dadosModulo.modulo == null || dadosModulo.modulo == ' ' || dadosModulo.modulo.length > 20 || dadosModulo.modulo == undefined){
                    return message.ERROR_REQUIRED_FIELDS
                 } else {

                    let moduloId = await moduloDAO.selectModuloById(idModulo)
                        

                        if(moduloId.length>0){

                            let moduloAtualizado = await moduloDAO.updateModulo(idModulo, dadosModulo)

                            if(moduloAtualizado){

                                updateModuloJson.modulo = dadosModulo
                                updateModuloJson.status = message.SUCESS_UPDATED_ITEM.status
                                updateModuloJson.status_code = message.SUCESS_UPDATED_ITEM.status_code
                                updateModuloJson.message = message.SUCESS_UPDATED_ITEM.message
   
                                return updateModuloJson

                            }else{
                                 return message.ERROR_INTERNAL_SERVER_DB
                            }

                             
                        }else{
                              return message.ERROR_NOT_FOUND
                         }
                    
                }

            }else{
            
             return message.ERROR_CONTENT_TYPE
            }
        }

    }catch(error){
        console.log(error);
        return message.ERROR_INTERNAL_SERVER
    }
    
    
}

const setExcluirModulo = async function (id){

    try{
        idModulo = id

        if(idModulo == null || idModulo == undefined || idModulo == '' || isNaN(idModulo)){
            return message.ERROR_INVALID_ID
        }else{
            let dadosModulo = await moduloDAO.selectModuloById(idModulo)

            if(dadosModulo.length>0){
                dadosModulo = await moduloDAO.deleteModulo(idModulo)
                return message.SUCESS_DELETED_ITEM
            }else{
                return message.ERROR_NOT_FOUND_ID
            }
        }

    }catch(error){
        return message.ERROR_INTERNAL_SERVER
    }
}

 const getListaModulo = async function (){

    try{
        let moduloJson = {}

        let dadosModulo = await moduloDAO.selectAllModulos()

        if(dadosModulo){

            if(dadosModulo.length>0){

                moduloJson.modulo = dadosModulo
                moduloJson.quantidade = dadosModulo.length
                moduloJson.status_code = 200

                return moduloJson
            } else{
                return message.ERROR_NOT_FOUND
            }

        }else{
            return message.ERROR_INTERNAL_SERVER_DB
        }

    }catch(error){
        return false
    }
 }

 const getModuloById = async function (id){
    try{

        let idModulo = id

        let moduloJson = {}

        if(idModulo == null || idModulo == ' ' || isNaN(idModulo) || idModulo == undefined){
            return message.ERROR_INVALID_ID
        }else{
            let dadosModulo = await moduloDAO.selectModuloById(idModulo)

            if(dadosModulo){
                if(dadosModulo.length>0){
                    moduloJson.modulo = dadosModulo
                    moduloJson.status_code = 200

                    return moduloJson
                }else{
                    return message.ERROR_NOT_FOUND
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }

    }catch (error){
        return message.ERROR_INTERNAL_SERVER_DB
    }
 }

const getVideosDoModulo = async function(id){
    try{

        let idModulo = id

        let moduloJson = {}

        if(idModulo == null || idModulo == ' ' || isNaN(idModulo) || idModulo == undefined){
            return message.ERROR_INVALID_ID
        }else{

            let moduloId = await moduloDAO.selectModuloById(idModulo)

            if(moduloId){

                let dadosModulo = await moduloDAO.selectVideosModulo(idModulo)

            if(dadosModulo){
                if(dadosModulo.length>0){
                    moduloJson.video = dadosModulo
                    moduloJson.status_code = 200
                    return moduloJson
                }else{
                    return message.ERROR_NOT_FOUND
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_DB
            }

            }else{
                return message.ERROR_NOT_FOUND_ID
            }

            
        }

    }catch (error){
        return message.ERROR_INTERNAL_SERVER
    }
}



module.exports = {
    inserirNovoModulo,
    setAtualizarModulo,
    setExcluirModulo,
    getListaModulo,
    getModuloById,
    getVideosDoModulo
}