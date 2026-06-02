const { findUsuarioById } = require("../repositories/usuarios.repository");
const {
  cadastrarUsuario,
  alterarCpf,
  alterarNome,
  alterarEmail,
  alterarSenha,
} = require("../services/usuario.service");

async function createUsuarioController(req, res) {
  const { nome, email, cpf, senha } = req.body;

  //caso não seja enviado um desses campos, mostra uma mensagem com status de erro
  //isso evita que o backend receba mensagens erradas
  if (!cpf || !nome || !senha) {
    return res
      .status(400)
      .json({ message: "Nome, e-mail e senha são obrigatórios" });
  }

  if (senha.trim().length < 6) {
    return res
      .status(400)
      .json({ message: "A senha deve ter pelo menos 6 caracteres" });
  }

  try {
    const result = await cadastrarUsuario(nome, email, cpf, senha);
    res.send(result);
  } catch (e) {
    console.log(e.message); //<- quando houver um erro interno, esse print ajuda a decifrar qual
    if (e && e.code == "23505") {
      return res.status(409).json({
        message: "Já existe usuário com os dados informados",
      });
    }
    return res.status(400).json({
      message: "Erro interno no servidor",
    });
  }
}

async function updateCpfController(req, res) {
  const idUsuario = req.usuario.id_usuario;

  if (!idUsuario) {
    return res.status(400).json({ message: "id_usuario inválido" });
  }

  const { cpf } = req.body;
  if (!cpf) {
    return res.status(400).json({ message: "CPF inválido" });
  }
  try {
    const usuario = await alterarCpf(idUsuario, cpf);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json(usuario);
  } catch (e) {
    if (e && e.code == "23505") {
      return res.status(404).json({
        message: "Já existe usuário com o CPF informado",
      });
    }
    return res.status(404).json({
      message: "Erro interno do servidor",
    });
  }
}

async function updateNomeController(req, res) {
  const idUsuario = req.usuario.id_usuario;

  if (!idUsuario) {
    return res.status(400).json({ message: "id_usuario inválido" });
  }

  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ message: "Nome obrigatório" });
  }
  try {
    const usuario = await updateUsuarioNome(idUsuario, nome);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    return res.status(200).json(usuario);
  } catch (e) {
    return res.status(404).json({
      message: "Erro interno do servidor",
    });
  }
}

async function updateEmailController(req, res) {
  const idUsuario = req.usuario.id_usuario;

  if (!idUsuario) {
    return res.status(400).json({ message: "id_usuario inválido" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email obrigatório" });
  }
  try {
    const usuario = await alterarEmail(idUsuario, email);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    return res.status(200).json(usuario);
  } catch (e) {
    if (e && e.code == "23505") {
      return res.status(404).json({
        message: "Já existe usuário com o email informado",
      });
    }
    return res.status(404).json({
      message: "Erro interno do servidor",
    });
  }
}

async function updateSenhaController(req, res) {
  const idUsuario = req.usuario.id_usuario;

  if (!idUsuario) {
    return res.status(400).json({ message: "id_usuario inválido" });
  }

  const { senha } = req.body;
  if (!senha) {
    return res.status(400).json({ message: "Senha obrigatória" });
  }

  if (senha.trim().length < 6) {
    return res
      .status(400)
      .json({ message: "A senha deve ter pelo menos 6 caracteres" });
  }

  try {
    const usuario = await alterarSenha(idUsuario, senha);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    return res.status(200).json(usuario);
  } catch (e) {
    return res.status(404).json({
      message: "Erro interno do servidor",
    });
  }
}
async function getUsuarioController(req, res) {
  try {
    const usuario = req.usuario;
    return res.status(200).json(usuario);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: "Erro interno no servidor" });
  }
}


module.exports = {
  createUsuarioController,
  updateCpfController,
  updateNomeController,
  updateEmailController,
  updateSenhaController,
  getUsuarioController,
};
