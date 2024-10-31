create database db_sinalibras;
use db_sinalibras;

CREATE TABLE `tbl_usuario_teste` (
  `id_usuario_teste` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `data_cadastro` DATE NOT NULL)
ENGINE = InnoDB;
select * from tbl_usuario_teste;

select tu.id_usuario_teste, tu.email, tu.data_cadastro from tbl_usuario_teste as tu where email = 'ju@julia';


CREATE TABLE `tbl_perguntas` (
  `id_pergunta` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `pergunta` VARCHAR(250) NOT NULL,
  `video` VARCHAR(255) NOT NULL)
ENGINE = InnoDB;
select * from tbl_perguntas;


CREATE TABLE `tbl_alternativas` (
  `id_alternativa` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `alternativa` VARCHAR(255) NOT NULL,
  `status` TINYINT NOT NULL,
  `id_pergunta` INT NOT NULL,
  CONSTRAINT `fk_tbl_alternativas_tbl_perguntas`
    FOREIGN KEY (`id_pergunta`) REFERENCES `tbl_perguntas` (`id_pergunta`))
ENGINE = InnoDB;
select * from tbl_alternativas;


CREATE TABLE `tbl_resposta_usuario` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `id_alternativa` INT NOT NULL,
  `id_usuario_teste` INT NOT NULL,
  CONSTRAINT `fk_tbl_resposta_usuario_tbl_alternativas`
    FOREIGN KEY (`id_alternativa`) REFERENCES `tbl_alternativas` (`id_alternativa`),
  CONSTRAINT `fk_tbl_resposta_usuario_tbl_usuario_teste`
    FOREIGN KEY (`id_usuario_teste`) REFERENCES `tbl_usuario_teste` (`id_usuario_teste`))
ENGINE = InnoDB;
select * from tbl_resposta_usuario;


CREATE TABLE `tbl_resultado` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `pontuacao` INT NOT NULL,
  `id_usuario_teste` INT NOT NULL,
  CONSTRAINT `fk_tbl_resultado_tbl_resposta_usuario`
 FOREIGN KEY (`id_usuario_teste`) REFERENCES `tbl_resposta_usuario` (`id`))
ENGINE = InnoDB;
select * from tbl_resultado;






CREATE TABLE `tbl_professor` (
  `id_professor` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `nome` VARCHAR(250) NOT NULL,
  `data_cadastro` DATE NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `senha` varchar (255) not null,
  `data_nascimento` DATE NOT NULL,
  `foto_perfil` VARCHAR(255) NULL)
ENGINE = InnoDB;
select * from tbl_professor;



CREATE TABLE `tbl_aluno` (
  `id_aluno` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `nome` VARCHAR(250) NOT NULL,
  `data_cadastro` DATE NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `senha`varchar(255) not null,
  `data_nascimento` DATE NOT NULL,
  `foto_perfil` VARCHAR(255) NULL)
ENGINE = InnoDB;
select * from tbl_aluno;





select * from tbl_perguntas;
select * from tbl_alternativas;



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




-- procedure de calcular pontuação --

DELIMITER $$
CREATE PROCEDURE `inserir_resultado_usuario` (IN p_id_usuario_teste INT)
BEGIN
    DECLARE pontuacao INT;

    -- Calcula a pontuação para o id_usuario_teste específico
    SELECT SUM(CASE WHEN a.status = 1 THEN 1 ELSE 0 END) INTO pontuacao
    FROM tbl_resposta_usuario AS r
    INNER JOIN tbl_alternativas AS a ON r.id_alternativa = a.id_alternativa
    WHERE r.id_usuario_teste = p_id_usuario_teste;

    -- Insere ou atualiza o resultado na tabela tbl_resultado
    INSERT INTO tbl_resultado (id_usuario_teste, pontuacao)
    VALUES (p_id_usuario_teste, pontuacao)
    ON DUPLICATE KEY UPDATE pontuacao = VALUES(pontuacao);
END $$

DELIMITER ;








SELECT pontuacao FROM tbl_resultado where id_usuario_teste = 3 ;

SELECT * FROM tbl_resposta_usuario;


create view pergunta_alternativas as
select p.id_pergunta, p.pergunta, p.video, a.id_alternativa, a.alternativa, a.status
from tbl_alternativas as a
inner join tbl_perguntas as p
on a.id_pergunta = p.id_pergunta;

select * from pergunta_alternativas;

create view respostas_do_usuario as
select r.id_usuario_teste, u.email, a.id_alternativa, p.id_pergunta, a.status
from tbl_resposta_usuario as r
inner join tbl_alternativas as a
on r.id_alternativa = a.id_alternativa
inner join tbl_perguntas as p
on a.id_pergunta = p.id_pergunta
inner join tbl_usuario_teste as u
on u.id_usuario_teste = r.id_usuario_teste;



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
 
 select id_aluno, nome, email, data_nascimento, foto_perfil  from tbl_aluno where id_aluno = 1;
 
 -- tabela de postagens --
 
 CREATE TABLE `tbl_post` (
  `id_post` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `texto` VARCHAR(250) NOT NULL,
  `foto_postagem` VARCHAR(255) NULL,
  `id_professor` INT NOT NULL,
  CONSTRAINT `fk_tbl_post_tbl_professor`
    FOREIGN KEY (`id_professor`) REFERENCES `tbl_professor` (`id_professor`))
ENGINE = InnoDB;

-- tabela de modulo --

CREATE TABLE `tbl_modulo` (
  `id_modulo` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `modulo` VARCHAR(50) NOT NULL)
ENGINE = InnoDB;


-- tabela de nível --

CREATE TABLE `tbl_nivel` (
  `id_nivel` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `nivel` VARCHAR(20) NOT NULL)
ENGINE = InnoDB;
insert into tbL_nivel(nivel) values
('basico');

-- tabela de videoaula --

CREATE TABLE `tbl_videoaula` (
  `id_videoaula` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `titulo` VARCHAR(50) NOT NULL,
  `descricao` VARCHAR(255) NULL,
  `duracao` TIME NOT NULL,
  `foto_capa` VARCHAR(255) NOT NULL,
  `data` DATE NOT NULL,
    `url_video` VARCHAR(255) NOT NULL,
  `id_nivel` INT NOT NULL,
  `id_modulo` INT NOT NULL,
  `id_professor` INT NOT NULL,
  CONSTRAINT `fk_tbl_videoaula_tbl_nivel`
    FOREIGN KEY (`id_nivel`) REFERENCES `tbl_nivel` (`id_nivel`),
  CONSTRAINT `fk_tbl_videoaula_tbl_modulo1`
    FOREIGN KEY (`id_modulo`) REFERENCES `tbl_modulo` (`id_modulo`),
  CONSTRAINT `fk_tbl_videoaula_tbl_professor1`
    FOREIGN KEY (`id_professor`) REFERENCES `tbl_professor` (`id_professor`))
ENGINE = InnoDB;


select * from tbl_professor;

select * from tbl_videoaula where id_professor = 2;

-- tabela comentarios da videoaula --





CREATE TABLE `tbl_comentario_aula` (
  `id_comentario` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `data` DATE NOT NULL,
  `comentario` VARCHAR(250) NOT NULL,
  `id_videoaula` INT NOT NULL,
  `id_aluno` INT NOT NULL,
  CONSTRAINT `fk_tbl_comentarios_tbl_aluno1`
    FOREIGN KEY (`id_aluno`) REFERENCES`tbl_aluno` (`id_aluno`),
    CONSTRAINT fk_tbl_comentarios_tbl_videoaula FOREIGN KEY (id_videoaula) 
    REFERENCES tbl_videoaula(id_videoaula) ON DELETE CASCADE
    )
ENGINE = InnoDB;




-- tabela de videoaula salva --
 
 CREATE TABLE IF NOT EXISTS `tbl_video_salvo` (
  `id` INT NOT NULL PRIMARY KEY auto_increment,
  `id_videoaula` INT NOT NULL,
  `id_aluno` INT NOT NULL,
  CONSTRAINT `fk_tbl_video_salvo_tbl_videoaula`
    FOREIGN KEY (`id_videoaula`) REFERENCES `tbl_videoaula` (`id_videoaula`),
  CONSTRAINT `fk_tbl_video_salvo_tbl_aluno`
    FOREIGN KEY (`id_aluno`) REFERENCES `tbl_aluno` (`id_aluno`))
ENGINE = InnoDB;


-- tabela comentário post --


CREATE TABLE `tbl_comentario_post` (
  `id_comentario` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `comentario` VARCHAR(255) NOT NULL,
  `data` TIME NOT NULL,
  `id_post` INT NOT NULL,
  `id_aluno` INT NOT NULL,
  CONSTRAINT `fk_tbl_comentario_post_tbl_post`
    FOREIGN KEY (`id_post`) REFERENCES `tbl_post` (`id_post`),
  CONSTRAINT `fk_tbl_comentario_post_tbl_alunO`
    FOREIGN KEY (`id_aluno`) REFERENCES `tbl_aluno` (`id_aluno`))
ENGINE = InnoDB;
insert into tbl_nivel(nivel) values('basico'),('medio');
insert into tbl_modulo(modulo) values('saudacao'),('comida');
insert into tbl_videoaula(titulo,descricao,duracao,foto_capa,`data`,url_video,id_nivel,id_modulo,id_professor) values
("teste", "aaaaaaaaaaaaa","00:12:50","essa ft", "2023-04-02","https://youtu.be/MZaPbc--ERw?si=i1WJEU1hjdDw6JtV",1,2,1);

show tables ;

select tu.id_usuario_teste, tu.email, tu.data_cadastro, r.pontuacao from tbl_usuario_teste as tu join tbl_resultado as r on r.id_usuario_teste=tu.id_usuario_teste where email = 'cria';