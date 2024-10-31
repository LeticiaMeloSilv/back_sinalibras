const message = require('../modulo/config.js')
const comentarioDAO = require('../model/DAO/comentarioPostagem.js');
const alunoDAO = require('../model/DAO/aluno.js')
const postagemDAO = require('../model/DAO/postagem.js')
const { contentType } = require('express/lib/response');

const setInserirNovoComentario = async function (dadosComentario, contentType){
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

const setDeleteComentario = async function(id){

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
    setInserirNovoComentario,
    getAllComentariosPostagem,
    setDeleteComentario
}
