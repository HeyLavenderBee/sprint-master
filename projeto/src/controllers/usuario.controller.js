const {
  deleteProgressByUsuario,
  findUsuarioById,
  findIdExameByIdUsuario,
} = require("../repositories/usuarios.repository");
const {
  cadastrarUsuario,
  alterarUsuario,
} = require("../services/usuario.service");

async function createUsuarioController(req, res) {
  const { nome, email, cpf, senha } = req.body;

  //caso não seja enviado um desses campos, mostra uma mensagem com status de erro
  //isso evita que o backend receba mensagens erradas
  if (!cpf || !nome || !senha || !email) {
    return res
      .status(400)
      .json({ message: "Nome, CPF, e-mail e senha são obrigatórios" });
  }

  if (senha.trim().length < 6) {
    return res
      .status(400)
      .json({ message: "A senha deve ter pelo menos 6 caracteres" });
  }

  try {
    const result = await cadastrarUsuario(nome, email, cpf, senha);
    res.status(201).json(result);
  } catch (e) {
    console.log(e.message); //<- quando houver um erro interno, esse print ajuda a decifrar qual
    if (e && e.code == "23505") {
      return res.status(409).json({
        message: "Já existe usuário com os dados informados",
      });
    }
    return res.status(500).json({
      message: "Erro interno no servidor",
    });
  }
}

async function updateMeController(req, res) {
  const idUsuario = req.usuario.id_usuario;
  const { nome, email, cpf, senha } = req.body;

  if (!nome && !email && !cpf && !senha) {
    return res.status(400).json({
      message: "Informe ao menos um campo para atualizar",
    });
  }

  if (senha && senha.trim().length < 6) {
    return res.status(400).json({
      message: "A senha deve ter pelo menos 6 caracteres",
    });
  }

  try {
    const usuario = await alterarUsuario(idUsuario, {
      nome,
      email,
      cpf,
      senha,
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    return res.status(200).json(usuario);
  } catch (e) {
    if (e && e.code == "23505") {
      return res.status(409).json({
        message: "Já existe usuário com os dados informados",
      });
    }
    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}
async function getUsuarioController(req, res) {
  try {
    const usuario = req.usuario;
    return res.status(200).json(usuario);
  } catch (e) {
    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

async function getUsuarioController(req, res) {
  try {
    const usuario = req.usuario;
    return res.status(200).json(usuario);
  } catch (e) {
    if (e && e.code == "23505") {
      return res.status(404).json({
        message: "Já existe usuário com o email informado",
      });
    }
    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

async function deleteProgressController(req, res) {
  const idUsuario = req.usuario.id_usuario;
  try {
    const idExame = await findIdExameByIdUsuario(idUsuario);
    if (!idExame) {
      return res.status(404).json({
        message: "Exame não encontrado",
      });
    }

    const deletado = deleteProgressByUsuario(idExame);
    return res.status(200).json(deletado);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({
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
    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

module.exports = {
  deleteProgressController,
  createUsuarioController,
  updateMeController,
  getUsuarioController,
};
