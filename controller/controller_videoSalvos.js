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
const controllerAluno = require('./controller_aluno.js')
const controllerVideoaula = require('./controller_videoaula.js')

const setInserirVideoAulaSalva = async function (dadosVideoaula, contentType){

    try{

        if(String(contentType).toLowerCase() == 'application/json'){

           const aluno = await alunoDAO.selectByIdAluno(dadosVideoaula.id_aluno)
           const videoaula = await controllerVideoaula.getVideoaulaById(dadosVideoaula.id_videoaula)

            let novaVideoaulaJson = {}

            if( isNaN(dadosVideoaula.id_videoaula) || isNaN(dadosVideoaula.id_aluno)){
                return message.ERROR_REQUIRED_FIELDS
            }else{
        
                    let novaVideoaulaSalva = await videoaulaSalvaDAO.insertVideoSalvo(dadosVideoaula)
                    console.log(novaVideoaulaSalva);
          
    
                    if(novaVideoaulaSalva){
                        let ultimoId = await videoaulaSalvaDAO.selectLastIdVideoSalvo()
                        dadosVideoaula.id_videoaula = Number(ultimoId[0].id)

                        novaVideoaulaJson.videoaula = dadosVideoaula
                        novaVideoaulaJson.aluno = aluno[0]
                        novaVideoaulaJson.videoaula = videoaula
                        novaVideoaulaJson.status = message.SUCESS_CREATED_ITEM.status
                        novaVideoaulaJson.status_code = message.SUCESS_CREATED_ITEM.status_code
                        novaVideoaulaJson.message = message.SUCESS_CREATED_ITEM.message

                        return novaVideoaulaJson
                    }else {
                      
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
                
        }
        }else{
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error){
        console.log("error:" + error);
        return message.ERROR_INTERNAL_SERVER
    }
}


const setExcluirVideoaulaSalva = async function (id, condicional) {
    try {
        let resultado;

        if (condicional === 'videoaula') {
            let registrosVideoSalvos = await videoaulaSalvaDAO.selectByIdVideoaula(id);

            if (registrosVideoSalvos.length > 1) {
                // Se a videoaula foi salva por outros alunos, exclui apenas o registro do aluno atual
                // Para isso, você precisa passar o ID do aluno também
                resultado = await videoaulaSalvaDAO.deleteVideoSalvoByAlunoEvideoaula( registrosVideoSalvos[0].id_aluno, id);
            } else {
                // Se a videoaula foi salva por apenas um aluno, a videoaula será removida completamente
                resultado = await videoaulaSalvaDAO.deleteVideoSalvoByIdVideoAula(id);
            }
        } else if (condicional === 'aluno') {
           
            resultado = await videoaulaSalvaDAO.deleteVideoSalvobyIdAluno(registrosVideoSalvos[0].id_aluno);
        } else {
            return message.ERROR_INVALID_CONDICIONAL;
        }

        if (resultado) {
            return {
                status: message.SUCESS_DELETED_ITEM,
                status_code: message.SUCESS_DELETED_ITEM,
                message: 'Videoaula(s) excluída(s) com sucesso.'
            };
        } else {
            return message.ERROR_INTERNAL_SERVER_DB;
        }

    } catch (error) {
        console.log("Erro ao excluir videoaula: " + error);
        return message.ERROR_INTERNAL_SERVER;
    }
};


const getVideoSalvoByIdAluno = async function (id) {
    try {
        if (isNaN(id)) {
            return message.ERROR_INVALID_ID;
        }

        let dadosVideoSalvo = await videoaulaSalvaDAO.selectByIdAlunoVideosSalvo(id);

        if (!dadosVideoSalvo) {
            return message.ERROR_INTERNAL_SERVER_DB;
           
        }

        const aluno = await alunoDAO.selectByIdAluno(dadosVideoSalvo.id_aluno);
        const videoaula = await controllerVideoaula.getVideoaulaById(dadosVideoSalvo.id_videoaula);
        

        if (dadosVideoSalvo.length > 0) {
            return {
                videoaula : dadosVideoSalvo,
                aluno: aluno[0],
                videoAula: videoaula,
                status_code: 200
            };
        } else {
           
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.log("Error: " + error);
        return message.ERROR_INTERNAL_SERVER;
    }
};


module.exports = {
    setInserirVideoAulaSalva,
    setExcluirVideoaulaSalva,
    getVideoSalvoByIdAluno
}