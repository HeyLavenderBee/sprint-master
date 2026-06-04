const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {verifyToken} = require("../utils/jwt");
const { 
createUsuarioController, 
updateCpfController, 
updateNomeController, 
updateEmailController,
updateSenhaController, 
getUsuarioController,
} = require("../controllers/usuario.controller");
const { findUsuarioById, findIdExameByIdUsuario } = require("../repositories/usuarios.repository");
const router = Router();

// POST api/usuarios
router.post("/", createUsuarioController);

router.patch("/cpf",authMiddleware, updateCpfController);

// atualiza o espaco do nome
router.patch("/nome",authMiddleware, updateNomeController);

// atualiza o espaço do email
router.patch("/email",authMiddleware, updateEmailController);

// atualiza o espaço da senha
router.patch("/senha", authMiddleware, updateSenhaController);

// POST api/id-exame
router.post("/id-exame", async function (req, res) {
  const { idUsuario } = req.body;

  try{
    const result = await findIdExameByIdUsuario(idUsuario);
    res.send(result);
  } catch(e){
    console.log(e.message); //<- quando houver um erro interno, esse print ajuda a decifrar qual

    return res.status(400).json({
      message: "Erro interno no servidor"
    });
  }
});

// POST api/id-usuario
router.post("/id-usuario", async function (req, res) {
  const { token } = req.body;

  try{
    const result = await verifyToken(token);
    res.send(result);
  } catch(e){
    console.log(e.message); //<- quando houver um erro interno, esse print ajuda a decifrar qual

    return res.status(400).json({
      message: "Erro interno no servidor"
    });
  }
});

// GET api/usuario (protegido) - retorna usuário a partir do token no header
router.get("/usuario", authMiddleware, getUsuarioController);

function getIdUsuario(params){
    const idUsuario = Number(params.idUsuario);

    if (!Number.isInteger(idUsuario) || idUsuario <= 0){
        return null;
    }
    return idUsuario;
}


module.exports = router;

/*
-- Comandos para testar diferentes sistemas do backend: --

Cadastro:
curl -X POST http://localhost:3000/api/usuarios \
    -H "Content-Type: application/json" \
    -d '{"nome": "Ana", "email": "ana19@email.com", "cpf": "12345678919", "senha": "123456", "grupo": 1}'

Atualizar CPF:
curl -X PATCH http://localhost:3000/api/usuarios/4/cpf \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer SEU_TOKEN" \
    -d '{"cpf": "11223344556"}'

Atualizar nome:
curl -X PATCH http://localhost:3000/api/usuarios/4/nome \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer SEU_TOKEN" \
    -d '{"nome": "maria eduarda"}'

Atualizar email:
curl -X PATCH http://localhost:3000/api/usuarios/4/email \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer SEU_TOKEN" \
    -d '{"email": "fernanda@gmail.com"}'

Atualizar senha:
curl -X PATCH http://localhost:3000/api/usuarios/4/senha \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer SEU_TOKEN" \
    -d '{"senha": "teste1"}'

Pegar o idUsuario
    curl -X POST http://localhost:3000/api/usuarios/id-exame \
    -H "Content-Type: application/json" \
    -d '{"idUsuario": "2"}'

Pegar o idUsuario
    curl -X POST http://localhost:3000/api/usuarios/id-usuario \
    -H "Content-Type: application/json" \
    -d '{"idUsuario": "2"}'
*/
