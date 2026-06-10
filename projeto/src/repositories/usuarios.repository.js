const pool = require("../database/db");
const { randomBytes, hash } = require("crypto");
const { hashPassword, verifyPassword } = require("../utils/password");

async function insertUsuario(client, nome, email, cpf, senha){
    const certificadoHash = randomBytes(24).toString("hex");
    const senhaCodificada = hashPassword(senha);

    const result = await client.query(
        `INSERT INTO usuarios (nome, email, cpf, senha, certificado_hash)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_usuario, nome, email, cpf, certificado_hash`,
            [nome, email, cpf, senhaCodificada, certificadoHash]
    );
    if(result && result.rowCount == 1){
        return result.rows[0];
    }
    return result.rows[0] || null;
}

async function findPrimeiroModuloId(client){
    const result = await client.query(`SELECT id_modulo FROM modulos ORDER BY id_modulo LIMIT 1`);
    return result.rows[0] || null;
}

async function findGrupoAleatorio(client, idModulo){
    const result = await client.query(
        `SELECT grupo FROM questoes WHERE id_modulo=$1 AND grupo IS NOT NULL GROUP BY grupo ORDER BY RANDOM() LIMIT 1`,
        [idModulo]
    );  
    return result.rows[0] || null;
}

async function insertExame(client, idModulo, idUsuario, grupo, tentativa){
    const result = await client.query(
        `INSERT INTO exames (id_modulo, id_usuario, grupo, tentativa)
            VALUES ($1, $2, $3, $4)
            RETURNING id_exame`,
        [idModulo, idUsuario, grupo, tentativa]
    );
}

async function createUsuario(nome, email, cpf, senha){
    const client = await pool.connect();
    try{
        await client.query("BEGIN");
        
        const usuario = await insertUsuario(client, nome, email, cpf, senha);

        const modulo = await findPrimeiroModuloId(client);
        if(!modulo){
            throw new Error("Nenhum módulo cadastrado para inicializar exame do usuário");
        }

        const grupo = await findGrupoAleatorio(client, modulo.id_modulo);
        if(!grupo){
            throw new Error("Nenhum grupo cadastrado para inicializar exame do usuário");
        }

        await insertExame(client, modulo.id_modulo, usuario.id_usuario, grupo.grupo, 1);

        await client.query("COMMIT");
        return {id_usuario: usuario.id, nome: usuario.nome, email: usuario.email, cpf: usuario.cpf};
    } catch(e){
        await client.query("ROLLBACK");
        throw e;
        return {error: "Problemas ao criar o usuário"};
    } finally {
        client.release();
    }
}



async function findUsuarioById(idUsuario){
    const result = await pool.query(
        `SELECT id_usuario, nome, email, cpf, certificado_hash
        FROM usuarios
        WHERE id_usuario = $1`,
        [idUsuario]
    );
    return result.rows[0] || null;
}

 async function findIdExameByIdUsuario(idUsuario){
     const result = await pool.query(`
            SELECT id_exame
            FROM exames
            WHERE id_usuario = $1`,
         [idUsuario]
     );
     return result.rows[0] || null;
 }

async function findUsuarioByCpfAndSenha(cpf, senha){
    const result = await pool.query(`
        SELECT id_usuario, nome, email, cpf, senha
        FROM usuarios
        WHERE cpf = $1`,
        [cpf]
    );

    const usuario = result.rows[0];

    if(!usuario){
        throw new Error("Usuário inexistente");
    }

    const senhaValida = verifyPassword(senha, usuario.senha);
    if(!senhaValida){
        throw new Error("Senha incorreta");
    }

    return {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        cpf: usuario.cpf
    }
}

async function updateUsuario(idUsuario, dados) {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (dados.nome) {
    fields.push(`nome = $${paramIndex}`);
    values.push(dados.nome);
    paramIndex++;
  }

  if (dados.email) {
    fields.push(`email = $${paramIndex}`);
    values.push(dados.email);
    paramIndex++;
  }

  if (dados.cpf) {
    fields.push(`cpf = $${paramIndex}`);
    values.push(dados.cpf);
    paramIndex++;
  }

  if (dados.senha) {
    fields.push(`senha = $${paramIndex}`);
    values.push(hashPassword(dados.senha));
    paramIndex++;
  }

  if (!fields.length) {
    return null;
  }

  values.push(idUsuario);

  /*
  Explicando $${paramIndex}:
  O primeiro $ é do JavaScript, para interpolar variável dentro da template string.
  O segundo faz parte da sintaxe do PostgreSQL para parâmetros preparados: $1, $2, ...
  */

  const result = await pool.query(
    `
    UPDATE usuarios
    SET ${fields.join(", ")}
    WHERE id_usuario = $${paramIndex}
    RETURNING id_usuario
    `,
    values,
  );

  return result.rows[0] || null;
}

async function deleteProgressByUsuario(idExame){
    const result = await pool.query(`
        DELETE 
        FROM respostas 
        WHERE id_exame = $1`,
        [idExame.id_exame]
    );

    const exameAtualizou = updateExameModulo(idExame)

    return true;
}

async function updateExameModulo(idExame){
    const result = await pool.query(`
    UPDATE exames
    SET id_modulo = 1
    WHERE id_exame = $1;
    `,
    [idExame.id_exame]
  );

  return true;
}

module.exports = {
    deleteProgressByUsuario,
    createUsuario,
    findUsuarioByCpfAndSenha,
    findUsuarioById,
    findIdExameByIdUsuario,
    updateUsuario
};
