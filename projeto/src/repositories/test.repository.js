const pool = require("../database/db");

async function deleteUsuarioByCpf(cpf){
    const usuario = await pool.query(
        `SELECT id_usuario FROM usuarios WHERE cpf=$1`,
        [cpf]
    );

    const id = usuario.rows[0].id_usuario;

    await pool.query(
        `DELETE FROM exames
        WHERE id_usuario = $1`,
        [id]
    );

    const result = await pool.query(
        `DELETE FROM usuarios
        WHERE cpf = $1`,
        [cpf]
    );

    return true;
}

module.exports = {
    deleteUsuarioByCpf
};
