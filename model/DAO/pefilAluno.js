/************************************************************************************************************
 * Objetivo: Arquivo responsável pela comunicação com o banco de dados
 * Data: 14/11/2024
 * Autor: Julia Mendes 
 * Versão: 1.0
 * 
************************************************************************************************************/


const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/********************************* Perfil aluno **************************************/

const updateAlunoFotoPerfil = async function (id, dadosAluno) {

    let sql  


    try{
        sql = `update tbl_aluno set
            foto_perfil = '${dadosAluno.foto_perfil}'
            where tbl_aluno.id_aluno = ${id}`
            
        let rsAluno = await prisma.$executeRawUnsafe(sql)
    
        if (rsAluno)
        return true
        else
        return false 
    }catch(error){
        return false
    }

}

const updateSenhaAluno = async function  (id, dadosAluno) {
    
    let sql 

    try{

        sql = `UPDATE tbl_aluno SET 
                senha = md5('${dadosAluno.senha}') 
                WHERE id_aluno = ${id}`

          let rsAluno = await prisma.$executeRawUnsafe(sql)    
          if(rsAluno)
            return rsAluno
        else 
        return false
          
    }catch(error){
        return false 
    }
}


const selectInfoPeril = async function (id){
    try{
        let sql = `select id_aluno, nome, foto_perfil from tbl_aluno where id_aluno = ${id}`

        let rsProfessor = await prisma.$queryRawUnsafe(sql)

        if(rsProfessor)
        return rsProfessor
    }catch(error){
        return false
    }
}

module.exports = {
    updateAlunoFotoPerfil,
    updateSenhaAluno,
    selectInfoPeril
}