const { Router } = require("express");
const {
  getCertificadoByHashController,
} = require("../controllers/certificados.controller");

const router = Router();

router.get("/:hash", getCertificadoByHashController);

module.exports = router;

/* 
Comando para pegar certificado de um usuário:
curl -X GET http://localhost:3000/api/certificados/HASH_DO_USUARIO 
*/
