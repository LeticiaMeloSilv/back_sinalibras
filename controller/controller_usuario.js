/************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, consistência de dados das  requisicões da API de usuários
 * Data: 03/09/2024
 * Autor: Julia Mendes e Gabriel Barros 
 * Versão: 1.0
 * 
************************************************************************************************************/

const message = require('../modulo/config.js')
const usuarioDao = require('../model/DAO/usuario.js');


const getListarUsuarios = async function () {

    // Cri o objeto JSON
    let usuariosJSON = {};

    //Chama a funcão do DAO para retornar os dados da tabela de filmes
    let dadosUsuarios = await usuarioDao.selectAllUsers();

    // Validação para verificar s existem dados 
    if (dadosUsuarios) {

        if (dadosUsuarios.length > 0) {
             // Cria o JSON para devolver para o APP
            usuariosJSON.usuarios = dadosUsuarios;
            usuariosJSON.quantidade = dadosUsuarios.length;
            usuariosJSON.status_code = 200;
            return usuariosJSON;
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB;
    }

}

const getBuscarUsuarioById = async function (id){
    let idUsuario = id 

    let usuarioJSON = {}

    if (idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)) {
        return message.ERROR_INVALID_ID; //400
    } else {

       
        let dadosUsuario= await usuarioDao.selectByIdUsuario(idUsuario);

       
        if (dadosUsuario) {

        
            if (dadosUsuario.length > 0) {
                usuarioJSON.usuario = dadosUsuario;
                usuarioJSON.status_code = 200;

                return usuarioJSON

            } else {
                return message.ERROR_NOT_FOUND; //404
            }

        } else {
            return message.ERROR_INTERNAL_SERVER_DB; //500
        }
    }

}

const getBuscarUsuarioNome = async (nome) => {
    // Cria o objeto JSON
     
    let nomeUsuario = nome
    let usuariosJSON = {};

    if (nomeUsuario == '' || nomeUsuario == undefined) {
        return message.ERROR_INVALID_ID
    } else {
    
        let dadosUsuarios = await usuarioDao.selectUsuarioByNome(nome)

        if (dadosUsuarios) {
            if (dadosUsuarios.length > 0) {
                
                usuariosJSON.usuarios = dadosUsuarios;
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

const getBuscarUsuarioEmail = async (email) => {
    // Cria o objeto JSON

    let emailUsuario = email
    let usuariosJSON = {};

    if (emailUsuario == '' || emailUsuario == undefined) {
        return message.ERROR_INVALID_ID
    } else {
    
        let dadosUsuarios = await usuarioDao.selectUsuarioByEmail(email)


        if (dadosUsuarios) {
            if (dadosUsuarios.length > 0) {
                usuariosJSON.usuarios = dadosUsuarios;
                usuariosJSON.status_code = 200;

                // console.log(usuariosJSON)

                return usuariosJSON;
            } else {
                return message.ERROR_NOT_FOUND;
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }

    }
}

       


const setInserirNovoUsuario = async function (dadosUsuario, contentType) {
    
    try{
      
        if (String(contentType).toLowerCase() == 'application/json'){
          
            let novoUsuarioJSON = {}

            if(
               dadosUsuario.nome == '' || dadosUsuario.nome == undefined || dadosUsuario.nome == null || 
               dadosUsuario.email == "" || dadosUsuario.email == undefined || dadosUsuario.email == null||
               dadosUsuario.senha == "" || dadosUsuario.senha == undefined || dadosUsuario.senha == null||
               dadosUsuario.senha.length > 8 
            ){
                return message.ERROR_REQUIRED_FIELDS
            } else {
               
                let novousuario = await usuarioDao.insertUsuario(dadosUsuario)
               
                if (novousuario){
                
                    let ultimoID = await usuarioDao.selectUltimoIdUsuario()
                   
                    dadosUsuario.id = Number(ultimoID[0].id)
                    
                }
                
                if (novousuario){
                    novoUsuarioJSON.usuario = dadosUsuario
                    novoUsuarioJSON.status = message.SUCESS_CREATED_ITEM.status
                    novoUsuarioJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novoUsuarioJSON.message = message.SUCESS_CREATED_ITEM.message
                    
                    return novoUsuarioJSON //201
                }else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500 
                }
            }
            
        
        }else{
            return message.ERROR_CONTENT_TYPE//415
        }
        
    }catch(error){
        return message.ERROR_INTERNAL_SERVER //500 erro na controller
    }
}

const setAtualizarUsuario = async function (id, dadosUsuario, contentType){

   
    let idUsuario = id



    if (idUsuario== '' || idUsuario == undefined || isNaN(idUsuario)) {
        return message.ERROR_INVALID_ID; 
        }else {
          
            let result = await usuarioDao.selectByIdUsuario(idUsuario)
            let verificarId = result.length
            if (verificarId > 0) {
                
                try{

                    if (String(contentType).toLowerCase() == 'application/json'){

                        let updateUsuarioJSON = {}

                        if(
                            dadosUsuario.nome == '' || dadosUsuario.nome == undefined || dadosUsuario.nome == null || 
                            dadosUsuario.email == "" || dadosUsuario.email == undefined || dadosUsuario.email == null||
                            dadosUsuario.senha == "" || dadosUsuario.senha == undefined || dadosUsuario.senha == null||
                            dadosUsuario.status_usuario == "" || dadosUsuario.status_usuario == undefined || dadosUsuario.status_usuario == null||
                            dadosUsuario.senha.length > 8 
                         ){
                            return message.ERROR_REQUIRED_FIELDS
                        } else {

                            let usuarioAtualizado = await usuarioDao.updateUsuario(id, dadosUsuario)
            
                            
                            if (usuarioAtualizado){
                               updateUsuarioJSON.usuario = dadosUsuario
                               updateUsuarioJSON.status = message.SUCESS_UPDATED_ITEM.status
                               updateUsuarioJSON.status_code = message.SUCESS_UPDATED_ITEM.status_code
                               updateUsuarioJSON.message = message.SUCESS_UPDATED_ITEM.message
                                
                                return updateUsuarioJSON //201
                            }else {
                                return message.ERROR_INTERNAL_SERVER_DB // 500 
                            }


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

   
    const setExcluirUsuario = async function (id){
        try{
            let idUsuario = id 
    
            if (idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)) {
                return message.ERROR_INVALID_ID; //400
            } else {
                let dadosUsuario = await usuarioDao.selectByIdUsuario(idUsuario);
                let verificarId = dadosUsuario.length
                if (verificarId > 0) {
    
                    dadosUsuario = await usuarioDao.deleteUsuario(idUsuario)
                    
                    return message.SUCESS_DELETED_ITEM
                } else {
                    return message.ERROR_NOT_FOUND_ID
                }
            }
        } catch {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    
           
        
    }
    





module.exports = {
    getListarUsuarios,
    getBuscarUsuarioById,
    getBuscarUsuarioNome,
    getBuscarUsuarioEmail,
    setInserirNovoUsuario,
    setAtualizarUsuario,
    setExcluirUsuario
}
