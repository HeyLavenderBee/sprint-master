const {
    buscarProximaQuestao,
    responderQuestao,
    iniciarProximaTentativa,
    iniciarProximoModulo,
    listarModulosRespondidos
} = require("../services/questoes.service");

async function getProximaQuestaoController(req, res) {
  try {
    const result = await buscarProximaQuestao(req.usuario.id_usuario);

    if (!result) {
      return res
        .status(404)
        .json({ message: "Nenhuma questão pendente encontrada" });
    }

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
};

async function responderQuestaoController(req, res) {
  try {
    console.log("body", req.body);
    const { id_exame, id_questao, resposta } = req.body;

    const result = await responderQuestao(
        req.usuario.id_usuario, 
        id_exame, 
        id_questao,
        resposta
    );

   if (result.status === "questao-nao-encontrada"){
    return res.status(404).json({
        message: "questão não encontrada para este exame",
    });
   }

    if (result.status === "questao-ja-respondida") {
      return res.status(409).json({
        message: "Questão já respondida",
      });
    }

    return res.status(201).json(result.resposta);
  } catch (e) {
    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
};

async function proximaTentativaController(req, res) {
  try {
    const result = await iniciarProximaTentativa(req.usuario.id_usuario);

    if (result.status === "modulo-nao-concluido") {
      return res.status(409).json({
        message: "Você ainda não concluiu todas as questões do módulo atual",
      });
    }; 

    
    if (result.status === "modulo-atual-nao-encontrado") {
      return res.status(404).json({
        message: "Módulo atual não encontrado",
      });
    }
    if (result.status === "limite-tentativas") {
      return res.status(409).json({
        message: "Limite de 2 tentativas atingido",
      });
    }

    if (result.status === "grupo-alternativo-nao-encontrado") {
      return res.status(404).json({
        message: "Nenhum grupo alternativo disponível para este módulo",
      });
    }

    if (result.status === "exame-nao-encontrado") {
      return res.status(404).json({
        message: "Exame não encontrado para atualização",
      });
    }

    return res.status(200).json(result.exame);
  } catch (e) {
    console.log(e.message)
    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
};

async function proximoModuloController(req, res) {
  try {
    const result = iniciarProximoModulo(req.usuario.id_usuario);

    if (result.status === "modulo-nao-concluido") {
      return res.status(409).json({
        message: "Você ainda não concluiu todas as questões do módulo atual",
      });
    }

    if (result.status === "modulo-atual-nao-encontrado") {
      return res.status(404).json({
        message: "Módulo atual não encontrado",
      });
    }


    if (result.status === "todos-modulos-concluidos") {
      return res.status(404).json({
        message: "Você concluiu todos os módulos",
      });
    }


    if(result.status === "grupo-proximo-modulo-nao-encontrado"){
      return res.status(404).json({
        message: "Nenhum grupo disponível para o próximo módulo",
      });
    }

    if (result.status === "exame-nao-encontrado") {
      return res.status(404).json({
        message: "Exame não encontrado para atualização",
      });
    }

    return res.status(200).json(result.exame);
  } catch (e) {
    console.log(e.message)
    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
};

async function getModulosRespondidosController(req, res) {
  try {
    const modulos = await listarModulosRespondidos(req.usuario.id_usuario);

    return res.status(200).json(modulos);
  } catch (e) {
    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
};

module.exports = {
    getProximaQuestaoController,
    responderQuestaoController,
    proximaTentativaController,
    proximoModuloController,
    getModulosRespondidosController,
}