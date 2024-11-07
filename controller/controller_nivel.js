const nivelDAO = require('../model/DAO/nivel')
const message = require('../modulo/config.js')

const inserirNovoNivel = async function(dadosNivel, contentType){
    try{

        if(String(contentType).toLowerCase() == 'application/json'){
            let novoNivelJson = {}

            if(dadosNivel.nivel == undefined || dadosNivel.nivel == null || dadosNivel.nivel == '' || dadosNivel.nivel.length>20 ||
                dadosNivel.icon == undefined || dadosNivel.icon == null || dadosNivel.icon == '' || dadosNivel.icon.length>255){
                return message.ERROR_REQUIRED_FIELDS
            }else{

                let status = true

                if(status){
                    let novoNivel = await nivelDAO.insertNivel(dadosNivel)
                
                   
                    if(novoNivel){
                        let ultimoId = await nivelDAO.selectLastId()
                    
                        
                        dadosNivel.id_nivel = Number(ultimoId[0].id)


                        novoNivelJson.nivel = dadosNivel
                        novoNivelJson.status = message.SUCESS_CREATED_ITEM.status
                        novoNivelJson.message = message.SUCESS_CREATED_ITEM.message
                        novoNivelJson.status_code = message.SUCESS_CREATED_ITEM.status_code

                        return novoNivelJson
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

const setAtualizarNivel = async function (id, dadosNivel, contentType){
    let idNivel = id

    if(idNivel == undefined || idNivel == null || idNivel == '' || isNaN(idNivel)){
        return message.ERROR_INVALID_ID
    } else {
        let idNivel = await nivelDAO.selectNivelById(idNivel)
        
        if(idNivel > 0){

            try{
                if(String(contentType).toLowerCase () == 'application/json'){
                    let updateNivelJson = {}

                    if(dadosNivel.nivel == undefined || dadosNivel.nivel == null || dadosNivel.nivel == '' || dadosNivel.nivel.length>20 ||
                    dadosNivel.icon == undefined || dadosNivel.icon == null || dadosNivel.icon == '' || dadosNivel.icon,length>255){
                        return message.ERROR_REQUIRED_FIELDS
                    } else {

                            let nivelAtualizado = await nivelDAO.updateNivel(idNivel)

                            if(nivelAtualizado){

                                updateNivelJson.nivel = dadosVideoaula
                                updateNivelJson.status = message.SUCESS_UPDATED_ITEM.status
                                updateNivelJson.status_code = message.SUCESS_UPDATED_ITEM.status_code
                                updateNivelJson.message = message.SUCESS_UPDATED_ITEM.message

                                return updateNivelJson
                            }else{
                                return message.ERROR_INTERNAL_SERVER_DB
                            }
                    
                    }

                }else{
                    return message.ERROR_CONTENT_TYPE
                }
            }catch(error){
                return message.ERROR_INTERNAL_SERVER
            }
    

        }else{
            return message.ERROR_NOT_FOUND_ID
        }
    }
}

const setExcluirNivel = async function (id){

    try{
        idNivel = id

        if(idNivel == null || idNivel == undefined || idNivel == '' || isNaN(idNivel)){
            return message.ERROR_INVALID_ID
        }else{
            let dadosNivel = await nivelDAO.selectNivelById(idNivel)

            if(dadosNivel.length>0){
                dadosNivel = await nivelDAO.deleteNivel(idNivel)
                return message.SUCESS_DELETED_ITEM
            }else{
                return message.ERROR_NOT_FOUND_ID
            }
        }

    }catch(error){
        return message.ERROR_INTERNAL_SERVER
    }
}

 const getListaNivel = async function (){

    try{
        let nivelJson = {}

        let dadosNivel = await nivelDAO.selectAllNiveis()
        
        if(dadosNivel){

            if(dadosNivel.length>0){

                nivelJson.niveis = dadosNivel
                nivelJson.quantidade = dadosNivel.length
                nivelJson.status_code = 200

                return nivelJson
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

 const getNivelById = async function (id){
    try{

        let idNivel = id

        let nivelJson = {}

        if(idNivel == null || idNivel == ' ' || isNaN(idNivel) || idNivel == undefined){
            return message.ERROR_INVALID_ID
        }else{

            let dadosNivel = await nivelDAO.selectNivelById(idNivel)
            

            if(dadosNivel){

                nivelJson.nivel = dadosNivel
                nivelJson.status_code = 200

                return nivelJson
                            
            }else{
             
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }

    }catch (error){
       
        return message.ERROR_INTERNAL_SERVER
    }
 }



module.exports = {
    inserirNovoNivel,
    setAtualizarNivel,
    setExcluirNivel,
    getListaNivel,
    getNivelById
}