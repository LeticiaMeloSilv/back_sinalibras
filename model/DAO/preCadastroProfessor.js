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



const insertRespostaUsuario = async function (dadosUsuario) {
    let sql

    try {
        const colunas = ['id_alternativa', 'id_usuario_teste'];
        const valores = [];

        dadosUsuario.forEach(usuario => {
            valores.push(`('${usuario.id_alternativa}', '${usuario.id_usuario_teste}')`);
        });

        sql = `insert into  tbl_resposta_usuario (${colunas.join(', ')}) values ${valores.join(', ')};`;

        let rsUser = await prisma.$executeRawUnsafe(sql);

        return rsUser ? rsUser : false;

    } catch (error) {
        console.error("Erro ao inserir dados:", error);
        return false;
    }
}

const selectUltimoIdRespostaQuiz = async function (){
    try{
       let sql = `select cast(last_insert_id()as DECIMAL) as id from tbl_resposta_usuario limit 1;`

       let rsProfessor = await prisma.$queryRawUnsafe(sql);
       return rsProfessor
    } catch (error) {
       return false
   }
}
const dadosUsuario = [
    { id_alternativa: 1, id_usuario_teste: 1 },
    { id_alternativa: 2, id_usuario_teste: 1 },
    { id_alternativa: 3, id_usuario_teste: 1 }
];




const insertResultadoUsuario = async function (id) {
 
    let sql 
    try{

        sql =  `call inserir_resultado_usuario(${id});`

       let rsUser = await prisma.$executeRawUnsafe(sql)

       if(rsUser)
        return rsUser
        else
        return false
       
    
    }catch(error){
        return false 
    }

    
}



const selectVerificarEmail = async function (email){
    try{
     let sql = `select ta.email from tbl_usuario_teste as ta where email = '${email}';`

     let rsAluno = await prisma.$queryRawUnsafe(sql)


     if(rsAluno){
        return rsAluno
     }else{
        return false 
     }
    }catch(error){
        return false
    }
    
}







module.exports = {
    insertUsuarioQuiz,
    selectUltimoIdUserQuiz,
    insertRespostaUsuario,
    selectUltimoIdRespostaQuiz,
    insertResultadoUsuario,
    selectVerificarEmail
}

