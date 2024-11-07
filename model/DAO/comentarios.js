const { PrismaClient } = require("@prisma/client")
const { Sql } = require("@prisma/client/runtime/library")
const { raw } = require("body-parser")
const prisma = new PrismaClient()

const insertComentarioAula = async function (dadosComentario) {
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

    if (rsComentario)
        return true
    else
        return false
}

const deleteComentarioAula = async function (id) {
    try {
        let sql = `delete from tbl_comentario_aula where id_comentario = ${id}`
        let rsComentario = await prisma.$executeRawUnsafe(sql);

        if(rsComentario)
        return true
    } catch (error) {
        return false
    }
}

const selectComentariosAula = async function (id) {
    try{

        let sql = `select * from tbl_comentario_aula where id_videoaula = ${id}`

        let rsComentario = await prisma.$queryRawUnsafe(sql)

        return rsComentario
    }catch(error){
        return false
    }
    
}

const selectComentarioByIdAula = async function (id) {
    try{

        let sql = `select * from tbl_comentario_aula where id_comentario = ${id}`

        let rsComentario = await prisma.$executeRawUnsafe(sql)

        if(rsComentario)
        return true

    }catch(error){
        return false
    }
    
}

const selectLastIdAula = async function () {
    try {
        let sql = `select cast(last_insert_id()as DECIMAL) as id_comentario from tbl_comentario_aula limit 1;`

        let rsComentario = await prisma.$queryRawUnsafe(sql)

        return rsComentario


    } catch (error) {
        return false
    }
}

const insertComentarioPostagem = async function (dadosComentario) {
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

const deleteComentarioPostagem = async function (id) {
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
    try{
        let sql = `select * from tbl_comentario_postagem where id_postagem = ${id}`

        let rsComentario = await prisma.$queryRawUnsafe(sql)

        return rsComentario

    }catch(error){
        return false
    }
    
}

const selectComentarioByIdPostagem = async function (id) {
    let sql = `select * from tbl_comentario_postagem where id_comentario = ${id}`

    let rsComentario = await prisma.$executeRawUnsafe(sql)

    if (rsComentario)
        return true
    else
        return false
}

const selectLastIdPostagem = async function () {
    try {
        let sql = `select cast(last_insert_id()as DECIMAL) as id_comentario from tbl_comentario_postagem limit 1;`

        let rsComentario = await prisma.$queryRawUnsafe(sql)

        return rsComentario


    } catch (error) {
        return false
    }
}





module.exports = {
    insertComentarioAula,
    deleteComentarioAula,
    selectComentariosAula,
    selectComentarioByIdAula,
    selectLastIdAula,
    insertComentarioPostagem,
    deleteComentarioPostagem,
    selectComentariosPostagem,
    selectComentarioByIdPostagem,
    selectLastIdPostagem
}