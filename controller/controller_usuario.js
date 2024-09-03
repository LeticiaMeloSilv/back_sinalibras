/************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, consistência de dados das  requisicões da API de usuários
 * Data: 03/09/2024
 * Autor: Julia Mendes e Gabriel Barros 
 * Versão: 1.0
 * 
************************************************************************************************************/

const message = require('../modulo/config.js')
const usuarioDao = require('../model/DAO/usuario.js');
const { log } = require('console');

const getListarUsuarios = async function (){
    try {

        // Cri o objeto JSON
        let usuariosJSON = {};
        //Chama a funcão do DAO para retornar os dados da tabela de atores
        let dadosUsuarios = await usuarioDao.selectAllUsers();
            if (dadosUsuarios) {
                
                if(dadosUsuarios.length > 0){
                    usuariosJSON.usuario = dadosUsuarios
                    usuariosJSON.quantidade = dadosUsuarios.length
                    usuariosJSON.status_code = 200
                    return usuariosJSON

                } else 
                return message.ERROR_NOT_FOUND
            } else 
                return message.ERROR_INTERNAL_SERVER_DB
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER;
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




module.exports = {
    getListarUsuarios,
    setInserirNovoUsuario
}
