const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const insertComentario = async function(dadosComentario){
     let sql = `insert into tbl_comentario_aula (
        data,
        comentario,
        id_videoaula,
        id_aluno
     ) values (
        '${dadosComentario.data}',
        '${dadosComentario.comentario}',
        '${dadosComentario.id_videoaula}',
        '${dadosComentario.id_aluno}'
     )`

     let rsComentario = await prisma.$executeRawUnsafe(sql)

     if(rsComentario)
     return rsComentario
    else
    return false
}

const deleteComentario = async function(id){
    let sql = `delete from tbl_comentario_aula where id = ${id}`

        let rsComentario = await prisma.$executeRawUnsafe(sql)

        if(rsComentario)
        return rsComentario
        else 
        return false
}

const selectComentariosVideo = async function(id){
    let sql = `select * from tbl_comentario_aula where id_videoaula = ${id}`

    let rsComentario = await prisma.$queryRawUnsafe(sql)

    if(rsComentario)
    return rsComentario
    else 
    return false
}

const selectLastId = async function (){
    try{
        let sql = `select cast(last_insert_id()as DECIMAL) as id_comentario from tbl_comentario_aula limit 1;`
 
        let rsComentario = await prisma.$queryRawUnsafe(sql)
        console.log(rsComentario);
        return rsComentario[0].id_comentario
 
        
     } catch (error) {
        return false
    }
}




module.exports = {
    insertComentario,
    deleteComentario,
    selectComentariosVideo,
    selectLastId
}