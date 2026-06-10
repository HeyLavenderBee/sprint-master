const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { verifyToken } = require("../utils/jwt");
const { findUsuarioById, findIdExameByIdUsuario } = require("../repositories/usuarios.repository")
const { 
  createUsuarioController, 
  updateMeController, 
  getUsuarioController,
  getPhotoController,
  changePhotoController,
  deleteProgressController,
} = require("../controllers/usuario.controller");
const router = Router();

// POST api/usuarios
router.post("/", createUsuarioController);

// PATCH api/usuarios/me
router.patch("/me", authMiddleware, updateMeController);

// POST api/usuarios/id-exame
router.post("/id-exame", async function (req, res) {
  const { idUsuario } = req.body;

  try{
    const result = await findIdExameByIdUsuario(idUsuario);
    res.send(result);
  } catch(e){
    console.log(e.message);

    return res.status(500).json({
      message: "Erro interno no servidor. Tente novamente mais tarde."
    });
  }
});

// POST api/usuarios/id-usuario
router.post("/id-usuario", async function (req, res) {
  const { token } = req.body;

  try{
    const result = await verifyToken(token);
    res.send(result);
  } catch(e){
    console.log(e.message);

    return res.status(500).json({
      message: "Erro interno no servidor. Tente novamente mais tarde."
    });
  }
});

// GET api/usuarios/usuario (protegido) - retorna usuário a partir do token no header
router.get("/usuario", authMiddleware, getUsuarioController);

// GET api/usuarios/foto-perfil
router.get("/foto-perfil", authMiddleware, getPhotoController);

// GET api/usuarios/mudar-foto-perfil
router.patch("/mudar-foto-perfil", authMiddleware, changePhotoController);

// DELETE api/usuarios/resetar-progresso
router.delete("/resetar-progresso", authMiddleware, deleteProgressController)

module.exports = router;

/*
-- Comandos para testar diferentes sistemas do backend: --

Cadastro:
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana", "email": "ana19@email.com", "cpf": "12345678919", "senha": "123456", "grupo": 1}'

Atualizar dados do usuario:    
curl -X PATCH http://localhost:3000/api/usuarios/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "nome": "Pedro Paulo",
    "email": "pedro.paulo@teste.com",
    "cpf": "11122233345",
    "senha": "123456"
  }'

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

Pegar o idExame
  curl -X POST http://localhost:3000/api/usuarios/id-exame \
  -H "Content-Type: application/json" \
  -d '{"idUsuario": "2"}'

Resetar progresso:
curl -X DELETE http://localhost:3000/api/usuarios/resetar-progresso -H "Authorization: Bearer SEU_TOKEN"

Mostrar foto de perfil atual:
curl -X GET http://localhost:3000/api/usuarios/foto-perfil \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoxLCJpYXQiOjE3ODEwNTAyNTAsImV4cCI6MTc4MTA1MTQ1MH0.Er3HtZC2yy_ZqA509NX6rLYxcLeeM07rOCpJ67RMGXU"

Mudar foto de perfil:
curl -X PATCH http://localhost:3000/api/usuarios/mudar-foto-perfil \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"imagem": "1"}'
  
Pegar o idUsuario
    curl -X POST http://localhost:3000/api/usuarios/id-usuario \
    -H "Content-Type: application/json" \
    -d '{"token": "SEU_TOKEN"}'
*/

