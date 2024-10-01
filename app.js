/*********************************************************
 * Objetivo: Arquivo para realizar as requisições do aplicativo 
 * data: 03/09/2024
 * Autor: Julia Mendes 
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
const controllerAluno = require('./controller/controller_aluno')
const controllerProfessor = require('./controller/controller_professor')
const controllerQuestao = require('./controller/controller_questao')

/************************************ Aluno ******************************/

app.get('/v1/sinalibras/aluno/validacao', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let dadosUsuario = await controllerAluno.getValidarAluno(dadosBody.email, dadosBody.senha, contentType)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)
//ok
})

app.get('/v1/sinalibras/alunos', cors(), async function(request, response){

    //Chama a função da controller para retorNAR FILMES
    let dadosUsuarios = await controllerAluno.getListarAlunos();
   

    //Validação para retornar o JSON dos filmes ou retornar o 404
    if(dadosUsuarios){
        response.json(dadosUsuarios);
        response.status(200);
    }else{
        response.json({message: 'Nenhum registro foi encontrado'})
        response.status(404);
    }
//ok

})

app.get('/v1/sinalibras/aluno/:id', cors(), async function(request,response,next){

    let idUsuario = request.params.id;

    //Encaminh o ID para o controller buscar o filme
    let dadosUsuarios = await controllerAluno.getBuscarAlunoById(idUsuario)

    response.status(dadosUsuarios.status_code);
    response.json(dadosUsuarios);
//ok
});

app.get('/v1/sinalibras/aluno/nome/:nome', cors(), async function(request,response,next){

        let nomeUsuario = request.query.nome
        let usuariosNome = await controllerAluno.getBuscarAlunoNome(nomeUsuario)
    
            response.json(usuariosNome);
             response.status(usuariosNome.status_code)

            
    //ok        
})


app.get('/v1/sinalibras/aluno/email/:email', cors(), async function(request,response,next){

        let emailUsuario = request.query.email
        let usuarios = await controllerAluno.getBuscarAlunoEmail(emailUsuario)
    
            response.json(usuarios);
             response.status(usuarios.status_code)

//ok
})

app.post('/v1/sinalibras/aluno', cors(), bodyParserJson, async function (request, response){
    let contentType = request.headers['content-type']

    let dadosBody = request.body
    let ressultadoNovaFoto = await controllerAluno.setInserirNovoAluno(dadosBody,contentType)

    response.status(ressultadoNovaFoto.status_code)
    response.json(ressultadoNovaFoto)

//ok
})


app.put('/v1/sinalibras/aluno/:id', cors(), bodyParserJson, async function(request,response){
    let contentType = request.headers['content-type']
    let idUsuario = request.params.id

    let dadosBody = request.body
    let ressultadoNovaFoto = await controllerAluno.setAtualizarAluno(idUsuario, dadosBody, contentType)

    response.status(ressultadoNovaFoto.status_code)
   
    
    response.json(ressultadoNovaFoto)
    //ok
})

app.delete('/v1/sinalibras/aluno/:id', cors(), async function(request,response){

    let idUsuario = request.params.id
    
    let dadosUsuario = await controllerAluno.setExcluirAluno(idUsuario)
    
    response.status(dadosUsuario.status_code)
    response.json(dadosUsuario)

    //ok

})



/********************************** Perfil Aluno ************************/

app.put('/v1/sinalibras/aluno/fotoPerfil/:id', cors(), bodyParserJson, async function(request,response){
    let contentType = request.headers['content-type']
    let idUsuario = request.params.id

    let dadosBody = request.body
    let resultadoNovaFoto = await controllerAluno.setAtualizarFotoPerfilAluno(idUsuario, dadosBody, contentType)

    response.status(resultadoNovaFoto.status_code)
   
    
    response.json(resultadoNovaFoto)

    //ok
})

app.put('/v1/sinalibras/aluno/perfil/:id', cors(), bodyParserJson, async function(request,response){
    let contentType = request.headers['content-type']
    let idUsuario = request.params.id

    let dadosBody = request.body
    let resultadoNovaSenha = await controllerAluno.setAtualizarSenhaAluno(idUsuario, dadosBody, contentType)

    response.status(resultadoNovaSenha.status_code)
   
    
    response.json(resultadoNovaSenha)
    //ok
})

/*********************************************** Pré cadastro professor ****************************************/
app.post('/v1/sinalibras/usuario', cors(), bodyParserJson, async function (request, response){
    let contentType = request.headers['content-type']

    let dadosBody = request.body
    let resultadoNovoUser = await controllerProfessor.setInserirUsuarioQuiz(dadosBody,contentType)

    response.status(resultadoNovoUser.status_code)
    response.json(resultadoNovoUser)

//ok
})


/*********************** Professor *****************************/

app.post('/v1/sinalibras/professor/cadastro', cors(), bodyParserJson, async function (request, response){
    let contentType = request.headers['content-type']

    let dadosBody = request.body
    let resultadoNovoProf = await controllerProfessor.setInserirNovoProfessor(dadosBody,contentType)

    response.status(resultadoNovoProf.status_code)
    response.json(resultadoNovoProf)

//ok
})

app.put('/v1/sinalibras/professor/edit/:id', cors(), bodyParserJson, async function(request,response){
    let contentType = request.headers['content-type']
    let idProfessor = request.params.id

    let dadosBody = request.body
    let resultadoNovoProf = await controllerProfessor.setAtualizarProfessor(idProfessor, dadosBody, contentType)

    response.status(resultadoNovoProf.status_code)
    response.json(resultadoNovoProf)

    //ok

})

app.delete('/v1/sinalibras/professor/delete/:id', cors(), async function(request,response){

    let idProfessor = request.params.id

    let dadosProfessor = await controllerProfessor.setExcluirProfessor(idProfessor)
    response.status(dadosProfessor.status_code)
    response.json(dadosProfessor)
//ok
})

app.get('/v1/sinalibras/professor/validacao', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let dadosUsuario = await controllerProfessor.getValidarProf(dadosBody.email, dadosBody.senha, contentType)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)
//ok
})


app.get('/v1/sinalibras/professor/listar', cors(), async function(request, response){

   
    let dadosProfessores = await controllerProfessor.getListarProfessores();

   
    if(dadosProfessores){
        response.json(dadosProfessores);
        response.status(200);
    }else{
        response.json({message: 'Nenhum registro foi encontrado'})
        response.status(404);
    }

    //ok

})

app.get('/v1/sinalibras/professor/buscar/:id', cors(), async function(request,response,next){

    let idProfessor = request.params.id;

    //Encaminh o ID para o controller buscar o filme
    let dadosProfessores = await controllerProfessor.getBuscarProfessorById(idProfessor)

    response.status(dadosProfessores.status_code);
    response.json(dadosProfessores);

    //ok
});

app.get('/v1/sinalibras/professor/nome/:nome', cors(), async function(request,response,next){

        let nomeProfessor = request.query.nome
        let professorNome = await controllerProfessor.getBuscarProfessorNome(nomeProfessor)
    
            response.json(professorNome);
             response.status(professorNome.status_code)

             //ok

     })


app.get('/v1/sinalibras/professor/email/:email', cors(), async function(request,response,next){

        let emailProfessor = request.query.email
        let professor = await controllerProfessor.getBuscarProfessorEmail(emailProfessor)
    
            response.json(professor);
             response.status(professor.status_code)

           //ok  
     })


     /********************************** Perfil Professor ************************/

app.put('/v1/sinalibras/professor/editPerfil/foto/:id', cors(), bodyParserJson, async function(request,response){
    let contentType = request.headers['content-type']
    let idUsuario = request.params.id

    let dadosBody = request.body
    let resultadoNovaFoto = await controllerProfessor.setAtualizarFotoPerfilProfessor(idUsuario, dadosBody, contentType)

    response.status(resultadoNovaFoto.status_code)
   
    
    response.json(resultadoNovaFoto)

    //ok
})

app.put('/v1/sinalibras/professor/editPefil/password/:id', cors(), bodyParserJson, async function(request,response){
    let contentType = request.headers['content-type']
    let idUsuario = request.params.id

    let dadosBody = request.body
    let resultadoNovaSenha = await controllerProfessor.setAtualizarSenhaProf(idUsuario, dadosBody, contentType)

    response.status(resultadoNovaSenha.status_code)
   
    
    response.json(resultadoNovaSenha)
//ok

})



/*********************** Questão *****************************/

app.post('/v1/sinalibras/questao', cors(), bodyParserJson, async function (request, response){
    let contentType = request.headers['content-type']

    let dadosBody = request.body
    let resultadoNovaQuestao = await controllerQuestao.setInserirNovaQuestao(dadosBody,contentType)

    response.status(resultadoNovaQuestao.status_code)
    response.json(resultadoNovaQuestao)
})


app.get('/v1/sinalibras/questao/:id', cors(), async function(request,response,next){

    let idQuestao = request.params.id;

    //Encaminh o ID para o controller buscar o filme
    let dadosQuestao = await controllerQuestao.getBuscarQuestaoid(idQuestao)


    response.status(dadosQuestao.status_code);
    response.json(dadosQuestao);

});

app.get('/v1/sinalibras/questao', cors(), async function(request, response,next){
 
    //Encaminh o ID para o controller buscar o filme
    let dadosQuestao = await controllerQuestao.getAllQuestoes()


    response.status(200);
    response.json(dadosQuestao);

});


app.listen('8080', function(){
    console.log("API funcionando e aguardando requisições");
})
