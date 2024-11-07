const message = require('../modulo/config.js')
const postagemDAO = require ('../model/DAO/postagem.js')
const professorDAO = require ('../model/DAO/professor.js')
const comentarioDAO = require('../model/DAO/comentarios.js')
const videoaulaDAO = require('../model/DAO/videoaula.js')
const nivelDAO = require('../model/DAO/nivel.js')
const moduloDAO = require('../model/DAO/modulo.js')
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

const setAtualizarPostagem = async function (id, dadosPostagem, contentType){

    try{

        let idPostagem = id

    if(idPostagem == undefined || idPostagem == null || idPostagem == '' || isNaN(idPostagem)){
        return message.ERROR_INVALID_ID
    } else {
        let postagem = await postagemDAO.selectPostagemById(idPostagem)
        if(postagem){
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
                                status = true 
                            }
                                 
                        } else {
                            status = true
                        }

                        if(status){
                            let postagemAtualizado = await postagemDAO.updatePostagem(idPostagem, dadosPostagem)
                           
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
    

        }else{
            return message.ERROR_NOT_FOUND_ID
        }
    }


    }catch(error){
        return message.ERROR_INTERNAL_SERVER
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

const getAllFeed = async function (){
    try{
        let feedJson = {}

        let dadosFeed = await postagemDAO.selectAllFeed()

        if(dadosFeed){


            for (let postagem of dadosFeed){
                let comentarioPostagem = await comentarioDAO.selectComentariosPostagem(postagem.id_postagem)
                postagem.comentarios = comentarioPostagem
                delete postagem.id_comentario
            }

            for (let postagem of dadosFeed){
                let professorPostagem = await professorDAO.selectByIdProfessor(postagem.id_professor)   
                postagem.professor = professorPostagem
                delete postagem.id_professor 
                
            }
            
            for (let videoaula of dadosFeed){
                let nivelVideoaula = await nivelDAO.selectNivelById(videoaula.id_nivel)   
                videoaula.nivel = nivelVideoaula
                delete videoaula.id_nivel 
                
            }

            for (let videoaula of dadosFeed){
                let moduloVideoaula = await moduloDAO.selectModuloById(videoaula.id_modulo)
                videoaula.modulo = moduloVideoaula
                delete videoaula.id_modulo
            }
            for (let videoaula of dadosFeed){
                let professorVideoaula = await professorDAO.selectByIdProfessor(videoaula.id_professor)
                videoaula.professor = professorVideoaula
                delete videoaula.id_professor
            }

            for (let videoaula of dadosFeed){
                let comentarioVideoaula = await comentarioDAO.selectComentariosAula(videoaula.id_videoaula)
                videoaula.comentarios = comentarioVideoaula
                delete videoaula.id_comentario
            }

            feedJson.feed = dadosFeed
            feedJson.quantidade = dadosFeed.length
            feedJson.status_code = 200
            return feedJson
       
        } else {
            return message.ERROR_NOT_FOUND
        }

    }catch(error){
        console.log(error);
        return message.ERROR_INTERNAL_SERVER
    }
    
  
}

const getPostagemById = async function (id){
    try{

       let idPostagem = id

       let postagemJson = {}

    if(idPostagem == undefined || idPostagem == ' ' || isNaN(idPostagem)){
        return message.ERROR_INVALID_ID
    }else{
    
        let dadosPostagem = await postagemDAO.selectPostagemById(idPostagem)

        if(dadosPostagem){

            for (let postagem of dadosPostagem){
                let professorPostagem = await professorDAO.selectByIdProfessor(postagem.id_professor)
                postagem.professor = professorPostagem
                delete postagem.id_professor
            }

            for (let postagem of dadosPostagem){
                let comentarioPostagem = await comentarioDAO.selectComentariosAula(postagem.id_postagem)
                postagem.comentarios = comentarioPostagem
                delete postagem.id_comentario
            }



            postagemJson.postagem = dadosPostagem
            postagemJson.status_code = 200


            return postagemJson

        }else{
            return message.ERROR_NOT_FOUND
        }
    }


    }catch(error){       
        return false
    }

    
}

const getPostagemByNome = async function (texto){
    try{

       let textoPostagem = texto

       let postagemJson = {}

    if(idPostagem == undefined || idPostagem == ' ' || isNaN(idPostagem)){
        return message.ERROR_INVALID_ID
    }else{
    
        let dadosPostagem = await postagemDAO.selectPostagemByNome(textoPostagem)

        if(dadosPostagem){
           
            for (let postagem of dadosPostagem){
                let professorPostagem = await professorDAO.selectByIdProfessor(postagem.id_professor)
                postagem.professor = professorPostagem
                delete postagem.id_professor
            }

            for (let postagem of dadosPostagem){
                let comentarioPostagem = await comentarioDAO.selectComentariosAula(postagem.id_postagem)
                postagem.comentarios = comentarioPostagem
                delete postagem.id_comentario
            }


            postagemJson.postagem = dadosPostagem
            postagemJson.status_code = 200
            return postagemJson

        }else{
            return message.ERROR_NOT_FOUND
        }
    }


    }catch(error){
        return false
    }

    
}


module.exports = {
    inserirNovaPostagem,
    setAtualizarPostagem,
    setExcluirPostagem,
    getAllFeed,
    getPostagemById,
    getPostagemByNome
}