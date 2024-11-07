const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const insertModulo = async function(dadosModulo){
    try{

        let sql = `insert into tbl_modulo (modulo) values ('${dadosModulo.modulo}')`

        let rsModulo = await prisma.$executeRawUnsafe(sql)
     

        if(rsModulo)
        return rsModulo

    }catch(error){
    
        return false
    }
}

const updateModulo = async function (id, dadosModulo){
    try{

        let sql = `update tbl_modulo set modulo = '${dadosModulo.modulo}' where id_modulo = ${id}`
     
        let rsModulo = await prisma.$executeRawUnsafe(sql)

        if(rsModulo)
        return rsModulo
        

    }catch(error){
        console.log(error);
        return error
    }
}

const deleteModulo = async function (id){
    try{
        let sql = `delete from tbl_modulo where id_modulo = ${id}`

        let rsModulo = await prisma.$executeRawUnsafe(sql)

        if(rsModulo)
        return true 
        else 
        return false
    }catch(error){
        return false
    }
}

const selectAllModulos = async function (){
    try{
        let sql = `select * from tbl_modulo`

        let rsModulo = await prisma.$queryRawUnsafe(sql)

        if(rsModulo)
        return rsModulo
        else 
        return false
    }catch(error){
        return false
    }
}

const selectModuloById = async function (id){
    try{

        let sql = `select * from tbl_modulo where id_modulo = ${id}`

        let rsModulo = await prisma.$queryRawUnsafe(sql)

        if(rsModulo)
        return rsModulo
        else 
        return false

    }catch (error){
        return false
    }
}


const selectLastId = async function (){
    try{
        let sql = `select cast(last_insert_id()as DECIMAL) as id_modulo from tbl_modulo limit 1;`
 
        let rsModulo = await prisma.$queryRawUnsafe(sql)
 
        return rsModulo
 
        
     } catch (error) {
        return false
    }
}





module.exports = {
    insertModulo,
    updateModulo,
    deleteModulo,
    selectAllModulos,
    selectModuloById,
    selectLastId,
    selectLastId,
    selectLastId
}
