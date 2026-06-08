const { Router } = require("express");
const { loginController } = require("../controllers/auth.controller");

const router = Router();

router.post("/login", loginController);

module.exports = router;

/*
Código para testar o login:
curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"cpf": "11122233344", "senha": "123456"}'
*/
