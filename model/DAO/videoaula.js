/**************************************************
 * objetivo: crud videoaulas
 * data: 24/09
 * autor: Paloma Vessoleck
 * versão 1.0
 */

const {PrismaClient} = require ('@prisma/client')

const prisma = new PrismaClient()

const insertVideoaula = async function (dadosVideoaula){
    let sql 
    try{
        if(
            dadosVideoaula.descricao != null &&
            dadosVideoaula.descricao != "" &&
            dadosVideoaula.descricao != undefined
        ){
            sql = `insert into tbl_videoaula (
                titulo,
                url_video,
                descricao,
                duracao, 
                foto_capa,
                data,
                id_nivel,
                id_modulo,
                id_professor
            ) values (
                '${dadosVideoaula.titulo}',
                '${dadosVideoaula.url_video}',
                '${dadosVideoaula.descricao}',
                '${dadosVideoaula.duracao}', 
                '${dadosVideoaula.foto_capa}',
                '${dadosVideoaula.data}',
                '${dadosVideoaula.id_nivel}',
                '${dadosVideoaula.id_modulo}',
                '${dadosVideoaula.id_professor}'
            )`
        }else{
            sql = `insert into tbl_videoaula (
                titulo,
                url_video,
                descricao,
                duracao, 
                foto_capa,
                data,
                id_nivel,
                id_modulo,
                id_professor
            ) values (
                '${dadosVideoaula.titulo}',
                '${dadosVideoaula.url_video}',
                null,
                '${dadosVideoaula.duracao}',
                '${dadosVideoaula.foto_capa}',
                '${dadosVideoaula.data}',
                '${dadosVideoaula.id_nivel}',
                '${dadosVideoaula.id_modulo}',
                '${dadosVideoaula.id_professor}'
            )`
        }

        let rsVideoaula = await prisma.$executeRawUnsafe(sql)

           if(rsVideoaula)
           return true
       
    } catch (error){
        return false 
    }
}

const updateVideoaula = async function (dadosVideoaula, id){

    let sql 
    

    try{
        if(
            dadosVideoaula.descricao != null &&
            dadosVideoaula.descricao != "" &&
            dadosVideoaula.descricao != undefined
        
        ){

                sql = `update tbl_videoaula set
                titulo = '${dadosVideoaula.titulo}', 
                descricao = '${dadosVideoaula.descricao}',
                duracao = '${dadosVideoaula.duracao}', 
                foto_capa = '${dadosVideoaula.foto_capa}', 
                id_nivel = '${dadosVideoaula.id_nivel}', 
                id_modulo = '${dadosVideoaula.id_modulo}', 

                where id_videoaula = ${id}`

            }else{
                sql = `update tbl_videoaula set
                titulo = '${dadosVideoaula.titulo}', 
                descricao = null,
                duracao = '${dadosVideoaula.duracao}', 
                foto_capa = '${dadosVideoaula.foto_capa}', 
                id_nivel = '${dadosVideoaula.id_nivel}', 
                id_modulo = '${dadosVideoaula.id_modulo}', 
                
                where id_videoaula = ${id}`

            }

            let rsVideoaula = await prisma.$executeRawUnsafe(sql)

            if(rsVideoaula)
                return true
            else 
                return false
    } catch (error){
        return false
    }
}

const deleteVideoaula = async function (id){

    try{
        let sql = `delete from tbl_videoaula where id_videoaula = ${id}`

        let rsVideoaula = await prisma.$executeRawUnsafe(sql)

        if(rsVideoaula)
            return rsVideoaula
      

    }catch(error){
        return false
    }
    
}

const selectAllVideoaula = async function (){

     try{

        let sql = `select  * from tbl_videoaula order by data desc;`

        let rsVideoaula = await prisma.$queryRawUnsafe(sql)

      

        if(rsVideoaula.length > 0)
            return rsVideoaula
    

     }catch(error){
        return false
     }

     
}

const selectVideoaulaById = async function (id){
    try{

        let sql = `select * from tbl_videoaula where id_videoaula = ${id}`
        let rsVideoaula = await prisma.$queryRawUnsafe(sql)

        if(rsVideoaula)
            return rsVideoaula
    
    }catch(error){
        return false
    }
}

const selectVideoaulaByNome = async function (titulo){
    try{

        let sql = `select * from tbl_videoaula where titulo LIKE "%${titulo}%"`
        let rsVideoaula = await prisma.$queryRawUnsafe(sql)

        if(rsVideoaula)
            return true
        else
            return false
    }catch(error){
        return false
    }
}


const selectUltimoId = async function (){
    try{
       let sql = `select cast(last_insert_id()as DECIMAL) as id from tbl_videoaula limit 1;`

       let rsVideoaula = await prisma.$queryRawUnsafe(sql);
       return rsVideoaula

       
    } catch (error) {
       return false
   }
}

module.exports = {
    insertVideoaula,
    updateVideoaula,
    deleteVideoaula,
    selectAllVideoaula,
    selectVideoaulaById,
    selectVideoaulaByNome,
    selectUltimoId
}