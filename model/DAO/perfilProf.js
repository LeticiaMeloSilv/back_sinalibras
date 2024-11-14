/************************************************************************************************************
 * Objetivo: Arquivo responsável pela comunicação como banco de dados
 * Data: 14/11/2024
 * Autor: Julia Mendes 
 * Versão: 1.0
 * 
************************************************************************************************************/


const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


/********************************* Perfil professor **************************************/

const updateProfessorFotoPerfil = async function (id, dadosProfessor) {

    let sql  


    try{
        sql = `update tbl_professor set
            foto_perfil = '${dadosProfessor.foto_perfil}'
            where tbl_professor.id_professor = ${id}`
            
        let rsProfessor = await prisma.$executeRawUnsafe(sql)
    
        if (rsProfessor)
        return true
        else
        return false 
    }catch(error){
        return false
    }

}

const updateSenhaProfessor = async function  (id, dadosProfessor) {
    
    let sql 

    try{

        sql = `UPDATE tbl_professor SET 
                senha = md5('${dadosProfessor.senha}') 
                WHERE id_professor = ${id}`

          let rsProfessor = await prisma.$executeRawUnsafe(sql)    
          if(rsProfessor){
            return rsProfessor
          }  
    }catch(error){
        return false 
    }
}



const selectInfoPeril = async function (id){
    try{
        let sql = `select id_professor, nome, foto_perfil from tbl_professor where id_professor = ${id}`

        let rsProfessor = await prisma.$queryRawUnsafe(sql)

        if(rsProfessor)
        return rsProfessor
    }catch(error){
        console.error(error);
        return false
    }
}



module.exports = {
    selectInfoPeril,
    updateProfessorFotoPerfil,
    updateSenhaProfessor
}