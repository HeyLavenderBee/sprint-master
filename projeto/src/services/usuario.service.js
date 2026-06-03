 const { 
  createUsuario,  
  findUsuarioById,
  updateUsuario
} = require("../repositories/usuarios.repository");

async function cadastrarUsuario(nome, email, cpf, senha) {
    return createUsuario(nome, email, cpf, senha);
}

async function alterarUsuario(idUsuario, dados) {
  const usuarioAtualizado = await updateUsuario(idUsuario, dados);

  if (!usuarioAtualizado) {
    return null;
  }

  return findUsuarioById(idUsuario);
}

module.exports = {
    cadastrarUsuario,
    alterarUsuario
};