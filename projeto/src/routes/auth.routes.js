const { Router } = require("express");
const { loginController } = require("../controllers/auth.controller");

const router = Router();

router.post("/login", loginController);

module.exports = router;

/*
Código para testar o login (caso não retorne erro quer dizer que foi efetuado com sucesso):

curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"cpf": "12345678919", "senha": "123456"}'
*/
