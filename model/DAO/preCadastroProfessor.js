/************************************************************************************************************
 * Objetivo: Arquivo responsável pela comunicação com o banco de dados
 * Data: 01/10/2024
 * Autor: Julia Mendes 
 * Versão: 1.0
 * 
************************************************************************************************************/

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const insertUsuarioQuiz = async function (dadosUsuario) {
 
    let sql 
    try{

        sql =  `insert into tbl_usuario_teste 
                                    (
                                    email,
                                    data
                                    )values(
                                    '${dadosUsuario.email}',
                                    '${dadosUsuario.data}'
                                    )`

       let rsUser = await prisma.$executeRawUnsafe(sql)

       if(rsUser)
        return rsUser
    else
    return false
       
    
    }catch(error){
        return false 
    }

    
}



const selectUltimoIdUserQuiz = async function (){
    try{
       let sql = `select cast(last_insert_id()as DECIMAL) as id_usuario_teste from tbl_usuario_teste limit 1;`

       let rsUsuario = await prisma.$queryRawUnsafe(sql);
       return rsUsuario

       
    } catch (error) {
       return false
   }
}


module.exports = {
    insertUsuarioQuiz,
    selectUltimoIdUserQuiz
}

