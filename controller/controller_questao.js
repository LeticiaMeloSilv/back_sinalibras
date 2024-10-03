/************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, consistência de dados das  requisicões da API de questões
 * Data: 17/09/2024
 * Autor: Julia Mendes 
 * Versão: 1.0
 * 
************************************************************************************************************/

const message = require('../modulo/config.js')
const questaoDAO = require('../model/DAO/questoes.js');
const { getListarAlunos } = require('./controller_aluno.js');



const setInserirNovaQuestao = async function (dadosQuestao, contentType) {
    
    try{
      
        if (String(contentType).toLowerCase() == 'application/json'){
          
            let novaQuestaoJSON = {}
            if(
              dadosQuestao.p_pergunta == '' ||dadosQuestao.p_pergunta == undefined ||dadosQuestao.p_pergunta == null ||dadosQuestao.p_pergunta.length > 25||
              dadosQuestao.p_video == "" ||dadosQuestao.p_video == undefined ||dadosQuestao.p_video == null||dadosQuestao.p_video.length > 250||
              dadosQuestao.p_alternativas == undefined ||dadosQuestao.p_alternativas == "" ||dadosQuestao.p_alternativas.length > 100
            ){
                return message.ERROR_REQUIRED_FIELDS
            }
               
                let novaQuestao = await questaoDAO.insertQuestaoAlternativa(dadosQuestao)
               
                if (novaQuestao){
                
                    let ultimoID = await questaoDAO.selectUltimoIdQuestao()
                   
                   dadosQuestao.id = Number(ultimoID[0].id)
                    
                }
                
                if (novaQuestao){
                    novaQuestaoJSON.questao = dadosQuestao
                    novaQuestaoJSON.status = message.SUCESS_CREATED_ITEM.status
                    novaQuestaoJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novaQuestaoJSON.message = message.SUCESS_CREATED_ITEM.message
                    
                    return novaQuestaoJSON //201
                }else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500 
                
            
            }
        
        }else{
            return message.ERROR_CONTENT_TYPE//415
        }
        
    }catch(error){
        
        return message.ERROR_INTERNAL_SERVER //500 erro na controller
    }
}

const getBuscarQuestaoid = async function (id){
    let idquestao = id 

   

    if (idquestao == '' || idquestao == undefined || isNaN(idquestao)) {
        return message.ERROR_INVALID_ID; //400
    } else {
        
       
        let dadosQuestao = await questaoDAO.selectQuestoesAternativas(idquestao)
        
            if(dadosQuestao){
            let jsonQuestao = {}
         
            
            let alternativas = []
      

            dadosQuestao.forEach(questao => {
                const alternativa = {}
                jsonQuestao.id_pergunta = questao.id_pergunta;
                jsonQuestao.pergunta = questao.pergunta;
                jsonQuestao.video = questao.video; 
                jsonQuestao.alternativas = alternativas
                  
                  alternativa.id_alternativa =  questao.id_alternativa,
                  alternativa.alternativa = questao.alternativa,
                  alternativa.status = questao.status

                
                  alternativas.push(alternativa)

            });

            
            let questaoJSON = {}
            if (dadosQuestao.length > 0) {
                questaoJSON.questao = jsonQuestao;
                questaoJSON.status_code = 200;
                return questaoJSON
                
            } else {
                return message.ERROR_NOT_FOUND; //404
            }

        } else {
            return message.ERROR_INTERNAL_SERVER_DB; //500
        }
    }

}


const getAllQuestoes = async function () {
    let dadosQuestao = await questaoDAO.selectAllQuestoes();
    
    if (dadosQuestao) {
        const listaQuestoes = {};
        
        dadosQuestao.forEach(questao => {
            const { id_pergunta, pergunta, video, id_alternativa, alternativa, status } = questao;
            console.log(questao);
            if (!listaQuestoes[id_pergunta]) {
                listaQuestoes[id_pergunta] = {
                    id_pergunta,
                    pergunta,
                    video,
                    alternativas: []
                };
            }

            listaQuestoes[id_pergunta].alternativas.push({
                id_alternativa,
                alternativa: alternativa || "Alternativa não fornecida",
                status
            });
        });

        
        const responseJSON = {
            questoes: Object.values(listaQuestoes),
            status_code: 200
        };

        return responseJSON;
    } else {
        return message.ERROR_INTERNAL_SERVER_DB; // 500
    }
};






module.exports = {
    setInserirNovaQuestao,
    getBuscarQuestaoid,
    getAllQuestoes
}