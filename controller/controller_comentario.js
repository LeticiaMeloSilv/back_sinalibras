const message = require('../modulo/config.js')
const comentarioDAO = require('../model/DAO/comentarios.js');
const alunoDAO = require('../model/DAO/aluno.js')
const videoaulaDAO = require('../model/DAO/videoaula.js')
const postagemDAO = require('../model/DAO/postagem.js')
const professorDAO = require('../model/DAO/professor.js')
const { contentType } = require('express/lib/response');

const setInserirNovoComentarioAula = async function (dadosComentario, contentType){
    try{


        if(String(contentType).toLowerCase() == 'application/json'){

            jsonComentario = {}


            if(dadosComentario.data == null || dadosComentario.comentario == null || dadosComentario.id_videoaula == null || dadosComentario.id_aluno == null ||
                dadosComentario.data == '' || dadosComentario.comentario == '' || dadosComentario.id_videoaula == '' || dadosComentario.id_aluno == '' ||
                dadosComentario.data == undefined || dadosComentario.comentario == undefined || dadosComentario.id_videoaula == undefined || dadosComentario.id_aluno == undefined |
                dadosComentario.data.length > 10 || dadosComentario.comentario.length > 250 || isNaN(dadosComentario.id_videoaula) || isNaN(dadosComentario.id_aluno)){
                    return message.ERROR_REQUIRED_FIELDS
                }else{
                     let novoComentario = await comentarioDAO.insertComentario(dadosComentario)

                     if(novoComentario){
                        let idComentario = await comentarioDAO.selectLastId()
                        dadosComentario.id_comentario = idComentario[0].id_comentario

                        jsonComentario.comentario = dadosComentario
                        jsonComentario.status = message.SUCESS_CREATED_ITEM.status
                        jsonComentario.status_code = message.SUCESS_CREATED_ITEM.status_code
                        jsonComentario.message = message.SUCESS_CREATED_ITEM.message

                        return jsonComentario

                     }else{
                        return message.ERROR_INTERNAL_SERVER
                     }
                }

        } else {
            return message.ERROR_CONTENT_TYPE
        }
        

    }catch(error){
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getAllComentariosAula = async function (id){

    let idVideo = id

    if(idVideo == null || idVideo == undefined || isNaN(idVideo)){
        return message.ERROR_INVALID_ID
    }else{

        let comentarioJson = {}
        
        let comentarioVideo = await comentarioDAO.selectComentariosVideo(id)

        if(comentarioVideo){

            for(let comentario of comentarioVideo){
                let comentarioAluno = await alunoDAO.selectByIdAluno(comentario.id_aluno)
                delete comentario.id_aluno
                comentario.aluno = comentarioAluno
            }
            
            for(let comentario of comentarioVideo){
                let comentarioVideoaula = await videoaulaDAO.selectVideoaulaById(comentario.id_videoaula)
                delete comentario.id_videoaula
                comentario.videoaula = comentarioVideoaula
            }

            comentarioJson.comentarios = comentarioVideo
            comentarioJson.quantidade = comentarioVideo.length
            comentarioJson.status_code = 200

            return comentarioJson

        }else{
            return message.ERROR_INTERNAL_SERVER_DB
        }

    } 
   
}

const setDeleteComentarioAula = async function(id){

    try{

        let idComentario = id

        if(idComentario == null || idComentario == '' || isNaN(idComentario) || idComentario == undefined){
            return message.ERROR_INVALID_ID
        }else{

            let dadosComentario = await comentarioDAO.selectComentarioById(idComentario)

            if(dadosComentario){
            
                dadosComentario = await comentarioDAO.deleteComentario(idComentario)
                return message.SUCESS_DELETED_ITEM
        
            }else{
                return message.ERROR_NOT_FOUND_ID
            }
        }

    }catch(error){
        return message.ERROR_INTERNAL_SERVER
    }
}

const setInserirNovoComentarioPostagem = async function (dadosComentario, contentType){
    try{


        if(String(contentType).toLowerCase() == 'application/json'){

            jsonComentario = {}


            if(dadosComentario.comentario == null || dadosComentario.data == null || dadosComentario.id_postagem == null || dadosComentario.id_aluno == null ||
                dadosComentario.comentario == '' || dadosComentario.data == '' || dadosComentario.id_postagem == '' || dadosComentario.id_aluno == '' ||
                dadosComentario.comentario == undefined || dadosComentario.data == undefined || dadosComentario.id_postagem == undefined || dadosComentario.id_aluno == undefined |
                dadosComentario.comentario.length > 255 || dadosComentario.data.length > 10 || isNaN(dadosComentario.id_postagem) || isNaN(dadosComentario.id_aluno)){
                    return message.ERROR_REQUIRED_FIELDS
                }else{
                     let novoComentario = await comentarioDAO.insertComentario(dadosComentario)

                     if(novoComentario){
                        let idComentario = await comentarioDAO.selectLastId()
                        dadosComentario.id_comentario = idComentario[0].id_comentario

                        jsonComentario.comentario = dadosComentario
                        jsonComentario.status = message.SUCESS_CREATED_ITEM.status
                        jsonComentario.status_code = message.SUCESS_CREATED_ITEM.status_code
                        jsonComentario.message = message.SUCESS_CREATED_ITEM.message

                        return jsonComentario

                     }else{
                        return message.ERROR_INTERNAL_SERVER
                     }
                }

        } else {
            return message.ERROR_CONTENT_TYPE
        }
        

    }catch(error){
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getAllComentariosPostagem = async function (id){

    let idPostagem = id

    if(idPostagem == null || idPostagem == undefined || isNaN(idPostagem)){
        return message.ERROR_INVALID_ID
    }else{

        let comentarioJson = {}
        
        let comentarioPostagem = await comentarioDAO.selectComentariosPostagem(idPostagem)

        if(comentarioPostagem){

            for(let comentario of comentarioPostagem){
                let comentarioAluno = await alunoDAO.selectByIdAluno(comentario.id_aluno)
                delete comentario.id_aluno
                comentario.aluno = comentarioAluno
            }
            
            for(let comentario of comentarioPostagem){
                let comentarioPostagem = await postagemDAO.selectPostagemById(comentario.id_postagem)
                delete comentario.id_postagem
                comentario.postagem = comentarioPostagem
            }

            comentarioJson.comentarios = comentarioPostagem
            comentarioJson.quantidade = comentarioPostagem.length
            comentarioJson.status_code = 200

            return comentarioJson

        }else{
            return message.ERROR_INTERNAL_SERVER_DB
        }

    } 
   
}

const setDeleteComentarioPostagem = async function(id){

    try{

        let idComentario = id

        if(idComentario == null || idComentario == '' || isNaN(idComentario) || idComentario == undefined){
            return message.ERROR_INVALID_ID
        }else{

            let comentarioId = await comentarioDAO.selectComentarioById(idComentario)

            if(comentarioId){
               
                let comentarioDelete = await comentarioDAO.deleteComentario(idComentario)
             

                if(comentarioDelete){
                    return message.SUCESS_DELETED_ITEM
                }else{
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }else{
                return message.ERROR_NOT_FOUND_ID
            }
        }

    }catch(error){
    
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    setInserirNovoComentarioAula,
    getAllComentariosAula,
    setDeleteComentarioAula,
    setInserirNovoComentarioPostagem,
    getAllComentariosPostagem,
    setDeleteComentarioPostagem
}
