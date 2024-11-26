/************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, consistência de dados das  requisicões da API de usuários
 * Data: 14/11/2024
 * Autor: Julia Mendes 
 * Versão: 1.0
 * 
************************************************************************************************************/
const message = require('../modulo/config.js')
const videoaulaSalvaDAO = require('../model/DAO/videoSalvo.js')
const alunoDAO = require('../model/DAO/aluno.js');
const controller_aluno = require('./controller_aluno.js')
const controllerVideoaula = require('./controller_videoaula.js')


const setInserirVideoSalvo = async(dadosVideoSalvo, contentType) => {

    try {
     
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultadoVideoSalvo = {}

            let videoaula = await controllerVideoaula.getVideoaulaById(dadosVideoSalvo.id_videoaula)
            let aluno = await controller_aluno.getBuscarAlunoById(dadosVideoSalvo.id_aluno)


            if(
                dadosVideoSalvo.id_videoaula == ''   || dadosVideoSalvo.id_videoaula == undefined   ||
                dadosVideoSalvo.id_aluno == ''  || dadosVideoSalvo.id_aluno == undefined  ||
                aluno.status == false               ||
                videoaula.status == false                 
            ){

                return message.ERROR_REQUIRED_FIELDS // 400  

            }else{

                //Envia os dados para a model inserir no BD
                let novoVideoSalvo = await videoaulaSalvaDAO.insertVideoSalvo(dadosVideoSalvo)
                console.log(novoVideoSalvo);
                
                let id = await videoaulaSalvaDAO.selectLastIdVideoSalvo()
                
                dadosVideoSalvo.videoaula = videoaula.videoaula.titulo
                dadosVideoSalvo.id_aluno = aluno.aluno.id_aluno
                dadosVideoSalvo.aluno = aluno.aluno.nome
                dadosVideoSalvo.id = Number(id.id_videoaula)
                
                //Valida se o BD inseriu corretamente os dados
                if(novoVideoSalvo){

                    resultadoVideoSalvo.status = message.CREATED_ITEM.status
                    resultadoVideoSalvo.status_code = message.CREATED_ITEM.status_code
                    resultadoVideoSalvo.message = message.CREATED_ITEM.message
                    resultadoVideoSalvo.video_salvo = dadosVideoSalvo
                    return resultadoVideoSalvo

                }else {

                    return message.ERROR_INTERNAL_SERVER_DB // 500

                }
        
            }
    
        }else{
            return message.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        console.log( "erro:" +  error);
        return message.ERROR_INTERNAL_SERVER // 500
    }

}

module.exports = {
    setInserirVideoSalvo
}