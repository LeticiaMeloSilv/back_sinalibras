create database sinalibras_db;
use sinalibras_db;

CREATE TABLE tbl_usuario (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(250) NOT NULL,
  senha VARCHAR(8) NOT NULL,
  data_nascimento DATE NOT NULL,
  status_usuario varchar(255) not null,
  foto_perfil varchar (255), 
  unique key (id),
  unique index(id)
  );
  

  
  select * from tbl_usuario ;
  