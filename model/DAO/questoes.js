/************************************************************************************************************
 * Objetivo: Arquivo responsável pela comunicação com o banco de dados
 * Data: 17/09/2024
 * Autor: Julia Mendes 
 * Versão: 1.0
 * 
************************************************************************************************************/

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const selectQuestoesAternativas = async function (id){
    try{
        let sql = `select * from pergunta_alternativas where id_pergunta = ${id}`

        let rsQuestao = await prisma.$queryRawUnsafe(sql)

        return rsQuestao

    } catch (error){
        return false
    }

}

const insertQuestaoAlternativa = async function (dadosQuestao){
    let sql 

    try{
       
    sql = `CALL inserir_questao_com_alternativas(
        '${dadosQuestao.p_pergunta}', 
        '${dadosQuestao.p_video}',
        '${dadosQuestao.p_alternativas}'
    )`

        let rsQuestao = await prisma.$executeRawUnsafe(sql)

        if(rsQuestao){
            return true
        }else
            return false

    } catch(error) {
        return false
    }
}


const selectUltimoIdQuestao = async function (){
    try{
       let sql = `select cast(last_insert_id()as DECIMAL) as id from tbl_perguntas limit 1;`

       let rsQuestao = await prisma.$queryRawUnsafe(sql);
       return rsQuestao

       
    } catch (error) {
       return false
   }
}


module.exports = {
    selectQuestoesAternativas,
    insertQuestaoAlternativa,
    selectUltimoIdQuestao
}
