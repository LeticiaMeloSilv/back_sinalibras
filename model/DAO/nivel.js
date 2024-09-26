const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const insertNivel = async function(dadosNivel){
    try{

        let sql = `insert into tbl_nivel (nivel) values ('${dadosNivel.nivel})`

        let rsNivel = await prisma.$executeRawUnsafe(sql)

        if(rsNivel)
        return true
        else 
        return false

    }catch(error){
        return false
    }
}

const updateNivel = async function (id, dadosNivel){
    try{

        let sql = `update tbl_nivel set nivel = '${dadosNivel.nivel}' where id_nivel = ${id}`

        let rsNivel = await prisma.$executeRawUnsafe(sql)

        if(rsNivel)
        return true 
        else 
        return false

    }catch(error){
        return false
    }
}

const deleteNivel = async function (id){
    try{
        let sql = `delete from tbl_nivel where id_nivel = ${id}`

        let rsNivel = await prisma.$executeRawUnsafe(sql)

        if(rsNivel)
        return true 
        else 
        return false
    }catch(error){
        return false
    }
}

const selectAllNiveis = async function (){
    let sql
    try{
        sql = `select * from tbl_nivel`

        let rsNivel = await prisma.$queryRawUnsafe(sql)

     

        if(rsNivel)
        return rsNivel
    }catch(error){
   
        return false
    }
}

const selectNivelById = async function (id){
    try{

        let sql = `select * from tbl_nivel where id_nivel = ${id}`

        let rsNivel = await prisma.$queryRawUnsafe(sql)

        if(rsNivel)
        return rsNivel

    }catch (error){
        return false
    }
}

const selectVideosNivel = async function (id){
    try{

        let sql = `select * tbl_videoaula where id_nivel = ${id}`

        let rsNivel = await prisma.$queryRawUnsafe(sql)

        if(rsNivel)
        return true 
        else 
        return false

    }catch(error){
        return false
    }
}

const selectLastId = async function (){
    try{
        let sql = `select cast(last_insert_id()as DECIMAL) as id from tbl_nivel limit 1;`
 
        let rsNivel = await prisma.$queryRawUnsafe(sql)
 
        return rsNivel
 
        
     } catch (error) {
        return false
    }
}

module.exports = {
    insertNivel,
    updateNivel,
    deleteNivel,
    selectAllNiveis,
    selectNivelById,
    selectVideosNivel,
    selectLastId
}