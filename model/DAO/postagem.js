/**************************************************
 * objetivo: crud postagens
 * data: 24/09
 * autor: Paloma Vessoleck
 * versão 1.0
 */

const {PrismaClient} = require ('@prisma/client')

const prisma = new PrismaClient()

const insertPostagem = async function (dadosPostagem){
    let sql 
    try{
        if(
            dadosPostagem.foto_postagem != null &&
            dadosPostagem.foto_postagem != "" &&
            dadosPostagem.foto_postagem != undefined
        ){
            sql = `insert into tbl_postagem (
                texto,
                foto_postagem,
                id_professor,
                data
            ) values (
                '${dadosPostagem.texto}',
                '${dadosPostagem.foto_postagem}',
                '${dadosPostagem.id_professor}', 
                '${dadosPostagem.data}'
            )`
        }else{
            sql = `insert into tbl_postagem (
                texto,
                foto_postagem,
                id_professor, 
                data
            ) values (
                '${dadosPostagem.texto}',
                null,
                '${dadosPostagem.id_professor}',
                '${dadosPostagem.data}'
            )`
        }

        let rsPostagem = await prisma.$executeRawUnsafe(sql)

       return rsPostagem
       
    } catch (error){
        return false 
    }
}

const updatePostagem = async function (id, dadosPostagem){

    let sql 
    

    try{
        if(
            dadosPostagem.foto_postagem != null &&
            dadosPostagem.foto_postagem != "" &&
            dadosPostagem.foto_postagem != undefined
        
        ){

                sql = `update tbl_postagem set
                texto = '${dadosPostagem.texto}', 
                foto_postagem = '${dadosPostagem.foto_postagem}',
                id_professor = '${dadosPostagem.id_professor}', 
                data = '${dadosPostagem.data}'

                where id_postagem = ${id}`

            }else{
                sql = `update tbl_postagem set
                texto = '${dadosPostagem.texto}', 
                foto_postagem = null,
                id_professor = '${dadosPostagem.id_professor}', 
                data = '${dadosPostagem.data}' 
                
                where id_postagem = ${id}`

            }

            let rsPostagem = await prisma.$executeRawUnsafe(sql)

            return rsPostagem
            
    } catch (error){
        return false
    }
}

const deletePostagem = async function (id){

    try{
        let sql = `delete from tbl_postagem where id_postagem = ${id}`

        let rsPostagem = await prisma.$executeRawUnsafe(sql)

        if(rsPostagem)
            return true
      

    }catch(error){
        return false
    }
    
}

const selectAllFeed = async function (){

     try{

        let sql = `SELECT 
        id_postagem AS id,
        texto AS conteudo,
        foto_postagem AS foto,
        NULL AS url_video,             
        NULL AS descricao,             
        NULL AS duracao,               
        foto_postagem AS foto_capa,     
        data,
        NULL AS id_nivel,             
        NULL AS id_modulo,             
        id_professor,
        'postagem' AS tipo
    FROM tbl_postagem
    
    UNION ALL
    
    SELECT 
        id_videoaula AS id,
        titulo AS conteudo,
        foto_capa AS foto,
        url_video,
        descricao,
        duracao,
        foto_capa AS foto_capa,
        data,
        id_nivel,
        id_modulo,
        id_professor,
        'videoaula' AS tipo
    FROM tbl_videoaula
    
    ORDER BY data DESC;`

        let rsPostagem = await prisma.$queryRawUnsafe(sql)

      return rsPostagem

     }catch(error){
        return false
     }

     
}

const selectPostagemById = async function (id){
    try{

        let sql = `select * from tbl_postagem where id_postagem = ${id}`
        let rsPostagem = await prisma.$queryRawUnsafe(sql)

        return rsPostagem
    
    }catch(error){
        console.log(error);
        return false
    }
}

const selectPostagemByNome = async function (texto){
    try{

        let sql = `select * from tbl_postagem where texto LIKE "%${texto}%"`
        let rsPostagem = await prisma.$queryRawUnsafe(sql)

        if(rsPostagem)
            return true
    }catch(error){
        return false
    }
}


const selectUltimoId = async function (){
    try{
       let sql = `select cast(last_insert_id()as DECIMAL) as id from tbl_postagem limit 1;`

       let rsPostagem = await prisma.$queryRawUnsafe(sql);
       return rsPostagem

       
    } catch (error) {
       return false
   }
}

module.exports = {
    insertPostagem,
    updatePostagem,
    deletePostagem,
    selectAllFeed,
    selectPostagemById,
    selectPostagemByNome,
    selectUltimoId
}