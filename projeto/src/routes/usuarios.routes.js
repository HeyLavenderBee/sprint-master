const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {verifyToken} = require("../utils/jwt");
const { 
createUsuarioController, 
updateMeController, 
} = require("../controllers/usuario.controller");

const router = Router();

// POST api/usuarios
router.post("/", createUsuarioController);

router.patch("/me", authMiddleware, updateMeController);

/*curl -X PATCH http://localhost:3000/api/usuarios/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "nome": "Pedro Paulo",
    "email": "pedro.paulo@teste.com",
    "cpf": "11122233345",
    "senha": "123456"
  }'
*/

module.exports = router;

/*
-- Comandos para testar diferentes sistemas do backend: --

Cadastro:
curl -X POST http://localhost:3000/api/usuarios \
    -H "Content-Type: application/json" \
    -d '{"nome": "Ana", "email": "ana19@email.com", "cpf": "12345678919", "senha": "123456", "grupo": 1}'


Pegar o idUsuario
    curl -X POST http://localhost:3000/api/usuarios/id-exame \
    -H "Content-Type: application/json" \
    -d '{"idUsuario": "2"}'

Pegar o idUsuario
    curl -X POST http://localhost:3000/api/usuarios/id-usuario \
    -H "Content-Type: application/json" \
    -d '{"idUsuario": "2"}'
*/
