const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
    getProximaQuestaoController,
    responderQuestaoController,
    proximaTentativaController,
    proximoModuloController,
    getModulosRespondidosController,
} = require("../controllers/questoes.controller");

const router = Router();

router.get("/proxima-questao", authMiddleware, getProximaQuestaoController);

router.post("/responder", authMiddleware, responderQuestaoController);

router.patch("/proxima-tentativa", authMiddleware, proximaTentativaController);

router.patch("/proximo-modulo", authMiddleware, proximoModuloController);

router.get("/modulos-respondidos", authMiddleware, getModulosRespondidosController);

/*
---- Comandos CURL para questões ----

Ver qual a questão atual/próxima do usuário:
curl -X GET http://localhost:3000/api/questoes/proxima-questao \
  -H "Authorization: Bearer SEU_TOKEN"

Responder questão atual do usuário:
curl -X POST http://localhost:3000/api/questoes/responder \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"id_exame":"10","id_questao":"21","resposta":"c"}'

Comando para ir para próxima tentativa:
curl -X PATCH http://localhost:3000/api/questoes/proxima-tentativa \
-H "Authorization: Bearer SEU_TOKEN"

Comando para ir para próximo módulo:
curl -X PATCH http://localhost:3000/api/questoes/proximo-modulo \
  -H "Authorization: Bearer SEU_TOKEN"

Comando para ver módulos respondidos:
curl -X GET http://localhost:3000/api/questoes/modulos-respondidos \
  -H "Authorization: Bearer SEU_TOKEN"

*/

module.exports = router;