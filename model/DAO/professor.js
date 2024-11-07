/************************************************************************************************************
 * Objetivo: Arquivo responsável pela comunicação como banco de dados
 * Data: 03/09/2024
 * Autor: Julia Mendes
 * Versão: 1.0
 * 
************************************************************************************************************/



const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const selectValidarProf = async function (email,senha){
    let sql = `select tp.id_professor, tp.nome, tp.email from tbl_professor as tp 
    where email = '${email}' and senha = md5('${senha}')`
   
       let rsProfessor = await prisma.$queryRawUnsafe(sql)

       
    
       
       if(rsProfessor){
           return rsProfessor
       }else{
           return false
       }
   }
   
const selectVerificarEmail = async function (email){
    try{
     let sql = `select ta.nome, ta.email from tbl_professor as ta where email = '${email}';`


     let rsProfessor = await prisma.$queryRawUnsafe(sql)

     if (rsProfessor.length > 0){
        return rsProfessor
     } else{
        let sqlProf = `select ta.nome, ta.email from tbl_aluno as ta where email = '${email}';`

        let rsProfAluno = await prisma.$queryRawUnsafe(sqlProf)

        if(rsProfAluno){
            return rsProfAluno
        }else{
            return false
        }
     }


    
    }catch(error){
        return false
    }
    
}







const selectAllProfessores = async function (){
    
    let sql = 'select id_professor, nome, email, data_nascimento, foto_perfil from tbl_professor'

    let rsProfessor = await prisma.$queryRawUnsafe(sql);
    
    if(rsProfessor) {
    return rsProfessor;
}else
       return false;
}

const selectByIdProfessor = async function (id){
    console.log(id);
    try{
        let sql = `select id_professor, nome, email, data_nascimento, foto_perfil from tbl_professor where id_professor = ${id}`

        let rsProfessor = await prisma.$queryRawUnsafe(sql)
        return rsProfessor
       

    } catch (error){
        return false
    }

}


const insertProfessor = async function(dadosProfessor){
   
    let sql 

    try{

        if(dadosProfessor.foto_perfil != "" && 
            dadosProfessor.foto_perfil != null &&
            dadosProfessor.foto_perfil != undefined
            ){
       
    sql = `insert into tbl_professor ( 
                            nome, 
                            data_cadastro,
                            email,
                            senha,
                            data_nascimento,
                            foto_perfil
                            ) values (
                                '${dadosProfessor.nome}',
                                '${dadosProfessor.data_cadastro}',
                                '${dadosProfessor.email}',
                                md5('${dadosProfessor.senha}'),
                                '${dadosProfessor.data_nascimento}',
                                '${dadosProfessor.foto_perfil}'
                            )`

            }else {

              sql =  `insert into tbl_professor ( 
                            nome, 
                            data_cadastro,
                            email,
                            senha,
                            data_nascimento,
                            foto_perfil
                            ) values (
                                '${dadosProfessor.nome}',
                                '${dadosProfessor.data_cadastro}',
                                '${dadosProfessor.email}',
                                md5('${dadosProfessor.senha}'),
                                '${dadosProfessor.data_nascimento}',
                                 null
                            )`
            }

        let rsProfessor = await prisma.$executeRawUnsafe(sql)
           
            
        if(rsProfessor){
            return true
        }else
            return false

    } catch(error) {
        console.log(error);
        
        return false
    }
}



    const selectUltimoIdProfessor = async function (){
        try{
           let sql = `select cast(last_insert_id()as DECIMAL) as id_professor from tbl_professor limit 1;`
   
           let rsProfessor = await prisma.$queryRawUnsafe(sql);
           return rsProfessor
        } catch (error) {
           return false
       }
   }

   const updateProfessor = async function (id, dadosProfessor) {

    let sql  


    try{
       
        if(dadosProfessor.foto_perfil != "" && 
            dadosProfessor.foto_perfil != null &&
            dadosProfessor.foto_perfil != undefined
            ){
    
        sql = `update tbl_professor set
            nome =  '${dadosProfessor.nome}',
            email =  '${dadosProfessor.email}',
            data_nascimento =  '${dadosProfessor.data_nascimento}',
            foto_perfil = '${dadosProfessor.foto_perfil}'
            where tbl_professor.id_professor = ${id}`

            }else{

                sql = `update tbl_professor set
                nome =  '${dadosProfessor.nome}',
                email =  '${dadosProfessor.email}',
                data_nascimento =  '${dadosProfessor.data_nascimento}',
                foto_perfil = null
                where tbl_professor.id_professor = ${id}`


            }
       
    
        let rsProfessor = await prisma.$executeRawUnsafe(sql)
    
         if (rsProfessor)
         return true
         else
         return false 
    }catch(error){
        return false
    }

}

const deleteProfessor = async function (id){

    try {
   
       let sql = `delete from tbl_professor  where id_professor = ${id}`
   
       let rsProfessor = await prisma.$executeRawUnsafe(sql);  
      
       if(rsProfessor)
       return true
      
     } catch (error) {
        
       return false
       }
   
}

const selectProfessorByNome = async function (nome){
    try{
        let sql = `select id_professor, nome, email, data_nascimento, foto_perfil from tbl_professor where nome LIKE "%${nome}%"`
       
        let rsProfessor = await prisma.$queryRawUnsafe(sql);
        return rsProfessor;
    } catch (error) {
        return false
    }
}



const selectProfessorByEmail = async function (email){
    try{
        let sql = `select id_professor, nome, email, data_nascimento, foto_perfil from tbl_professor where email LIKE "%${email}%"`

        let rsProfessor = await prisma.$queryRawUnsafe(sql)

        if(rsProfessor)
        return rsProfessor
    }catch(error){
        return false
    }
}


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
        let sql = `select nome, foto_perfil from tbl_professor where id_professor = ${id}`

        let rsProfessor = await prisma.$queryRawUnsafe(sql)

        if(rsProfessor)
        return rsProfessor
    }catch(error){
        return false
    }
}





module.exports = {
    selectAllProfessores,
    selectByIdProfessor,
    selectProfessorByNome,
    selectProfessorByEmail,
    selectUltimoIdProfessor,
    deleteProfessor,
    updateProfessor,
    insertProfessor,
    updateProfessorFotoPerfil,
    updateSenhaProfessor,
    selectValidarProf,
    selectVerificarEmail,
    selectInfoPeril
}