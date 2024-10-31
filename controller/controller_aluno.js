/************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, consistência de dados das  requisicões da API de usuários
 * Data: 03/09/2024
 * Autor: Julia Mendes 
 * Versão: 1.0
 * 
************************************************************************************************************/

const message = require('../modulo/config.js')
const alunoDao = require('../model/DAO/aluno.js');
const data = require('./validacoes.js')

const getValidarAluno = async(email, senha, contentType) => {


    try {

        if(String(contentType).toLowerCase() == 'application/json'){
    
            let emailAluno = email
            let senhaAluno = senha
           
            
            let alunoJSON = {}

            if(emailAluno == '' || emailAluno == undefined || senhaAluno == '' || senhaAluno == undefined){
            
                return message.ERROR_REQUIRED_FIELDS // 400
               

            } else {

                let dadosAluno = await alunoDao.selectValidarAluno(emailAluno, senhaAluno)
               
           
              

                if(dadosAluno){

                    if(dadosAluno.length > 0){         

                     
                        alunoJSON.status = message.SUCESS_VALIDATED_ITEM.status       
                        alunoJSON.status_code = message.SUCESS_VALIDATED_ITEM.status_code       
                        alunoJSON.message = message.SUCESS_VALIDATED_ITEM.message       
                        alunoJSON.aluno = dadosAluno[0]
                
                        return alunoJSON
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



const getListarAlunos = async function () {

    // Cri o objeto JSON
    let usuariosJSON = {};

    //Chama a funcão do DAO para retornar os dados da tabela de filmes
    let dadosAlunos = await alunoDao.selectAllAlunos();
   
       

    if(dadosAlunos.data_nascimento){
        dadosAlunos.data_nascimento = data.converterDataBR(dadosAlunos.data_nascimento)
    }

    // Validação para verificar s existem dados 
    if (dadosAlunos) {

        if (dadosAlunos.length > 0) {
             // Cria o JSON para devolver para o APP
            usuariosJSON.alunos = dadosAlunos;
            usuariosJSON.quantidade = dadosAlunos.length;
            usuariosJSON.status_code = 200;
          
            return usuariosJSON;
           
        } else {
            
            return message.ERROR_NOT_FOUND
        }
    } else {
    
        return message.ERROR_INTERNAL_SERVER_DB;
    }

}

const getBuscarAlunoById = async function (id){
    let idUsuario = id 

    let usuarioJSON = {}

    if (idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)) {
        return message.ERROR_INVALID_ID; //400
    } else {

       
        let dadosAluno= await alunoDao.selectByIdAluno(idUsuario);

       
        if (dadosAluno) {

        
            if (dadosAluno.length > 0) {
                usuarioJSON.aluno = dadosAluno[0];
                usuarioJSON.status_code = 200;
                
console.log(usuarioJSON);
console.log("-------------------------------------------------");
                return usuarioJSON

            } else {
                return message.ERROR_NOT_FOUND; //404
            }

        } else {
            return message.ERROR_INTERNAL_SERVER_DB; //500
        }
    }

}

const getBuscarAlunoNome = async (nome) => {
    // Cria o objeto JSON
     
    let nomeUsuario = nome
    let usuariosJSON = {};

  
    if (nomeUsuario == '' || nomeUsuario == undefined) {
        return message.ERROR_INVALID_ID
    } else {
    
        let dadosAlunos = await alunoDao.selectAlunoByNome(nomeUsuario)

        if (dadosAlunos) {
            if (dadosAlunos.length > 0) {
                
                usuariosJSON.alunos = dadosAlunos;
                usuariosJSON.status_code = 200;

                return usuariosJSON

            } else {
                return message.ERROR_NOT_FOUND;
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }

    }
}

const getBuscarAlunoEmail = async (email) => {
    // Cria o objeto JSON

    let emailAluno = email
    let usuariosJSON = {};

    if (emailAluno == '' || emailAluno == undefined) {
        return message.ERROR_INVALID_ID
    } else {
    
        let dadosAlunos = await alunoDao.selectAlunoByEmail(email)


        if (dadosAlunos) {
            if (dadosAlunos.length > 0) {

                usuariosJSON.alunos = dadosAlunos;
                usuariosJSON.status_code = 200;
                return usuariosJSON;
            } else {
                return message.ERROR_NOT_FOUND;
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }

    }
}

       


const setInserirNovoAluno = async function (dadosAluno, contentType) {
    
    try{
      
        if (String(contentType).toLowerCase() == 'application/json'){
          
            let novoAlunoJSON = {}

            if(
               dadosAluno.nome == '' || dadosAluno.nome == undefined || dadosAluno.nome == null || dadosAluno.nome.length > 255||
               dadosAluno.email == "" || dadosAluno.email == undefined || dadosAluno.email == null|| dadosAluno.email.length > 255||
               dadosAluno.senha == "" || dadosAluno.senha == undefined || dadosAluno.senha == null||  dadosAluno.senha.length > 8 || 
                dadosAluno.foto_perfil.length > 255 
            ){
                return message.ERROR_REQUIRED_FIELDS
            }

            if (!dadosAluno.data_nascimento ||!data.validarData(dadosAluno.data_nascimento)) {
                return message.ERROR_INVALID_DATA 
            }

            if(dadosAluno.data_nascimento){
                dadosAluno.data_nascimento = dadosAluno.data_nascimento.replaceAll("/","-")
            }
               
           
            let validacaoEmail = await alunoDao.selectVerificarEmail(dadosAluno.email)
         
            


            if(validacaoEmail == ''){
                let novoAluno= await alunoDao.insertAluno(dadosAluno)
                
                
               
                if (novoAluno){
                
                    let ultimoID = await alunoDao.selectUltimoIdAluno()
                  
                    
                    dadosAluno.id_aluno = Number(ultimoID[0].id_aluno)
                    
                    
                }
                
                if (novoAluno){
                    novoAlunoJSON.aluno = dadosAluno
                    novoAlunoJSON.status = message.SUCESS_CREATED_ITEM.status
                    novoAlunoJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novoAlunoJSON.message = message.SUCESS_CREATED_ITEM.message
                    
                    return novoAlunoJSON //201
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
        
        console.log(error);
        
        return message.ERROR_INTERNAL_SERVER //500 erro na controller

    }
}


const setAtualizarAluno = async function (id, dadosAluno, contentType){

   
    let idUsuario = id

  

    if (idUsuario== '' || idUsuario == undefined || isNaN(idUsuario)) {
        return message.ERROR_INVALID_ID; 
        }else {
          
            let result = await alunoDao.selectByIdAluno(idUsuario)
            let verificarId = result.length
            if (verificarId > 0) {
                
                try{

                    if (String(contentType).toLowerCase() == 'application/json'){

                        let updateAlunoJSON= {}

                        if(
                            dadosAluno.nome == '' || dadosAluno.nome == undefined || dadosAluno.nome == null || dadosAluno.nome.length > 255||
                            dadosAluno.email == "" || dadosAluno.email == undefined || dadosAluno.email == null|| dadosAluno.email.length > 255||
                          dadosAluno.foto_perfil.length > 255
                         ){
                            return message.ERROR_REQUIRED_FIELDS
                         }

                         if (!dadosAluno.data_nascimento || !data.validarData(dadosAluno.data_nascimento)) {
                            return message.ERROR_INVALID_DATA 
                        }

                            let alunoAtualizado = await alunoDao.updateAluno(id, dadosAluno)
                           
            
                            if (alunoAtualizado){
                            
                               updateAlunoJSON.aluno = dadosAluno
                               updateAlunoJSON.status = message.SUCESS_UPDATED_ITEM.status
                               updateAlunoJSON.status_code = message.SUCESS_UPDATED_ITEM.status_code
                               updateAlunoJSON.message = message.SUCESS_UPDATED_ITEM.message
                                
                                return updateAlunoJSON//201
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
   
    const setExcluirAluno = async function (id){
        let idUsuario = id 
        try{
       
    
            if (idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)) {
                return message.ERROR_INVALID_ID; //400
              
            } else {
                let dadosAluno = await alunoDao.selectByIdAluno(idUsuario);
                
                let verificarId = dadosAluno.length
                if (verificarId > 0) {
                    
                    dadosAluno = await alunoDao.deleteAluno(idUsuario)
                   
                    return message.SUCESS_DELETED_ITEM
                } else {
                    return message.ERROR_NOT_FOUND_ID
                }
            }
        } catch {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    
           
        
    }

    

    /*********************************** Aluno Perfil ************************************** */

    const setAtualizarFotoPerfilAluno = async function (id, dadosAluno, contentType){

   
        let idUsuario = id
    
      
    
        if (idUsuario== '' || idUsuario == undefined || isNaN(idUsuario)) {
            return message.ERROR_INVALID_ID; 
            }else {
              
                let result = await alunoDao.selectByIdAluno(idUsuario)
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
    
                                let fotoAtualizada = await alunoDao.updateAlunoFotoPerfil(id, dadosAluno)
                
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
                  
                    let result = await alunoDao.selectByIdAluno(idUsuario)
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
        
                                    let senhaAtualizada = await alunoDao.updateSenhaAluno(id, dadosAluno)
                    
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


           





module.exports = {
    getListarAlunos,
    getBuscarAlunoById,
    getBuscarAlunoNome,
    getBuscarAlunoEmail,
    setInserirNovoAluno,
    setAtualizarAluno,
    setExcluirAluno,
    setAtualizarFotoPerfilAluno,
    setAtualizarSenhaAluno,
    getValidarAluno
}
