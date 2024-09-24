/************************************************************************************************************
 * Objetivo: Arquivo responsável pela comunicação como banco de dados
 * Data: 03/09/2024
 * Autor: Julia Mendes 
 * Versão: 1.0
 * 
************************************************************************************************************/


const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const selectAllAlunos = async function (){
    
    let sql = 'select * from tbl_aluno'

    let rsAluno = await prisma.$queryRawUnsafe(sql);
    
    if( rsAluno) {
    return rsAluno;
}else
       return false;
}

const selectByIdAluno = async function (id){
    try{
        let sql = `select * from tbl_aluno where id_aluno = ${id}`

        let rsUsuario = await prisma.$queryRawUnsafe(sql)

        return rsUsuario
       

    } catch (error){
        console.log(error);
        
        return false
    }

}


const insertAluno = async function(dadosAluno){
       
    let sql 
        try{
    
            

            if(dadosAluno.foto_perfil != "" && 
                dadosAluno.foto_perfil != null &&
                dadosAluno.foto_perfil != undefined
                ){
           
        sql = `insert into tbl_aluno ( 
                                nome, 
                                data_cadastro,
                                email,
                                senha,
                                data_nascimento,
                                foto_perfil
                                ) values (
                                 '${dadosAluno.nome}',
                                   '${dadosAluno.data_cadastro}',
                                    '${dadosAluno.email}',
                                    '${dadosAluno.senha}',
                                    '${dadosAluno.data_nascimento}',
                                    '${dadosAluno.foto_perfil}'
                                )`
    
                }else {
    
                  sql =  `insert into tbl_aluno ( 
                                nome, 
                                data_cadastro,
                                email,
                                senha,
                                data_nascimento,
                                foto_perfil
                                ) values (
                                    '${dadosAluno.nome}',
                                    '${dadosAluno.data_cadastro}',
                                    '${dadosAluno.email}',
                                    '${dadosAluno.senha}',
                                    '${dadosAluno.data_nascimento}',
                                     null
                                )`
                }
    
        

        

        let rsUsuario = await prisma.$executeRawUnsafe(sql)

        if(rsUsuario){
            return true
        }else
            return false

    } catch(error) {
        return false
    }

}




 const selectUltimoIdAluno = async function (){
        try{
           let sql = `select cast(last_insert_id()as DECIMAL) as id_aluno from tbl_aluno limit 1;`
   
           let rsUsuario = await prisma.$queryRawUnsafe(sql);
           return rsUsuario
   
           
        } catch (error) {
           return false
       }
   }

   
const updateAluno = async function (id, dadosAluno) {

    let sql  


    try{
    
        if(dadosAluno.foto_perfil != "" && 
            dadosAluno.foto_perfil != null &&
            dadosAluno.foto_perfil != undefined
            ){
    
        sql = `update tbl_aluno set
            nome =  '${dadosAluno.nome}',
            data_cadastro =  '${dadosAluno.data_cadastro}',
            email =  '${dadosAluno.email}',
            senha =  '${dadosAluno.senha}',
            data_nascimento =  '${dadosAluno.data_nascimento}',
            foto_perfil = '${dadosAluno.foto_perfil}'
            where tbl_aluno.id_aluno = ${id}`

            }else{

                sql = `update tbl_aluno set
                nome =  '${dadosAluno.nome}',
                data_cadastro =  '${dadosAluno.data_cadastro}',
                email =  '${dadosAluno.email}',
                senha =  '${dadosAluno.senha}',
                data_nascimento =  '${dadosAluno.data_nascimento}',
                foto_perfil = null
                where tbl_aluno.id_aluno = ${id}`


            }
    
    
        let rsAluno = await prisma.$executeRawUnsafe(sql)
    
        if (rsAluno)
        return true
        else
        return false 
    }catch(error){
        return false
    }

}


    
const deleteAluno = async function (id){
     console.log(id);
     
    try {
   
       let sql = `delete from tbl_aluno where id_aluno = ${id}`
   
       let rsAluno = await prisma.$executeRawUnsafe(sql);  
      
       if(rsAluno)
       return true
      
     } catch (error) {
        
       return false
       }
   
}

const selectAlunoByNome = async function (nome){
    try{
        let sql = `select * from tbl_aluno where nome LIKE "%${nome}%"`
       

        let rsUsuario = await prisma.$queryRawUnsafe(sql);
        return rsUsuario;
    } catch (error) {
        return false
    }
}


const selectAlunoByEmail = async function (email){
    try{
        let sql = `select * from tbl_aluno where email LIKE "%${email}%"`

        let rsAluno = await prisma.$queryRawUnsafe(sql)

        if(rsAluno)
        return rsAluno
    }catch(error){
        return false
    }
}


const updateSenhaAluno = async function  (id, dadosAluno) {
    
}




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





module.exports = {
    selectAllAlunos,
    selectByIdAluno,
    selectAlunoByNome,
    selectAlunoByEmail,
    insertAluno,
    selectUltimoIdAluno,
    updateAluno,
    deleteAluno,
    updateAlunoFotoPerfil
}