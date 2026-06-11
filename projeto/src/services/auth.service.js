const {
  findUsuarioByCpfAndSenha,
} = require("../repositories/usuarios.repository");

const { createToken } = require("../utils/jwt");

async function loginService(cpf, senha) {
  const usuario = await findUsuarioByCpfAndSenha(cpf, senha);
  const token = createToken({ id_usuario: usuario.id_usuario });
  return {
      token,
      nome: usuario.nome,
    }
}

module.exports = {
  loginService,
};
