/************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, consistência de dados das  requisicões da API de usuários
 * Data: 14/11/2024
 * Autor: Julia Mendes 
 * Versão: 1.0
 * 
************************************************************************************************************/


const message = require('../modulo/config.js')
const alunoDAO = require('../model/DAO/aluno.js');
const perfilAlunoDAO = require('../model/DAO/pefilAluno.js')
const videoaulaSalva = require('../model/DAO/videoSalvo.js')



/*********************************** Aluno Perfil ************************************** */

const setAtualizarFotoPerfilAluno = async function (id, dadosAluno, contentType){

   
    let idUsuario = id

  

    if (idUsuario== '' || idUsuario == undefined || isNaN(idUsuario)) {
        return message.ERROR_INVALID_ID; 
        }else {
          
            let result = await alunoDAO.selectByIdAluno(idUsuario)
            let verificarId = result.length
            if (verificarId > 0) {
                
                try{

                    if (String(contentType).toLowerCase() == 'application/json'){

                        let updateFotoAlunoJSON= {}

                        if( 
                             dadosAluno.foto_perfil == undefined || dadosAluno.foto_perfil == "" || dadosAluno.foto_perfil.length > 255
                         ){
                            return message.ERROR_REQUIRED_FIELDS
                         }

                            let fotoAtualizada = await perfilAlunoDAO.updateAlunoFotoPerfil(id, dadosAluno)
            
                            if (fotoAtualizada){
                            
                               updateFotoAlunoJSON.Atualizacao = dadosAluno
                               updateFotoAlunoJSON.status = message.SUCESS_UPDATED_ITEM.status
                               updateFotoAlunoJSON.status_code = message.SUCESS_UPDATED_ITEM.status_code
                               updateFotoAlunoJSON.message = message.SUCESS_UPDATED_ITEM.message
                                
                                return updateFotoAlunoJSON//201
                            }else {
                          
                                return message.ERROR_INTERNAL_SERVER_DB // 500 
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



    const setAtualizarSenhaAluno = async function (id, dadosAluno, contentType){


        let idUsuario = id
    
      
    
        if (idUsuario== '' || idUsuario == undefined || isNaN(idUsuario)) {
            return message.ERROR_INVALID_ID; 
            }else {
              
                let result = await alunoDAO.selectByIdAluno(idUsuario)
                let verificarId = result.length
                if (verificarId > 0) {
                    
                    try{
    
                        if (String(contentType).toLowerCase() == 'application/json'){
    
                            let updateSenhaAlunoJSON= {}
    
                            if( 
                                 dadosAluno.senha == undefined || dadosAluno.senha == "" || dadosAluno.senha.length > 8 || dadosAluno.senha.length < 8 
                             ){
                                return message.ERROR_REQUIRED_FIELDS
                             }
    
                                let senhaAtualizada = await perfilAlunoDAO.updateSenhaAluno(id, dadosAluno)
                
                                if (senhaAtualizada){
                                
                                   //updateSenhaAlunoJSON.dadosAluno = dadosAluno
                                   updateSenhaAlunoJSON.status = message.SUCESS_UPDATED_ITEM.status
                                   updateSenhaAlunoJSON.status_code = message.SUCESS_UPDATED_ITEM.status_code
                                   updateSenhaAlunoJSON.message = message.SUCESS_UPDATED_ITEM.message
                                    
                                    return updateSenhaAlunoJSON//201
                                }else {
                              
                                    return message.ERROR_INTERNAL_SERVER_DB // 500 
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

            
    const getInfoPerfilAluno = async function (id) {
        let idAluno = id;
        let alunoJSON = {};
    
        if (idAluno == '' || idAluno == undefined || isNaN(idAluno)) {
            return message.ERROR_INVALID_ID; // 400
        } else {
    
            let dadoAluno = await perfilAlunoDAO.selectInfoPeril(idAluno);
    
            if (dadoAluno) {
    
                if (dadoAluno.length > 0) {
    
                   
                    let alunoComVideoaulasSalvas = await Promise.all(dadoAluno.map(async (alunos) => {
                        let videoAulas = await videoaulaSalva.selectByIdVideosSalvo(idAluno);
                        alunos.videoaulas_salvas = videoAulas;  
                        return alunos;
                    }));

                 
    
                    alunoJSON.alunoses = alunoComVideoaulasSalvas
                    alunoJSON.status_code = 200;
    
                    return alunoJSON;
    
                } else {
                    return message.ERROR_NOT_FOUND; // 404
                }
    
            } else {
                return message.ERROR_INTERNAL_SERVER_DB; // 500
            }
        }
    };
    


       
module.exports = {

    setAtualizarFotoPerfilAluno,
    setAtualizarSenhaAluno,
    getInfoPerfilAluno
}