const pool = require("../database/db");

async function deleteUsuarioByCpf(cpf){
    const usuario = await pool.query(
        `SELECT id_usuario FROM usuarios WHERE cpf=$1`,
        [cpf]
    );

    const idUsuario = usuario.rows[0].id_usuario;

    const exame = await pool.query(
        `SELECT id_exame FROM exames WHERE id_usuario=$1`,
        [idUsuario]
    );

    const idExame = exame.rows[0].id_exame;

    await pool.query(
        `DELETE FROM respostas
        WHERE id_exame = $1`,
        [idExame]
    );

    await pool.query(
        `DELETE FROM exames
        WHERE id_usuario = $1`,
        [idUsuario]
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
