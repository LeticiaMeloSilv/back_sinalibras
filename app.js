/*********************************************************
 * Objetivo: Arquivo para realizar as requisições do aplicativo 
 * data: 03/09/2024
 * Autor: Julia Mendes e Gabriel Barros
 * Versão: 1.0
 ***********************************************************/

const express = require('express')
const cors = require ('cors')
const bodyParser = require('body-parser')

const app = express()

app.use((request, response, next) => {
    
    response.header('Access-Control-Allow-Origin', "*") 
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,OPTIONS')

    app.use(cors())
    next()
})


const controllerUsuario = require('./controller/controller_usuario')

const bodyParserJson = bodyParser.json()

app.get('/v1/sinalibras/usuarios', cors(), async function(request, response){

    //Chama a função da controller para retorNAR FILMES
    let dadosUsuarios = await controllerUsuario.getListarUsuarios();

    //Validação para retornar o JSON dos filmes ou retornar o 404
    if(dadosUsuarios){
        response.json(dadosUsuarios);
        response.status(200);
    }else{
        response.json({message: 'Nnehum registro foi encontrado'})
        response.status(404);
    }

})

app.post('/v1/sinalibras/usuario', cors(), bodyParserJson, async function (request, response){
    let contentType = request.headers['content-type']

    let dadosBody = request.body
    let resultadoNovoUsuario = await controllerUsuario.setInserirNovoUsuario(dadosBody,contentType)

    response.status(resultadoNovoUsuario.status_code)
    response.json(resultadoNovoUsuario)
})


app.listen('8080', function(){
    console.log("API funcionando e aguardando requisições");
})