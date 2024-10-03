const message = require('../modulo/config.js')
const comentarioDAO = require('../model/DAO/comentario.js');
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
                     let novoComentario = comentarioDAO.insertComentario(dadosComentario)

                     if(novoComentario){
                        let idComentario = await comentarioDAO.selectLastId()
                        dadosComentario.id_comentario = parseInt(idComentario)

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

module.exports = {
    setInserirNovoComentario
}
