const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const selectAllUsers = async function (){
    let sql = 'select * from tbl_usuario';

    //Executa o script SQL no Banco de Dados e recebe o retorno dos dados
    let rsUsuario = await prisma.$queryRawUnsafe(sql);

    //Validação para retornar os dados
    if( rsUsuario.length > 0) 
       return rsUsuario;
    else
       return false;

}


const insertUsuario = async function(dadosUsuario){
   
    let sql 

    try{
       
    sql = `insert into tbl_usuario ( 
                            nome, 
                            email,
                            senha,
                            data_nascimento
                            ) values (
                                '${dadosUsuario.nome}',
                                '${dadosUsuario.email}',
                                '${dadosUsuario.senha}',
                                '${dadosUsuario.data_nascimento}'
                            )`
       

        


        let rsUsuario = await prisma.$executeRawUnsafe(sql)

        if(rsUsuario){
            return true
        }else
            return false

    } catch(error) {
        console.log(error);
        return false
    }
}



    const selectUltimoIdUsuario = async function (){
        try{
           let sql = `select cast(last_insert_id()as DECIMAL) as id from tbl_usuario limit 1;`
   
           let rsUsuario = await prisma.$queryRawUnsafe(sql);
           return rsUsuario
   
           
        } catch (error) {
           return false
       }
   }



module.exports = {
    selectAllUsers,
    insertUsuario,
    selectUltimoIdUsuario
}