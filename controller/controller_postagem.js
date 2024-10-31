const message = require('../modulo/config.js')
const postagemDAO = require ('../model/DAO/postagem.js')
const professorDAO = require ('../model/DAO/professor.js')
const comentarioPostagemDAO = require('../model/DAO/comentarioPostagem.js')
const { Prisma } = require('@prisma/client')

const inserirNovaPostagem = async function (dadosPostagem, contentType){

    try{

        if(String(contentType).toLowerCase() == 'application/json'){

            let novaPostagemJson = {}

            if(dadosPostagem.texto == null || dadosPostagem.id_professor == null || dadosPostagem.data == null || 
                dadosPostagem.texto == '' || dadosPostagem.id_professor == '' || dadosPostagem.data == '' || 
                dadosPostagem.texto == undefined || dadosPostagem.id_professor == undefined || dadosPostagem.data == undefined || 
                dadosPostagem.texto.length > 250 || isNaN(dadosPostagem.id_professor) || dadosPostagem.data.length > 10){
                return message.ERROR_REQUIRED_FIELDS
            }else{
                let status = false

                if(dadosPostagem.foto_postagem != null &&
                    dadosPostagem.foto_postagem != '' &&
                    dadosPostagem.foto_postagem != undefined
                ){
                    if(dadosPostagem.foto_postagem.length > 255){
                        return message.ERROR_REQUIRED_FIELDS
                    }else{
                        status = true
                    }
                } else{
                    status = true
                }

                if (status){
                    let novaPostagem = await postagemDAO.insertPostagem(dadosPostagem)
    
                    if(novaPostagem){
                        let ultimoId = await postagemDAO.selectUltimoId()
                        dadosPostagem.id_postagem = Number(ultimoId[0].id)
                 

                        novaPostagemJson.postagem = dadosPostagem
                        novaPostagemJson.status = message.SUCESS_CREATED_ITEM.status
                        novaPostagemJson.status_code = message.SUCESS_CREATED_ITEM.status_code
                        novaPostagemJson.message = message.SUCESS_CREATED_ITEM.message

                        return novaPostagemJson
                    }else {
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
                }
            }
        }else{
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error){
        return message.ERROR_INTERNAL_SERVER
    }
}

const setAtualizarPostagem = async function (dadosPostagem, contentType, id){
    let idPostagem = id

    if(idPostagem == undefined || idPostagem == null || idPostagem == '' || isNaN(idPostagem)){
        return message.ERROR_INVALID_ID
    } else {
        let idPostagem = await postagemDAO.selectPostagemById(idPostagem)
        
        if(idPostagem > 0){

            try{
                if(String(contentType).toLowerCase () == 'application/json'){
                    let updatePostagemJson = {}

                    if(dadosPostagem.texto == null || dadosPostagem.id_professor == null || dadosPostagem.data == null || 
                        dadosPostagem.texto == '' || dadosPostagem.id_professor == '' || dadosPostagem.data == '' || 
                        dadosPostagem.texto == undefined || dadosPostagem.id_professor == undefined || dadosPostagem.data == undefined || 
                        dadosPostagem.texto.length > 250 || isNaN(dadosPostagem.id_professor) || dadosPostagem.data.length > 10)
                        {
                        return message.ERROR_REQUIRED_FIELDS

                    }else{

                        let status = false
                        if(dadosPostagem.foto_postagem != null &&
                            dadosPostagem.foto_postagem != '' &&
                            dadosPostagem.foto_postagem != undefined
                        ){
                            if(dadosPostagem.foto_postagem.length>255){
                                return message.ERROR_REQUIRED_FIELDS
                            } else {
                                validate = true 
                            }
                                 
                        } else {
                            validate = true
                        }

                        if(validate){
                            let postagemAtualizado = await postagemDAO.updatePostagem(idPostagem)

                            if(postagemAtualizado){

                                updatePostagemJson.postagem = dadosPostagem
                                updatePostagemJson.status = message.SUCESS_UPDATED_ITEM.status
                                updatePostagemJson.status_code = message.SUCESS_UPDATED_ITEM.status_code
                                updatePostagemJson.message = message.SUCESS_UPDATED_ITEM.message

                                return updatePostagemJson
                            }else{
                                return message.ERROR_INTERNAL_SERVER_DB
                            }
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

const setExcluirPostagem = async function (id){
    try{

        let idPostagem = id

        if(idPostagem == undefined || idPostagem == ' ' || isNaN(idPostagem)){
            return message.ERROR_INVALID_ID
        }else{
             let dadosPostagem = await postagemDAO.selectPostagemById(idPostagem)
             
             if(dadosPostagem.length>0){

                dadosPostagem = await postagemDAO.deletePostagem(idPostagem)
                return message.SUCESS_DELETED_ITEM
             }else{
                return message.ERROR_NOT_FOUND_ID
             }
        }

    }catch (error){
        return message.ERROR_INTERNAL_SERVER
    }
}

const getListaPostagens = async function (){
    let postagemJson = {}

    let dadosPostagem = await postagemDAO.selectAllPostagens()

    if(dadosPostagem){

        if(dadosPostagem.length>0){

            for (let postagem of dadosPostagem){
                let professorPostagem = await professorDAO.selectByIdProfessor(postagem.id_professor)   
                postagem.professor = professorPostagem
                delete postagem.id_professor 
                
            }

            postagemJson.postagems = dadosPostagem
            postagemJson.quantidade = dadosPostagem.length
            postagemJson.status_code = 200
            return postagemJson
       
        } else {
            return message.ERROR_NOT_FOUND
        }
    }else{
        return message.ERROR_INTERNAL_SERVER_DB
    }
}


module.exports = {
    inserirNovaPostagem,
    setAtualizarPostagem,
    setExcluirPostagem,
    getListaPostagens
}