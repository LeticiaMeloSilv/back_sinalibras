/**************************************************
 * objetivo: crud videoaulas favoritas
 * data: 14/11
 * autor: Julia Mendes
 * versão 1.0
 */

const {PrismaClient} = require ('@prisma/client')

const prisma = new PrismaClient()


const insertVideoSalvo = async (dadosVideoSalvo) => {

    try {
        let sql = `insert into tbl_video_salvo (id_videoaula, id_aluno) values (${dadosVideoSalvo.id_videoaula}, ${dadosVideoSalvo.id_aluno})`
     
        let resultStatus = await prisma.$executeRawUnsafe(sql)
      
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

const updateVideoSalvo = async (dadosVideoSalvo, idVideoSalvo) => {

    try {
        let sql = `update tbl_video_salvo set id_videoaula = ${dadosVideoSalvo.id_videoaula}, id_aluno = ${dadosVideoSalvo.id_aluno} where id = ${idVideoSalvo}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        console.log(resultStatus);
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

const deleteVideoSalvoByIdVideoAula= async (id) => {

    try {
        let sql = `delete from tbl_video_salvo where id_videoaula = ${id}`
        let rsFilmeFavorito = await prisma.$executeRawUnsafe(sql)
        return rsFilmeFavorito
    } catch (error) {
        return false
    }

}

const deleteVideoSalvobyIdAluno= async (id) => {

    try {
        let sql = `delete from tbl_video_salvo where id_aluno = ${id}`
        let rsFilmeFavorito = await prisma.$executeRawUnsafe(sql)
        return rsFilmeFavorito
    } catch (error) {
        return false
    }

}

const deleteVideoSalvoByAlunoEvideoaula= async (idAluno,idVideoaula) => {

    try {
        let sql = `delete from tbl_video_salvo where id_aluno = ${idAluno} and id_videoaula ${idVideoaula}`
        let rsFilmeFavorito = await prisma.$executeRawUnsafe(sql)
        return rsFilmeFavorito
    } catch (error) {
        return false
    }

}





const selectByIdVideoAulaVideosSalvo= async (id) => {

    try {
        let sql = `select * from vw_todos_videos_salvos where id_videoaula = ${id};`
        let rsFilmeFavorito = await prisma.$queryRawUnsafe(sql)
        return rsFilmeFavorito
    } catch (error) {
        return false
    }

}


const selectByIdAlunoVideosSalvo= async (id) => {

    try {
        let sql = `select * from vw_todos_videos_salvos where id_aluno = ${id};`
        let rsFilmeFavorito = await prisma.$queryRawUnsafe(sql)
        return rsFilmeFavorito
    } catch (error) {
        return false
    }

}


// Buscar o id do último item da tabela
const selectLastIdVideoSalvo = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_video_salvo limit 1'
        let rsVideoSalvo = await prisma.$queryRawUnsafe(sql)
        return rsVideoSalvo
    } catch (error) {
        return false
    }

}


module.exports = {
    insertVideoSalvo,
    updateVideoSalvo,
  deleteVideoSalvoByAlunoEvideoaula,
  deleteVideoSalvoByIdVideoAula,
  deleteVideoSalvobyIdAluno,
    selectByIdAlunoVideosSalvo,
    selectLastIdVideoSalvo,
    selectByIdVideoAulaVideosSalvo
}

