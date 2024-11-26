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
const controllerVideoaula = require('./controller/controller_videoaula')
const controllerNivel = require('./controller/controller_nivel')
const controllerModulo = require('./controller/controller_modulo')
const controllerComentario = require('./controller/controller_comentario')
const controllerPostagem = require('./controller/controller_postagem')
const controllerPerfilProfessor = require('./controller/controller_pefil_prof')
const controllerPerfilAluno = require('./controller/controller_perfil_aluno')
const controllerVideoAulaSalva = require('./controller/controller_videoSalvos')

/************************************ Aluno ******************************/

app.post('/v1/sinalibras/aluno/validacao', cors(), bodyParserJson, async (request, response, next) => {

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

        let nome = request.params.nome
        let usuariosNome = await controllerAluno.getBuscarAlunoNome(nome)
    
            response.json(usuariosNome);
            response.status(usuariosNome.status_code)

            
    //ok        
})


app.get('/v1/sinalibras/aluno/email/:email', cors(), async function(request,response,next){

        let email = request.params.email
        let usuarios = await controllerAluno.getBuscarAlunoEmail(email)
    
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
    let resultadoNovaFoto = await controllerPerfilAluno.setAtualizarFotoPerfilAluno(idUsuario, dadosBody, contentType)

    response.status(resultadoNovaFoto.status_code)
   
    
    response.json(resultadoNovaFoto)

    //ok
})

app.put('/v1/sinalibras/aluno/perfil/:id', cors(), bodyParserJson, async function(request,response){
    let contentType = request.headers['content-type']
    let idUsuario = request.params.id

    let dadosBody = request.body
    let resultadoNovaSenha = await controllerPerfilAluno.setAtualizarSenhaAluno(idUsuario, dadosBody, contentType)

    response.status(resultadoNovaSenha.status_code)
   
    
    response.json(resultadoNovaSenha)
    //ok
})


app.get('/v1/sinalibras/aluno/perfil/:id', cors(), bodyParserJson, async function(request,response){
    let idUsuario = request.params.id
    let infoPerfil = await controllerPerfilAluno.getInfoPerfilAluno(idUsuario)

    response.status(infoPerfil.status_code)
    response.json(infoPerfil)
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

app.post('/v1/sinalibras/resultado_quiz', cors(), bodyParserJson, async function (request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;



    let resultadoNovaResposta = await controllerProfessor.setInserirRespostaQuiz(dadosBody, contentType);


    response.status(resultadoNovaResposta.status_code); 
    response.json(resultadoNovaResposta);

});

app.get('/v1/sinalibras/usuario/email/:email', cors(), async function(request,response,next){

    let emailProfessor = request.params.email
  
    
    let professor = await controllerProfessor.getBuscarUsuarioTesteEmail(emailProfessor)


        response.json(professor);
         response.status(professor.status_code)

       //ok  
 })

 app.get('/v1/sinalibras/users', cors(), async function(request, response){

   
    let dadosProfessores = await controllerProfessor.getBuscarUsuariosTeste();

   
    if(dadosProfessores){
      response.json(dadosProfessores);
        response.status(200);
    }else{
        response.json({message: 'Nenhum registro foi encontrado'})
        response.status(404);
    }

    //ok

})

app.delete('/v1/sinalibras/usuario/:id', cors(), async function(request,response){

    let idProfessor = request.params.id

    let dadosProfessor = await controllerProfessor.setExcluirUsuarioTeste(idProfessor)
    response.status(dadosProfessor.status_code)
    response.json(dadosProfessor)
//ok
})

/*********************** Professor *****************************/

app.post('/v1/sinalibras/professor', cors(), bodyParserJson, async function (request, response){
    let contentType = request.headers['content-type']

    let dadosBody = request.body
    let resultadoNovoProf = await controllerProfessor.setInserirNovoProfessor(dadosBody,contentType)

    response.status(resultadoNovoProf.status_code)
    response.json(resultadoNovoProf)

//ok
})

app.put('/v1/sinalibras/professor/:id', cors(), bodyParserJson, async function(request,response){
    let contentType = request.headers['content-type']
    let idProfessor = request.params.id

    let dadosBody = request.body
    let resultadoNovoProf = await controllerProfessor.setAtualizarProfessor(idProfessor, dadosBody, contentType)

    response.status(resultadoNovoProf.status_code)
    response.json(resultadoNovoProf)

    //ok

})

app.delete('/v1/sinalibras/professor/:id', cors(), async function(request,response){

    let idProfessor = request.params.id

    let dadosProfessor = await controllerProfessor.setExcluirProfessor(idProfessor)
    response.status(dadosProfessor.status_code)
    response.json(dadosProfessor)
//ok
})

app.post('/v1/sinalibras/professor/validacao', cors(), bodyParserJson, async (request, response, next) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let dadosUsuario = await controllerProfessor.getValidarProf(dadosBody.email, dadosBody.senha, contentType)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)
//ok
})



app.get('/v1/sinalibras/professores', cors(), async function(request, response){

   
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

app.get('/v1/sinalibras/professor/:id', cors(), async function(request,response,next){

    let idProfessor = request.params.id;

    //Encaminh o ID para o controller buscar o filme
    let dadosProfessores = await controllerProfessor.getBuscarProfessorById(idProfessor)

    response.status(dadosProfessores.status_code);
    response.json(dadosProfessores);

    //ok
});


app.get('/v1/sinalibras/professor/nome/:nome', cors(), async function(request,response,next){

        let nomeProfessor = request.params.nome
        let professorNome = await controllerProfessor.getBuscarProfessorNome(nomeProfessor)
    
            response.json(professorNome);
             response.status(professorNome.status_code)

             //ok

     })



app.get('/v1/sinalibras/professor/email/:email', cors(), async function(request,response,next){

        let emailProfessor = request.params.email
        let professor = await controllerProfessor.getBuscarProfessorEmail(emailProfessor)
    
            response.json(professor);
             response.status(professor.status_code)

           //ok  
     })


/************************************ Perfil professor *****************************************/

app.put('/v1/sinalibras/professor/fotoPerfil/:id', cors(), bodyParserJson, async function(request,response){
    let contentType = request.headers['content-type']
    let idUsuario = request.params.id

    let dadosBody = request.body
    let resultadoNovaFoto = await controllerPerfilProfessor.setAtualizarFotoPerfilProfessor(idUsuario, dadosBody, contentType)

    response.status(resultadoNovaFoto.status_code)
   
    
    response.json(resultadoNovaFoto)

    //ok
})

app.put('/v1/sinalibras/professor/perfil/:id', cors(), bodyParserJson, async function(request,response){
    let contentType = request.headers['content-type']
    let idUsuario = request.params.id

    let dadosBody = request.body
    let resultadoNovaSenha = await controllerPerfilProfessor.setAtualizarSenhaProf(idUsuario, dadosBody, contentType)

    response.status(resultadoNovaSenha.status_code)
   
    
    response.json(resultadoNovaSenha)
    //ok
})

app.get('/v1/sinalibras/professor/perfil/:id', cors(), bodyParserJson, async function(request,response){
    let idUsuario = request.params.id
    let infoPerfil = await controllerPerfilProfessor.getInfoPerfilProfessor(idUsuario)

    response.status(infoPerfil.status_code)
    response.json(infoPerfil)
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


app.get('/v1/sinalibras/questoes', cors(), async function(request,response,next){


    //Encaminh o ID para o controller buscar o filme
    let dadosQuestao = await controllerQuestao.getAllQuestoes()

    response.status(dadosQuestao.status_code);
    response.json(dadosQuestao);

});

/**************************************** videoaulas ************************************/

app.get('/v1/sinalibras/videoaula/:id', cors(), async function(request, response){

    let idVideo = request.params.id
   
    let dadosVideoaula = await controllerVideoaula.getVideoaulaById(idVideo)
    
       response.status(dadosVideoaula.status_code);
    response.json(dadosVideoaula)
 
    
})


app.delete('/v1/sinalibras/videoaula/:id', cors(), async function(request, response){
    let idVideoaula = request.params.id

    let excluirVideo = await controllerVideoaula.setExcluirVideoaula(idVideoaula)

    response.status(excluirVideo.status_code)
    response.json(excluirVideo)

}) 


app.post('/v1/sinalibras/videoaula', cors(), bodyParserJson, async function(request, response){
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let novaVideoaula = await controllerVideoaula.inserirNovaVideoaula(dadosBody, contentType)

    response.status(novaVideoaula.status_code)
    response.json(novaVideoaula)

})

app.put('/v1/sinalibras/videoaula/:id', cors(), bodyParserJson, async function(request, response){

    let idVideoaula = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let videoaulaAtualizado = await controllerVideoaula.setAtualizarVideoaula(dadosBody, idVideoaula, contentType)

    response.status(videoaulaAtualizado.status_code)
    response.json(videoaulaAtualizado)

})

app.get('/v1/sinalibras/videos/nivel/:id', cors(), async function(request, response){
    let idNivel = request.params.id
    let videosNivel = await controllerVideoaula.getVideosDoNivel(idNivel)

        response.status(200)
        response.json(videosNivel)
    

})

app.get('/v1/sinalibras/videos/modulo/:id', cors(), async function(request, response){
    let idModulo = request.params.id
    let videosModulo = await controllerVideoaula.getVideosDoModulo(idModulo)

        response.status(200)
        response.json(videosModulo)
   
})



/****************************** MODULOS ***************************************/

app.get('/v1/sinalibras/modulo/:id', cors(), async function(request, response, next){
    let idModulo = request.params.id

    let dadosModulo = await controllerModulo.getModuloById(idModulo)

    if(dadosModulo){
        response.status(200)
        response.json(dadosModulo)
    }else{
        response.status(404)
        response.json({message: 'Nenhum registro foi encontrado'})
    }

    //ok
})


app.get('/v1/sinalibras/modulos', cors(), async function (request, response){
    let dadosModulo = await controllerModulo.getListaModulo()

    if(dadosModulo){
        response.status(200)
        response.json(dadosModulo)
    }else{
        response.status(404)
        response.json({message: 'Nenhum registro foi encontrado'})
    }
})

app.post('/v1/sinalibras/modulo', cors(), bodyParserJson, async function(request, response){
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let novoModulo = await controllerModulo.inserirNovoModulo(dadosBody, contentType)

    if(novoModulo){
        response.status(200)
        response.json(novoModulo)
    }else{
        response.status(404)
        response.json({message: 'Não foi possível inserir no banco'})
    }

})


app.delete('/v1/sinalibras/modulo/:id', cors(), async function(request, response){
    let idModulo = request.params.id


    let dadosModulo = await controllerModulo.setExcluirModulo(idModulo)
    if(dadosModulo){
        response.status(200)
        response.json(dadosModulo)
    }else{
        response.status(404)
        response.json({message: 'Nenhum registro foi encontrado'})
    }

})

app.put('/v1/sinalibras/modulo/:id', cors(), bodyParserJson, async function(request, response){

    let idModulo = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let moduloAtualizado = await controllerModulo.setAtualizarModulo(idModulo, dadosBody, contentType)

    if(moduloAtualizado){
        response.status(200)
        response.json(moduloAtualizado)
    }else{
        response.status(404)
        response.json({message: 'Nenhum registro foi encontrado'})
    }

})



/**************************** NIVEIS **************************/
app.get('/v1/sinalibras/nivel/:id', cors(), async function(request, response, next){
    let idNivel = request.params.id

    let dadosNivel = await controllerNivel.getNivelById(idNivel)

        if(dadosNivel){
            response.json(dadosNivel)
            response.status(dadosNivel.status_code)
          }else{
              response.json({message: 'Nenhum registro foi encontrado'})
              response.status(404);
          }
        
 

})

app.get('/v1/sinalibras/niveis', cors(), async function (request, response){
    let dadosNivel = await controllerNivel.getListaNivel()

        response.status(200)
        response.json(dadosNivel)
   
})

app.post('/v1/sinalibras/nivel', cors(), bodyParserJson, async function(request, response){
    let dadosBody = request.body
    let contentType = request.headers['content-type']
    
    
    let novoNivel = await controllerNivel.inserirNovoNivel(dadosBody, contentType)

    response.status(novoNivel.status_code)
    response.json(novoNivel)
  

})


app.delete('/v1/sinalibras/nivel/:id', cors(), async function(request, response){
    let idNivel = request.params.id


    let dadosNivel = await controllerNivel.setExcluirNivel(idNivel)

        response.status(dadosNivel.status_code)
        response.json(dadosNivel)
    

})


/************************ COMENTARIOS AULA ************************/

app.post('/v1/sinalibras/videoaula/comentario', cors(), bodyParserJson, async function(request, response){
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let novoComentario = await controllerComentario.setInserirNovoComentarioAula(dadosBody, contentType)

    if(novoComentario){
        response.status(200)
        response.json(novoComentario)
    }else{
        response.status(404)
        response.json({message: 'Não foi possível inserir no banco'})
    }

})

app.get('/v1/sinalibras/videoaula/comentarios/:id', cors(), async function (request, response){
    let idVideo = request.params.id
    let dadosComentario = await controllerComentario.getAllComentariosAula(idVideo)

    if(dadosComentario){
        response.status(200)
        response.json(dadosComentario)
    }else{
        response.status(404)
        response.json({message: 'Não há dados no banco'})
    }
})


app.delete('/v1/sinalibras/videoaula/comentario/:id', cors(), async function (request, response){

    let idComentario = request.params.id
    let deleteComentario = await controllerComentario.setDeleteComentarioAula(idComentario)

    if(deleteComentario){
        response.status(200)
        response.json(deleteComentario)
    }else{
        response.status(404)
        response.json({message: 'Não foi possível excluir esse comentário'})
    }
})

/**************************************** POSTAGENS ************************************/

app.get('/v1/sinalibras/postagem/:id', cors(), async function(request, response){

    let idPostagem = request.params.id
   
    let dadosPostagem = await controllerPostagem.getPostagemById(idPostagem)

    response.json(dadosPostagem);
    response.status(200);
  

})


app.delete('/v1/sinalibras/postagem/:id', cors(), async function(request, response){
    let idPostagem = request.params.id

    let excluirPostagem = await controllerPostagem.setExcluirPostagem(idPostagem)
        response.status(excluirPostagem.status_code)
        response.json(excluirPostagem)
  
}) 


    app.post('/v1/sinalibras/postagem', cors(), bodyParserJson, async function(request, response){
        let contentType = request.headers['content-type']
        let dadosBody = request.body

        let novaPostagem = await controllerPostagem.inserirNovaPostagem(dadosBody, contentType)


            response.status(novaPostagem.status_code)
            response.json(novaPostagem)
    

    })

app.put('/v1/sinalibras/postagem/:id', cors(), bodyParserJson, async function(request, response){

    let idPostagem = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let postagemAtualizada = await controllerPostagem.setAtualizarPostagem(idPostagem, dadosBody, contentType)


        response.status(postagemAtualizada.status_code)
        response.json(postagemAtualizada)
   

})

app.get('/v1/sinalibras/feed', cors(), async function(request, response){
   
    let dadosFeed = await controllerPostagem.getAllFeed()

    response.status(dadosFeed.status_code);
    response.json(dadosFeed);
    
})





/************************ COMENTARIOS POSTAGEM ************************/

app.post('/v1/sinalibras/postagem/comentario', cors(), bodyParserJson, async function(request, response){
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let novoComentario = await controllerComentario.setInserirNovoComentarioPostagem(dadosBody, contentType)

    if(novoComentario){
        response.status(200)
        response.json(novoComentario)
    }else{
        response.status(404)
        response.json({message: 'Não foi possível inserir no banco'})
    }

})

app.get('/v1/sinalibras/postagem/comentarios/:id', cors(), async function (request, response){
    let idPostagem = request.params.id
    let dadosComentario = await controllerComentario.getAllComentariosPostagem(idPostagem)

    if(dadosComentario){
        response.status(200)
        response.json(dadosComentario)
    }else{
        response.status(404)
        response.json({message: 'Não há dados no banco'})
    }
})


app.delete('/v1/sinalibras/postagem/comentario/:id', cors(), async function (request, response){

    let idComentario = request.params.id
    let deleteComentario = await controllerComentario.setDeleteComentarioPostagem(idComentario)

    if(deleteComentario){
        response.status(200)
        response.json(deleteComentario)
    }else{
        response.status(404)
        response.json({message: 'Não foi possível excluir esse comentário'})
    }
})

/************************ VIDEOAULA SALVAS ************************/

app.post('/v1/sinalibras/videoaulasalva', cors(), bodyParserJson, async function(request, response){
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let videoSalvo = await controllerVideoAulaSalva.setInserirVideoSalvo(dadosBody, contentType)


        response.status(videoSalvo.status_code)
        response.json(videoSalvo)
   

})






app.listen('8080', function(){
    console.log("API funcionando e aguardando requisições");
});


