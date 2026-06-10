const { loginService } = require("../services/auth.service");

async function loginController(req, res) {
  const { cpf, senha } = req.body;

  if (!cpf || !senha) {
    return res.status(400).json({ message: "CPF e senha são obrigatórios." });
  }

  try {
    const result = await loginService(cpf,senha);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: e.message,
    });
  }
}

module.exports = {
  loginController,
};
