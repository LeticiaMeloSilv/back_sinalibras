create database db_sinalibras;
use db_sinalibras;




CREATE TABLE `tbl_usuario_teste` (
  `id_usuario_teste` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `data` DATE NOT NULL)	
ENGINE = InnoDB;


CREATE TABLE `tbl_perguntas` (
  `id_pergunta` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `pergunta` VARCHAR(250) NOT NULL,
  `video` VARCHAR(255) NOT NULL)
ENGINE = InnoDB;

CREATE TABLE `tbl_alternativas` (
  `id_alternativa` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `alternativa` VARCHAR(255) NOT NULL,
  `status` TINYINT NOT NULL,
  `id_pergunta` INT NOT NULL,
  CONSTRAINT `fk_tbl_alternativas_tbl_perguntas`
    FOREIGN KEY (`id_pergunta`) REFERENCES `tbl_perguntas` (`id_pergunta`))
ENGINE = InnoDB;

CREATE TABLE `tbl_resposta_usuario` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `id_alternativa` INT NOT NULL,
  `id_usuario_teste` INT NOT NULL,
  CONSTRAINT `fk_tbl_resposta_usuario_tbl_alternativas`
    FOREIGN KEY (`id_alternativa`) REFERENCES `tbl_alternativas` (`id_alternativa`),
  CONSTRAINT `fk_tbl_resposta_usuario_tbl_usuario_teste`
    FOREIGN KEY (`id_usuario_teste`) REFERENCES `tbl_usuario_teste` (`id_usuario_teste`))
ENGINE = InnoDB;



CREATE TABLE `tbl_resultado` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `pontuacao` INT NOT NULL,
  `id_usuario_teste` INT NOT NULL,
  CONSTRAINT `fk_tbl_resultado_tbl_resposta_usuario`
    FOREIGN KEY (`id_usuario_teste`) REFERENCES `tbl_resposta_usuario` (`id`))
ENGINE = InnoDB;



CREATE TABLE `tbl_professor` (
  `id_professor` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `nome` VARCHAR(250) NOT NULL,
  `data_cadastro` DATE NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `senha` varchar (255) not null,
  `data_nascimento` DATE NOT NULL,
  `foto_perfil` VARCHAR(255) NULL)
ENGINE = InnoDB;

alter table tbl_professor
	modify column senha varchar (255) not null;

CREATE TABLE `tbl_aluno` (
  `id_aluno` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `nome` VARCHAR(250) NOT NULL,
  `data_cadastro` DATE NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `senha`varchar(255) not null,
  `data_nascimento` DATE NOT NULL,
  `foto_perfil` VARCHAR(255) NULL)
ENGINE = InnoDB;





select * from tbl_perguntas;
select * from tbl_alternativas;

/*
DELIMITER //

CREATE PROCEDURE inserir_questao_com_alternativas (
    IN p_pergunta VARCHAR(250),
    IN p_video VARCHAR(255),
    IN p_alternativa VARCHAR(100),
    IN p_status VARCHAR(30)
)
BEGIN
    DECLARE v_id_pergunta INT;

 
    INSERT INTO tbl_perguntas (pergunta, video)
    VALUES (p_pergunta, p_video);

   
    SET v_id_pergunta = LAST_INSERT_ID();

  
    INSERT INTO tbl_alternativas (alternativa, status, id_pergunta)
    VALUES (p_alternativa, p_status, v_id_pergunta);
END//

CALL inserir_questao_com_alternativas ( 'qual seu nome?', ' xxxxxxxxxxxx', 'joao', 1 );
*/



DELIMITER //

CREATE PROCEDURE inserir_questao_com_alternativas (
    IN p_pergunta VARCHAR(250),
    IN p_video VARCHAR(255),
    IN p_alternativas varchar(100)
)
BEGIN
    DECLARE v_id_pergunta INT;
    DECLARE v_alternativa varchar(100);
    DECLARE v_status VARCHAR(30);
    DECLARE v_pos INT;
    DECLARE v_end INT;
    DECLARE v_delimiter CHAR(1);


    SET v_delimiter = ';';

   
    INSERT INTO tbl_perguntas (pergunta, video)
    VALUES (p_pergunta, p_video);
    SET v_id_pergunta = LAST_INSERT_ID();


    SET v_pos = 1;


    WHILE CHAR_LENGTH(p_alternativas) > 0 DO
 
        SET v_end = LOCATE(v_delimiter, p_alternativas);
        IF v_end = 0 THEN
            SET v_end = CHAR_LENGTH(p_alternativas) + 1;
        END IF;

   
        SET v_alternativa = SUBSTRING_INDEX(p_alternativas, v_delimiter, 1);
        SET v_status = SUBSTRING_INDEX(v_alternativa, ',', -1);
        SET v_alternativa = SUBSTRING_INDEX(v_alternativa, ',', 1);

        INSERT INTO tbl_alternativas (alternativa, status, id_pergunta)
        VALUES (v_alternativa, v_status, v_id_pergunta);

     
        SET p_alternativas = SUBSTRING(p_alternativas, v_end + 1);
    END WHILE;
END//


CALL inserir_questao_com_alternativas(
    'Qual é a capital da França?', 
    'video1.mp4', 
    'Paris,1;Londres,0;Berlim,0'
);

DELIMITER $$
CREATE PROCEDURE `inserir_resultado_usuario` (IN p_id_usuario_teste INT)
BEGIN
    DECLARE pontuacao INT;

    -- Calcula a pontuação
    SELECT COUNT(*) INTO pontuacao
    FROM tbl_resposta_usuario AS r
    INNER JOIN tbl_alternativas AS a ON r.id_alternativa = a.id_alternativa
    WHERE r.id_usuario_teste = p_id_usuario_teste
      AND a.status = 1;

    -- Insere o resultado e o usuário na tabela
    INSERT INTO tbl_resultado (id_usuario_teste, pontuacao)
    VALUES (p_id_usuario_teste, pontuacao)
    ON DUPLICATE KEY UPDATE pontuacao = GREATEST(pontuacao, VALUES(pontuacao));
END $$
DELIMITER ;

call inserir_resultado_usuario(11);
SELECT * FROM tbl_resposta_usuario ;


create view pergunta_alternativas as
select p.id_pergunta, p.pergunta, p.video, a.alternativa, a.status
from tbl_alternativas as a
inner join tbl_perguntas as p
on a.id_pergunta = p.id_pergunta;


SELECT * FROM tbl_resposta_usuario WHERE id_usuario_teste = 2;
select * from tbl_resposta_usuario;


                                
                                
                                insert into tbl_aluno ( 
                                nome, 
                                data_cadastro,
                                email,
                                senha,
                                data_nascimento,
                                foto_perfil
                                ) values (
                                    'ju',
                                    '2000-6-8',
                                    'ju@ju',
                                    MD5('12345678'),
                                    '2000-09-12',
                                     null
                                );

select * from tbl_aluno;
select ta.id_aluno, ta.nome, ta.email from tbl_aluno as ta where email = 'mu@mu' and senha = md5('1234566');

select ta.id_aluno, ta.nome, ta.email from tbl_aluno as ta
 where email = 'mu@mu' and senha = md5('1234567');
 
 select id_aluno, nome, email, data_nascimento, foto_perfil  from tbl_aluno where id_aluno = 1
 
 
 
