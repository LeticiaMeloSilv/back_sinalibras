const message = require('../modulo/config.js')
const videoaulaDAO = require ('../model/DAO/videoaula.js')
const nivelDAO = require ('../model/DAO/nivel.js')
const moduloDAO = require ('../model/DAO/modulo.js')
const professorDAO = require ('../model/DAO/professor.js')
const comentarioDAO = require('../model/DAO/comentarios.js')
const { Prisma } = require('@prisma/client')

const inserirNovaVideoaula = async function (dadosVideoaula, contentType){

    try{

        if(String(contentType).toLowerCase() == 'application/json'){

            let novaVideoaulaJson = {}

            if(dadosVideoaula.titulo == null || dadosVideoaula.url_video == null || dadosVideoaula.duracao == null || dadosVideoaula.foto_capa == null || dadosVideoaula.data == null || dadosVideoaula.id_nivel == null || dadosVideoaula.id_modulo == null || dadosVideoaula.id_professor == null ||
                dadosVideoaula.titulo == '' || dadosVideoaula.url_video == '' || dadosVideoaula.duracao == '' || dadosVideoaula.foto_capa == '' || dadosVideoaula.data == '' || dadosVideoaula.id_nivel == '' || dadosVideoaula.id_modulo == '' || dadosVideoaula.id_professor == '' ||
                dadosVideoaula.titulo == undefined || dadosVideoaula.url_video == undefined || dadosVideoaula.duracao == undefined || dadosVideoaula.foto_capa == undefined || dadosVideoaula.data == undefined || dadosVideoaula.id_nivel == undefined || dadosVideoaula.id_modulo == undefined || dadosVideoaula.id_professor == undefined ||
                dadosVideoaula.titulo.length > 50 || dadosVideoaula.url_video.length > 255 || dadosVideoaula.duracao.length > 8 || dadosVideoaula.foto_capa.length > 255 || dadosVideoaula.data.length != 10 || isNaN(dadosVideoaula.id_nivel) || isNaN(dadosVideoaula.id_modulo) || isNaN(dadosVideoaula.id_professor)
            ){
                return message.ERROR_REQUIRED_FIELDS
            }else{
                let status = false

                if(dadosVideoaula.descricao != null &&
                    dadosVideoaula.descricao != '' &&
                    dadosVideoaula.descricao != undefined
                ){
                    if(dadosVideoaula.descricao.length > 255){
                        return message.ERROR_REQUIRED_FIELDS
                    }else{
                        status = true
                    }
                } else{
                    status = true
                }

                if (status){
                    let novaVideoaula = await videoaulaDAO.insertVideoaula(dadosVideoaula)
          
    
                    if(novaVideoaula){
                        let ultimoId = await videoaulaDAO.selectUltimoId()
                        dadosVideoaula.id_videoaula = Number(ultimoId[0].id)

                        novaVideoaulaJson.videoaula = dadosVideoaula
                        novaVideoaulaJson.status = message.SUCESS_CREATED_ITEM.status
                        novaVideoaulaJson.status_code = message.SUCESS_CREATED_ITEM.status_code
                        novaVideoaulaJson.message = message.SUCESS_CREATED_ITEM.message

                        return novaVideoaulaJson
                    }else {
                      
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
                }
            }
        }else{
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error){
        return message.ERROR_INTERNAL_SERVER
    }
}

const setAtualizarVideoaula = async function (dadosVideoaula, id,  contentType){


    try{
        let idVideo = id
    if(idVideo == undefined || idVideo == null || idVideo == '' || isNaN(idVideo)){

        
        return message.ERROR_INVALID_ID
    } else {
        let idVideoaula = await videoaulaDAO.selectVideoaulaById(idVideo)

        if(idVideoaula){

            
                if(String(contentType).toLowerCase() == 'application/json'){
                    let updateVideoJson = {}

                    if(dadosVideoaula.titulo == null || dadosVideoaula.url_video == null || dadosVideoaula.duracao == null || dadosVideoaula.foto_capa == null  || dadosVideoaula.id_nivel == null || dadosVideoaula.id_modulo == null ||
                        dadosVideoaula.titulo == '' || dadosVideoaula.url_video == '' || dadosVideoaula.duracao == '' || dadosVideoaula.foto_capa == '' || dadosVideoaula.id_nivel == '' || dadosVideoaula.id_modulo == '' || 
                        dadosVideoaula.titulo.length > 50 || dadosVideoaula.url_video.length > 255 || dadosVideoaula.duracao.length > 8 || dadosVideoaula.foto_capa.length > 255 || isNaN(dadosVideoaula.id_nivel) || isNaN(dadosVideoaula.id_modulo) 
                    ){
                     
                        return message.ERROR_REQUIRED_FIELDS
                    } else {
                        let status = false

                        if(dadosVideoaula.descricao != null &&
                            dadosVideoaula.descricao != '' &&
                            dadosVideoaula.descricao != undefined
                        ){
                            if(dadosVideoaula.descricao.length>255){                                
                                return message.ERROR_REQUIRED_FIELDS
                            } else {
                                status = true 
                            }
                                 
                        } else {
                            status = true
                        }
                       
                        if(status){
                       
                            let videoAtualizado = await videoaulaDAO.updateVideoaula(dadosVideoaula, idVideo)
                            
                                if(videoAtualizado){

                                updateVideoJson.videoaula = dadosVideoaula
                                updateVideoJson.status = message.SUCESS_UPDATED_ITEM.status
                                updateVideoJson.status_code = message.SUCESS_UPDATED_ITEM.status_code
                                updateVideoJson.message = message.SUCESS_UPDATED_ITEM.message

                                return updateVideoJson

                            }else{
                                return message.ERROR_INTERNAL_SERVER_DB
                            }
                        }
                    }

                }else{
                    return message.ERROR_CONTENT_TYPE
                }
    

        }else{
            return message.ERROR_NOT_FOUND_ID
        }
    }

    }catch(error){
        return false
    }
    
}



const setExcluirVideoaula = async function (id){
    try{

        let idVideo = id

        if(idVideo == undefined || idVideo == ' ' || isNaN(idVideo)){
            return message.ERROR_INVALID_ID
        }else{
             let dadosVideoaula = await videoaulaDAO.selectVideoaulaById(idVideo)
          
             if(dadosVideoaula){

                dadosVideoaula = await videoaulaDAO.deleteVideoaula(idVideo)
                return message.SUCESS_DELETED_ITEM
             }else{
                return message.ERROR_NOT_FOUND_ID
             }
        }

    }catch (error){
        return message.ERROR_INTERNAL_SERVER
    }
}

const getVideoaulaById = async function (id){
    try{

       let idVideo = id

       let videoaulaJson = {}

    if(idVideo == undefined || idVideo == ' ' || isNaN(idVideo)){
        return message.ERROR_INVALID_ID
    }else{
    
        let dadosVideoaula = await videoaulaDAO.selectVideoaulaById(idVideo)

        if(dadosVideoaula.length>0){
           
            const promises = dadosVideoaula.map(async (videoaula) => {
                const nivelPromise = nivelDAO.selectNivelById(videoaula.id_nivel);
                const moduloPromise = moduloDAO.selectModuloById(videoaula.id_modulo);
                const professorPromise = professorDAO.selectByIdProfessor(videoaula.id_professor);
                const comentariosPromise = comentarioDAO.selectComentariosAula(videoaula.id_videoaula);

                const [nivel, modulo, professor, comentarios] = await Promise.all([nivelPromise, moduloPromise, professorPromise, comentariosPromise]);

                videoaula.nivel = nivel;
                videoaula.modulo = modulo;
                videoaula.professor = professor;
                videoaula.comentarios = [];

                for (let aluno of comentarios) {
                    const alunosPromise = videoaulaDAO.selectAlunoByComentario(aluno.id_aluno);
                    const alunos = await alunosPromise;

                    aluno.aluno = alunos;

                    videoaula.comentarios.push(aluno);
                }

               
                delete videoaula.id_nivel;
                delete videoaula.id_modulo;
                delete videoaula.id_professor;

                return videoaula;
            });

            const videoaulasCompletas = await Promise.all(promises);

            return {
                video: videoaulasCompletas,
                status_code: 200
            };
        } else {
            return message.ERROR_NOT_FOUND;
        }
    }


    }catch(error){       
        return false
    }

    
}



const getVideosDoModulo = async function(id){
    try{

        let idModulo = id

        let moduloJson = {}

        if(idModulo == null || idModulo == ' ' || isNaN(idModulo) || idModulo == undefined){
            return message.ERROR_INVALID_ID
        }else{

            let moduloId = await moduloDAO.selectModuloById(idModulo)
        

            if(moduloId){

                let dadosVideoaula = await videoaulaDAO.selectVideosModulo(idModulo)

            if(dadosVideoaula.length>0){

                for (let videoaula of dadosVideoaula){
                    let nivelVideoaula = await nivelDAO.selectNivelById(videoaula.id_nivel)   
                    videoaula.nivel = nivelVideoaula
                    delete videoaula.id_nivel 
                    
                }
    
                for (let videoaula of dadosVideoaula){
                    let moduloVideoaula = await moduloDAO.selectModuloById(videoaula.id_modulo)
                    videoaula.modulo = moduloVideoaula
                    delete videoaula.id_modulo
                }
                for (let videoaula of dadosVideoaula){
                    let professorVideoaula = await professorDAO.selectByIdProfessor(videoaula.id_professor)
                    videoaula.professor = professorVideoaula
                    delete videoaula.id_professor
                }
    
                for (let videoaula of dadosVideoaula){
                    let comentarioVideoaula = await comentarioDAO.selectComentariosAula(videoaula.id_videoaula)
                    videoaula.comentarios = comentarioVideoaula
                    delete videoaula.id_comentario
                }
                
                    moduloJson.videos = dadosVideoaula
                    moduloJson.status_code = 200

                    return moduloJson
              
            }else{
                return message.ERROR_NOT_FOUND
            }

            }else{
                return message.ERROR_NOT_FOUND_ID
            }

            
        }

    }catch (error){
        console.log(error);
        return message.ERROR_INTERNAL_SERVER
    }
}

const getVideosDoNivel = async function(id){
    try{

        let idNivel = id

        let nivelJson = {}

        if(idNivel == null || idNivel == ' ' || isNaN(idNivel) || idNivel == undefined){
            return message.ERROR_INVALID_ID
        }else{
            let nivel = await nivelDAO.selectLastId(idNivel)

            if(nivel){
                let dadosVideoaula = await videoaulaDAO.selectVideosNivel(idNivel)

                if(dadosVideoaula.length>0){

                    for (let videoaula of dadosVideoaula){
                        let nivelVideoaula = await nivelDAO.selectNivelById(videoaula.id_nivel)   
                        videoaula.nivel = nivelVideoaula
                        delete videoaula.id_nivel 
                        
                    }
        
                    for (let videoaula of dadosVideoaula){
                        let moduloVideoaula = await moduloDAO.selectModuloById(videoaula.id_modulo)
                        videoaula.modulo = moduloVideoaula
                        delete videoaula.id_modulo
                    }
                    for (let videoaula of dadosVideoaula){
                        let professorVideoaula = await professorDAO.selectByIdProfessor(videoaula.id_professor)
                        videoaula.professor = professorVideoaula
                        delete videoaula.id_professor
                    }
        
                    for (let videoaula of dadosVideoaula){
                        let comentarioVideoaula = await comentarioDAO.selectComentariosAula(videoaula.id_videoaula)
                        videoaula.comentarios = comentarioVideoaula
                        delete videoaula.id_comentario
                    }
                    
                        nivelJson.videos = dadosVideoaula
                        nivelJson.status_code = 200
                        return nivelJson
                  
                }else{
                    return message.ERROR_NOT_FOUND
                }
    
                }else{
                    return message.ERROR_NOT_FOUND_ID
                }
    
            }

            
    }catch (error){
        return message.ERROR_INTERNAL_SERVER_DB
    }
}


module.exports = {
    inserirNovaVideoaula,
    setAtualizarVideoaula,
    setExcluirVideoaula,
    getVideoaulaById,
    getVideosDoModulo,
    getVideosDoNivel
}