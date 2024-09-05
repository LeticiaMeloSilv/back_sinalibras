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

const bodyParserJson = bodyParser.json()


/************************************ Controller  ******************************/
const controllerUsuario = require('./controller/controller_usuario')


/************************************ Usuario ******************************/

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

app.get('/v1/sinalibras/usuarios/:id', cors(), async function(request,response,next){

    let idUsuario = request.params.id;

    //Encaminh o ID para o controller buscar o filme
    let dadosUsuarios = await controllerUsuario.getBuscarUsuarioById(idUsuario)

    response.status(dadosUsuarios.status_code);
    response.json(dadosUsuarios);

});

app.get('/v1/sinalibras/usuariosNome/:nome', cors(), async function(request,response,next){

        let nomeUsuario = request.query.nome
        let usuariosNome = await controllerUsuario.getBuscarUsuarioNome(nomeUsuario)
    
            response.json(usuariosNome);
             response.status(usuariosNome.status_code)
     })


app.get('/v1/sinalibras/usuarios/:email', cors(), async function(request,response,next){

        let emailUsuario = request.query.email
        let usuarios = await controllerUsuario.getBuscarUsuarioEmail(emailUsuario)
    
            response.json(usuarios);
             response.status(usuarios.status_code)
     })

app.post('/v1/sinalibras/usuario', cors(), bodyParserJson, async function (request, response){
    let contentType = request.headers['content-type']

    let dadosBody = request.body
    let resultadoNovoUsuario = await controllerUsuario.setInserirNovoUsuario(dadosBody,contentType)

    response.status(resultadoNovoUsuario.status_code)
    response.json(resultadoNovoUsuario)
})


app.put('/v1/sinalibras/usuario/:id', cors(), bodyParserJson, async function(request,response){
    let contentType = request.headers['content-type']
    let idUsuario = request.params.id

    let dadosBody = request.body
    let resultadoNovoUsuario = await controllerUsuario.setAtualizarUsuario(idUsuario, dadosBody, contentType)

    response.status(resultadoNovoUsuario.status_code)
    response.json(resultadoNovoUsuario)
})

app.delete('/v1/sinalibras/usuario/:id', cors(), async function(request,response){

    let idUsuario = request.params.id

    let dadosUsuario = await controllerUsuario.setExcluirUsuario(idUsuario)
    response.status(dadosUsuario.status_code)
    response.json(dadosUsuario)

})


app.listen('8080', function(){
    console.log("API funcionando e aguardando requisições");
})