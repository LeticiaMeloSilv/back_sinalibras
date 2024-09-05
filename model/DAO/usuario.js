const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const selectAllUsers = async function (){
    
    let sql = 'select * from tbl_usuario'

    let rsUsuario = await prisma.$queryRawUnsafe(sql);
    
    if( rsUsuario.length > 0) {
    return rsUsuario;
}else
       return false;
}

const selectByIdUsuario = async function (id){
    try{
        let sql = `select * from tbl_usuario where id = ${id}`

        let rsUsuario = await prisma.$queryRawUnsafe(sql)

        return rsUsuario
       

    } catch (error){
        return false
    }

}


const insertUsuario = async function(dadosUsuario){
   
    let sql 

    try{
       
    sql = `insert into tbl_usuario ( 
                            nome, 
                            email,
                            senha,
                            data_nascimento,
                            status_usuario,
                            foto_perfil
                            ) values (
                                '${dadosUsuario.nome}',
                                '${dadosUsuario.email}',
                                '${dadosUsuario.senha}',
                                '${dadosUsuario.data_nascimento}',
                                '${dadosUsuario.status_usuario}',
                                '${dadosUsuario.foto_perfil}'
                            )`
       

        


        let rsUsuario = await prisma.$executeRawUnsafe(sql)

        if(rsUsuario){
            return true
        }else
            return false

    } catch(error) {
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

   const updateUsuario = async function (id, dadosUsuario) {

    try{
        let sql 
    
        sql = `update tbl_usuario set
            nome =  '${dadosUsuario.nome}',
            email =  '${dadosUsuario.email}',
            senha =  '${dadosUsuario.senha}',
            data_nascimento =  '${dadosUsuario.data_nascimento}',
            status_usuario =  '${dadosUsuario.status_usuario}',
            foto_perfil = '${dadosUsuario.foto_perfil}'
            where tbl_usuario.id = ${id}
       `
       
    
        let rsUser = await prisma.$executeRawUnsafe(sql)
    
    
         if (rsUser)
         return true
         else
         return false 
    }catch(error){
        return false
    }

}

const deleteUsuario = async function (id){

    try {
   
       let sql = `delete from tbl_usuario  where id = ${id}`
   
       let rsUsuario = await prisma.$executeRawUnsafe(sql);  
      
       if(rsUsuario)
       return true
      
     } catch (error) {
        
       return false
       }
   
}

const selectUsuarioByNome = async function (nome){
    try{
        let sql = `select * from tbl_usuario where nome LIKE "%${nome}%"`
       

        let rsUsuario = await prisma.$queryRawUnsafe(sql);
        return rsUsuario;
    } catch (error) {
        return false
    }
}


const selectUsuarioByEmail = async function (email){
    try{
        let sql = `select * from tbl_usuario where email LIKE "%${email}%"`

        let rsUsuario = await prisma.$queryRawUnsafe(sql)

        if(rsUsuario)
        return true
    }catch(error){
        return false
    }
}


module.exports = {
    selectAllUsers,
    selectByIdUsuario,
    selectUsuarioByEmail,
    selectUsuarioByNome,
    insertUsuario,
    selectUltimoIdUsuario,
    updateUsuario,
    deleteUsuario
}