const pool = require("../database/db");
const {randomBytes} = require("crypto");

/*
Para fazer o teste de insert com o POST, cole isso no terminal:
curl -X POST http://localhost:3000/api \
    -H "Content-Type: application/json" \
    -d '{"nome": "Ana", "email": "ana@email.com", "cpf": "12345678901", "senha": "123", "grupo": 1}'
*/

async function insertUsuario(client, nome, email, cpf, senha){
    const certificado_hash = randomBytes(24).toString("hex");
        try{
    const result = await pool.query(
        `INSERT INTO usuarios (nome, email, cpf, senha, certificado_hash)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id_usuario, nome, email, cpf, certificado_hash`,
                [nome, email, cpf, senha, certificado_hash]
    );
    if(result && result.rowCount == 1){
        return result.rows[0];
    }
    return null;
}catch(e){
    return null;
};
}



async function findPrimeiroModuloId(client){
    const result = await client.query(`SELECT id_modulo FROM modules ORDER BY id_modulo LIMIT 1`);
    if( result && result.rows.length == 1 ){
        return result.rows[0];
    };
    return null;
}

async function findGrupoAleatorio(client, idModulo){
    const result = await client.query(
        `SELECT grupo
        FROM questoes
        WHERE id_modulo=$1 AND grupo IS NOT null
        GROUP BY grupo
        ORDER BY RANDOM()
        LIMIT 1`,
        [idModulo],
    );
    if (result && result.rows.length == 1) {
        return result.rows[0];
    }
    return null
}

async function insertExame(client, idModulo, idUsuario, grupo, tentativa){
        try{
    const result = await pool.query(
        `INSERT INTO exames (id_modulo, id_usuario, grupo, tentativa)
                VALUES ($1, $2, $3, $4)
                RETURNING id_exame`,
    [idModulo, idUsuario, grupo, tentativa]
    );
    if(result && result.rowCount == 1){
        return result.rows[0];
    }
    return null;
 }catch(e){
    return null;
};

}

async function createUsuario(nome, email, cpf, senha){
    const client = await pool.connect();
    await client.query("BEGIN");

    const usuario = await insertUsuario(client, nome, email, cpf, senha)
    if(!usuario){
        client.query("ROLLBACK");
        return {error: "Problemas ao criar o usuário"};
    };
    const modulo = await findPrimeiroModuloId(client);
    if (!modulo){
        client.query("ROLLBACK");
        return {error: "Problemas ao obter o primeiro módulo"};
    };

    const grupo = await findGrupoAleatorio(client, modulo.id_modulo)
    if( !grupo ){
        client.query("ROLLBACK");
        return {error: "Problemas ao obter o grupo de questionario"};
    };

    const exame = await insertExame(
        client, 
        modulo.id_modulo, 
        usuario.id_usuario, 
        grupo.grupo, 
        1,
    );
    
    if (!exame){
        client.query("ROLLBACK");
        return {error: "Problemas ao criar o questionario"};
    }

    await client.query("COMMIT");
    client.release();

    return {message:"Usuário criado com sucesso"};
};

module.exports = {
    createUsuario
}
