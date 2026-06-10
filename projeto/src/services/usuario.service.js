 const { 
  createUsuario,  
  findUsuarioById,
  updateUsuario,
  pegarFotoPerfil,
  mudarFotoPerfil,
} = require("../repositories/usuarios.repository");

async function cadastrarUsuario(nome, email, cpf, senha) {
    return createUsuario(nome, email, cpf, senha);
}

async function alterarUsuario(idUsuario, dados) {
  const usuarioAtualizado = await updateUsuario(idUsuario, dados);

  if (!usuarioAtualizado) return null;

  return findUsuarioById(idUsuario);
}

async function buscarUsuario(idUsuario, senha) {
    const result = await findUsuarioById(idUsuario);
    if(!result) return null;
    return result;
}

async function pegarFoto(idUsuario){
    const foto = await pegarFotoPerfil(idUsuario);
    if(!foto) return null;
    return foto;
}

async function mudarFoto(idUsuario, imagem){
    const result = await mudarFotoPerfil(idUsuario, imagem);
    if(!result) return null;
    return result;
}

module.exports = {
    cadastrarUsuario,
    alterarUsuario,
    buscarUsuario,
    pegarFoto,
    mudarFoto,
};