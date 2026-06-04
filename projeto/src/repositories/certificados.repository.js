const pool = require("../database/db");

// Na função findUsuarioByCertificadoHash, adicionei o campo 'email' que antes não tinha.
async function findUsuarioByCertificadoHash(certificadoHash) {
  const result = await pool.query(
    ` 
    SELECT 
    id_usuario, 
    nome, 
    email, 
    cpf, 
    certificado_hash 
    FROM usuarios 
    WHERE certificado_hash = $1 
    LIMIT 1 
    `,
    [certificadoHash],
  );

  return result.rows[0] || null;
}

async function findModulos() {
  const result = await pool.query(` 
    SELECT 
    id_modulo, 
    titulo 
    FROM modulos m 
    ORDER BY 
    id_modulo ASC 
  `);

  return result.rows;
}


module.exports = {
  findUsuarioByCertificadoHash,
  findModulos
  };
