/************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, consistência de dados das  requisicões da API de usuários
 * Data: 03/09/2024
 * Autor: Julia Mendes 
 * Versão: 1.0
 * 
************************************************************************************************************/

const message = require('../modulo/config.js')
const professorDAO = require('../model/DAO/professor.js');
const data = require('./validacoes.js')
const preCadastroProfDAO = require('../model/DAO/preCadastroProfessor.js')






const getValidarProf = async(email, senha, contentType) => {
    
    try {

        if(String(contentType).toLowerCase() == 'application/json'){
    
            let emailProf = email
            let senhaProf = senha
            let profJSON = {}

            if(emailProf == '' || emailProf == undefined || senhaProf == '' || senhaProf == undefined){
            
                return message.ERROR_REQUIRED_FIELDS // 400
               

            } else {

                let dadosProfessor = await professorDAO.selectValidarProf(emailProf, senhaProf)
               
              

                if(dadosProfessor){

                    if(dadosProfessor.length > 0){         

                     
                        profJSON.status = message.SUCESS_VALIDATED_ITEM.status       
                        profJSON.status_code = message.SUCESS_VALIDATED_ITEM.status_code       
                        profJSON.message = message.SUCESS_VALIDATED_ITEM.message       
                        profJSON.professor = dadosProfessor[0]
                
                        return profJSON
                    } else {
                   
                        return message.ERROR_NOT_FOUND // 404
                    }

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
            
        }else{
          
            return message.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        
        message.ERROR_INTERNAL_SERVER // 500
    }

}


const getListarProfessores = async function () {

    // Cri o objeto JSON
    let professoresJSON = {};

    //Chama a funcão do DAO para retornar os dados da tabela de filmes
    let dadosProfessor = await professorDAO.selectAllProfessores()

    // Validação para verificar s existem dados 
    if (dadosProfessor) {

        if (dadosProfessor.length > 0) {
             // Cria o JSON para devolver para o APP
            professoresJSON.professores = dadosProfessor;
            professoresJSON.quantidade = dadosProfessor.length;
            professoresJSON.status_code = 200;
            return professoresJSON;
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB;
    }

}

const getBuscarProfessorById = async function (id){
    let idProfessor = id 

    let professorJSON = {}

    if (idProfessor == '' || idProfessor == undefined || isNaN(idProfessor)) {
        return message.ERROR_INVALID_ID; //400
    } else {

       
        let dadosProfessor= await professorDAO.selectByIdProfessor(idProfessor)

       
        if (dadosProfessor) {

        
            if (dadosProfessor.length > 0) {
                professorJSON.professor = dadosProfessor[0];
                professorJSON.status_code = 200;

                return professorJSON

            } else {
                return message.ERROR_NOT_FOUND; //404
            }

        } else {
            return message.ERROR_INTERNAL_SERVER_DB; //500
        }
    }

}

const getBuscarProfessorNome = async (nome) => {
    // Cria o objeto JSON
     
    let nomeProfessor = nome
    let professorJSON = {};

    if (nomeProfessor == '' || nomeProfessor == undefined) {
        return message.ERROR_INVALID_ID
    } else {
    
        let dadosProfessor = await professorDAO.selectProfessorByNome(nome)

        if (dadosProfessor) {
            if (dadosProfessor.length > 0) {
                
                professorJSON.professor = dadosProfessor;
                professorJSON.status_code = 200;

                return professorJSON;
            } else {
                return message.ERROR_NOT_FOUND;
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }

    }
}

const getBuscarProfessorEmail = async (email) => {
    // Cria o objeto JSON

    let emailProfessor = email
    let professorJSON = {};

    if (emailProfessor == '' || emailProfessor == undefined) {
        return message.ERROR_INVALID_ID
    } else {
    
        let dadosProfessor = await professorDAO.selectProfessorByEmail(email)

        if (dadosProfessor) {
            if (dadosProfessor.length > 0) {
                
                professorJSON.professor = dadosProfessor;
                professorJSON.status_code = 200;

                return professorJSON;
            } else {
                return message.ERROR_NOT_FOUND;
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }


    }
}


const setInserirNovoProfessor = async function (dadosProfessor, contentType) {
    
    try{
      
        if (String(contentType).toLowerCase() == 'application/json'){
          
            let novoProfessorJSON = {}

            if(
               dadosProfessor.nome == '' || dadosProfessor.nome == undefined || dadosProfessor.nome == null || dadosProfessor.nome.length > 255||
               dadosProfessor.email == "" || dadosProfessor.email == undefined || dadosProfessor.email == null|| dadosProfessor.email.length > 255||
               dadosProfessor.senha == "" || dadosProfessor.senha == undefined || dadosProfessor.senha == null||  dadosProfessor.senha.length > 8 || dadosProfessor.senha.length < 8 ||
               dadosProfessor.foto_perfil.length > 255
            ){
                return message.ERROR_REQUIRED_FIELDS
            }

            if (!dadosProfessor.data_nascimento || !data.validarData(dadosProfessor.data_nascimento)) {
                return message.ERROR_INVALID_DATA 
            }


            let verificarEmail = await professorDAO.selectVerificarEmail(dadosProfessor.email)

            if(verificarEmail ==''){
               
                let novoProfessor = await professorDAO.insertProfessor(dadosProfessor)
               
                if (novoProfessor){
                
                    let ultimoID = await professorDAO.selectUltimoIdProfessor()
                   
                    dadosProfessor.id_professor = Number(ultimoID[0].id_professor)
                    
                }
                
                if (novoProfessor){
                    novoProfessorJSON.professor = dadosProfessor
                    novoProfessorJSON.status = message.SUCESS_CREATED_ITEM.status
                    novoProfessorJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novoProfessorJSON.message = message.SUCESS_CREATED_ITEM.message
                    
                    return novoProfessorJSON //201
                }else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500 
                
            
            }

        }else{
            return message.ERROR_CONFLIT_EMAIL
        } 
        
        }else{
            return message.ERROR_CONTENT_TYPE//415
        }
        
    }catch(error){
        
        return message.ERROR_INTERNAL_SERVER //500 erro na controller
    }
}




const setAtualizarProfessor = async function (id, dadosProfessor, contentType){

   
    let idUsuario = id

  

    if (idUsuario== '' || idUsuario == undefined || isNaN(idUsuario)) {
        return message.ERROR_INVALID_ID; 
        }else {
          
            let result = await professorDAO.selectByIdProfessor(idUsuario)
            let verificarId = result.length
            if (verificarId > 0) {
                
                try{

                    if (String(contentType).toLowerCase() == 'application/json'){

                        let updateUsuarioJSON = {}

                        if(
                            dadosProfessor.nome == "" || dadosProfessor.nome == undefined || dadosProfessor.nome == null || dadosProfessor.nome.length > 255||
                            dadosProfessor.email == "" || dadosProfessor.email == undefined || dadosProfessor.email == null|| dadosProfessor.email.length > 255||
                            dadosProfessor.foto_perfil.length > 255
                         ){
                            return message.ERROR_REQUIRED_FIELDS
                         }

                         if (!dadosProfessor.data_nascimento || !data.validarData(dadosProfessor.data_nascimento)) {
                            return message.ERROR_INVALID_DATA 
                        }

                       

                            let usuarioAtualizado = await professorDAO.updateProfessor(id, dadosProfessor)
            
                            if (usuarioAtualizado){
                            
                               updateUsuarioJSON.professor = dadosProfessor
                               updateUsuarioJSON.status = message.SUCESS_UPDATED_ITEM.status
                               updateUsuarioJSON.status_code = message.SUCESS_UPDATED_ITEM.status_code
                               updateUsuarioJSON.message = message.SUCESS_UPDATED_ITEM.message
                                
                                return updateUsuarioJSON //201
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

   
    const setExcluirProfessor = async function (id){
        try{
            let idProfessor = id 
    
            if (idProfessor == '' || idProfessor == undefined || isNaN(idProfessor)) {
                return message.ERROR_INVALID_ID; //400
            } else {
                let dadosProfessor = await professorDAO.selectByIdProfessor(idProfessor);
                let verificarId = dadosProfessor.length
                if (verificarId > 0) {
    
                    dadosProfessor = await professorDAO.deleteProfessor(idProfessor)
                    
                    return message.SUCESS_DELETED_ITEM
                } else {
                    return message.ERROR_NOT_FOUND_ID
                }
            }
        } catch {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    
           
        
    }
    


    /*********************************** Pré cadastro prof ****************************************/

    const setInserirUsuarioQuiz = async function (dadosUser, contentType) {
    
        try{
          
            if (String(contentType).toLowerCase() == 'application/json'){
              
                let usuarioJson = {}
    
                if(
                   dadosUser.email == "" || dadosUser.email == undefined || dadosUser.email == null|| dadosUser.email.length > 255
                ){
                    return message.ERROR_REQUIRED_FIELDS
                }



                    let validarEmail = await  preCadastroProfDAO.selectVerificarEmail(dadosUser.email)

                    if (validarEmail == ""){
                    let user = await preCadastroProfDAO.insertUsuarioQuiz(dadosUser)
                    
                   
                    if (user){
                    
                        let ultimoID = await preCadastroProfDAO.selectUltimoIdUserQuiz()
                       
                        dadosUser.id_usuario_teste = Number(ultimoID[0].id_usuario_teste)
                        
                    }
                    
                    if (user){
                        usuarioJson.usuario = dadosUser
                        usuarioJson.status = message.SUCESS_CREATED_ITEM.status
                        usuarioJson.status_code = message.SUCESS_CREATED_ITEM.status_code
                        usuarioJson.message = message.SUCESS_CREATED_ITEM.message
                        
                        return usuarioJson //201
                    }else {
                        return message.ERROR_INTERNAL_SERVER_DB // 500                 
                }

            }else{
                return message.ERROR_CONFLIT_EMAIL
            }
            
            }else{
                return message.ERROR_CONTENT_TYPE//415
            }
            
        }catch(error){
            
            return message.ERROR_INTERNAL_SERVER //500 erro na controller
        }
    }




    const setInserirRespostaQuiz = async function (dadosUser, contentType) {
        try {
            if (String(contentType).toLowerCase() === 'application/json') {
                let usuarioJson = {};
    
              
                if (
                    !Array.isArray(dadosUser) || 
                    dadosUser.some(usuario => 
                        !usuario.id_alternativa || 
                        isNaN(usuario.id_alternativa) || 
                        !usuario.id_usuario_teste || 
                        isNaN(usuario.id_usuario_teste)
                    )
                ) {
                    return message.ERROR_REQUIRED_FIELDS;
                }
    
              
                let user = await preCadastroProfDAO.insertRespostaUsuario(dadosUser);
              //esta dando errado a pontuação pois o id do usuário teste está voltando como undefined 
                if (user) {
                    let ultimoID = await preCadastroProfDAO.selectUltimoIdRespostaQuiz()
                       
                    dadosUser.id = Number(ultimoID[0].id)

         
                    let resultadoQuiz = await preCadastroProfDAO.insertResultadoUsuario(dadosUser.id_usuario_teste)
           
    
                    if(resultadoQuiz){

                    let resultado = await preCadastroProfDAO.selectPontuacao(dadosUser.id_usuario_teste)
            

                        usuarioJson.usuario = dadosUser;
                        usuarioJson.pontuacao = resultado;
                        usuarioJson.status = message.SUCESS_CREATED_ITEM.status;
                        usuarioJson.status_code = message.SUCESS_CREATED_ITEM.status_code;
                        usuarioJson.message = message.SUCESS_CREATED_ITEM.message;
        
                        return usuarioJson// 201
                    
                    }else{
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
                 
                   
                    
                } else {
                  
                    return message.ERROR_INTERNAL_SERVER_DB; // 500
                  
                }
            } else {
                return message.ERROR_CONTENT_TYPE; // 415
            }
        } catch (error) {
      
            return message.ERROR_INTERNAL_SERVER; // 500 erro na controller
        }
    };
    

    

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
    
                                let fotoAtualizadaProf = await professorDAO.updateProfessorFotoPerfil(id, dadosProfessor)
                
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
        
                                    let senhaAtualizada = await professorDAO.updateSenhaProfessor(id, dadosProfessor)
                    
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
        




module.exports = {
    getListarProfessores,
    getBuscarProfessorById,
    getBuscarProfessorNome,
    getBuscarProfessorEmail,
    setInserirNovoProfessor,
    setAtualizarProfessor,
    setExcluirProfessor,
    setAtualizarFotoPerfilProfessor,
    setAtualizarSenhaProf,
    getValidarProf,
    setInserirUsuarioQuiz,
    setInserirRespostaQuiz
}
