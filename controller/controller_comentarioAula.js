const message = require('../modulo/config.js')
const comentarioDAO = require('../model/DAO/comentarioAula.js');
const alunoDAO = require('../model/DAO/aluno.js')
const videoaulaDAO = require('../model/DAO/videoaula.js')
const { contentType } = require('express/lib/response');

const setInserirNovoComentario = async function (dadosComentario, contentType){
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

const getAllComentariosVideo = async function (id){

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

const setDeleteComentario = async function(id){

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

module.exports = {
    setInserirNovoComentario,
    getAllComentariosVideo,
    setDeleteComentario
}
