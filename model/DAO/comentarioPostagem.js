const { PrismaClient } = require("@prisma/client")
const { Sql } = require("@prisma/client/runtime/library")
const prisma = new PrismaClient()

const insertComentario = async function (dadosComentario) {
    let sql = `insert into tbl_comentario_postagem (
        comentario,
        data,
        id_postagem,
        id_aluno
     ) values (
        '${dadosComentario.comentario}',
        '${dadosComentario.data}',
        '${dadosComentario.id_postagem}',
        '${dadosComentario.id_aluno}'
     )`

    let rsComentario = await prisma.$executeRawUnsafe(sql)

    if (rsComentario)
        return true
    else
        return false
}

const deleteComentario = async function (id) {
    try {
        let sql = `delete from tbl_comentario_postagem where id_postagem = ${id}`
   
        let rsComentario = await prisma.$executeRawUnsafe(sql);
       
       if(rsComentario)
        return true

    } catch (error) {
        return false
    }
}


const selectComentariosPostagem = async function (id) {
    let sql = `select * from tbl_comentario_postagem where id_postagem = ${id}`

    let rsComentario = await prisma.$queryRawUnsafe(sql)

    if (rsComentario)
        return true
    else
        return false
}

const selectComentarioById = async function (id) {
    let sql = `select * from tbl_comentario_postagem where id_comentario = ${id}`

    let rsComentario = await prisma.$executeRawUnsafe(sql)

    if (rsComentario)
        return true
    else
        return false
}

const selectLastId = async function () {
    try {
        let sql = `select cast(last_insert_id()as DECIMAL) as id_comentario from tbl_comentario_postagem limit 1;`

        let rsComentario = await prisma.$queryRawUnsafe(sql)

        return rsComentario


    } catch (error) {
        return false
    }
}




module.exports = {
    insertComentario,
    deleteComentario,
    selectComentariosPostagem,
    selectComentarioById,
    selectLastId
}