/************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, consistência de dados das  requisicões da API de usuários
 * Data: 14/11/2024
 * Autor: Julia Mendes 
 * Versão: 1.0
 * 
************************************************************************************************************/
const message = require('../modulo/config.js')
const perfilProfDAO = require('../model/DAO/perfilProf.js')
const videoaulaDAO = require('../model/DAO/videoaula.js')
const postagemDAO = require('../model/DAO/postagem.js')
const professorDAO = require('../model/DAO/professor.js');




/*********************************** Professor Perfil ************************************** */

const setAtualizarFotoPerfilProfessor = async function (id, dadosProfessor, contentType){

   
    let idUsuario = id

  

    if (idUsuario== '' || idUsuario == undefined || isNaN(idUsuario)) {
        return message.ERROR_INVALID_ID; 
        }else {
          
            let result = await professorDAO.selectByIdProfessor(idUsuario)
            let verificarId = result.length
            if (verificarId > 0) {
                
                try{

                    if (String(contentType).toLowerCase() == 'application/json'){

                        let updateProfessorJSON= {}

                        if( 
                             dadosProfessor.foto_perfil == undefined || dadosProfessor.foto_perfil == "" || dadosProfessor.foto_perfil.length > 255
                         ){
                            return message.ERROR_REQUIRED_FIELDS
                         }

                            let fotoAtualizadaProf = await perfilProfDAO.updateProfessorFotoPerfil(id, dadosProfessor)
            
                            if (fotoAtualizadaProf){
                            
                               updateProfessorJSON.Atualizacao = dadosProfessor
                               updateProfessorJSON.status = message.SUCESS_UPDATED_ITEM.status
                               updateProfessorJSON.status_code = message.SUCESS_UPDATED_ITEM.status_code
                               updateProfessorJSON.message = message.SUCESS_UPDATED_ITEM.message
                                
                                return updateProfessorJSON//201
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



    const setAtualizarSenhaProf= async function (id, dadosProfessor, contentType){


        let idUsuario = id
    
      
    
        if (idUsuario== '' || idUsuario == undefined || isNaN(idUsuario)) {
            return message.ERROR_INVALID_ID; 
            }else {
              
                let result = await professorDAO.selectByIdProfessor(idUsuario)
                let verificarId = result.length
                if (verificarId > 0) {
                    
                    try{
    
                        if (String(contentType).toLowerCase() == 'application/json'){
    
                            let updateProfessorJSON= {}
    
                            if( 
                                 dadosProfessor.senha == undefined || dadosProfessor.senha == "" || dadosProfessor.senha.length > 8 || dadosProfessor.senha.length < 8 
                             ){
                                return message.ERROR_REQUIRED_FIELDS
                             }
    
                                let senhaAtualizada = await perfilProfDAO.updateSenhaProfessor(id, dadosProfessor)
                
                                if (senhaAtualizada){
                                
                                   //updateProfessorJSON.DadosUsuario = dadosProfessor
                                   updateProfessorJSON.status = message.SUCESS_UPDATED_ITEM.status
                                   updateProfessorJSON.status_code = message.SUCESS_UPDATED_ITEM.status_code
                                   updateProfessorJSON.message = message.SUCESS_UPDATED_ITEM.message
                                    
                                    return updateProfessorJSON//201
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


    
    const getInfoPerfilProfessor = async function (id) {
        let idProfessor = id;
        let professorJSON = {};
    
        if (idProfessor == '' || idProfessor == undefined || isNaN(idProfessor)) {
            return message.ERROR_INVALID_ID; // 400
        } else {
    
            let dadosProfessor = await perfilProfDAO.selectInfoPeril(idProfessor);
    
            if (dadosProfessor) {
    
                if (dadosProfessor.length > 0) {
    
                   
                    let professoresComVideoaulas = await Promise.all(dadosProfessor.map(async (professor) => {
                        let videoAulas = await videoaulaDAO.selectVideosByIdProfessor(idProfessor);
                        professor.videoaulas = videoAulas;  
                        let postagem = await postagemDAO.selectPostagemByIdProfessor(idProfessor)
                        professor.postagens = postagem
                        return professor;
                    }));

                 
    
                    professorJSON.professores = professoresComVideoaulas;
                    professorJSON.status_code = 200;
    
                    return professorJSON;
    
                } else {
                    return message.ERROR_NOT_FOUND; // 404
                }
    
            } else {
                return message.ERROR_INTERNAL_SERVER_DB; // 500
            }
        }
    };
    

    module.exports = {
        setAtualizarFotoPerfilProfessor,
        setAtualizarSenhaProf, 
        getInfoPerfilProfessor  
    }