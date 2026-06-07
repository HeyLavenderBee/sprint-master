const {
    findProximaQuestaoByUsuario,
    findQuestaoDoExameByUsuario,
    findRespostaByExameEQuestao,
    inserirRespostaQuestao,
    usuarioConcluiuModuloAtual,
    findModuloAtualByUsuario,
    findOutroGrupoAleatorio,
    updateProximaTentativa,
    findProximoModuloByUsuario,
    updateProximoModulo,
    findModulosRespondidosByUsuario
} = require("../repositories/questoes.repository");

async function buscarProximaQuestao(idUsuario){
    const questao = await findProximaQuestaoByUsuario(idUsuario);
    if (!questao) {
        return null;
    }
     return {
    ...questao,
    imagem: questao.imagem ? `/imagens/questoes/${questao.imagem}` : null,
  };
};

async function responderQuestao(idUsuario, idExame, idQuestao, resposta){
    const respostaNormalizada = resposta.trim().toLowerCase();

    const questao = await findQuestaoDoExameByUsuario(
        idUsuario, 
        idExame, 
        idQuestao
    );
    if (!questao) {
      return{
        status: "questao-nao-encontrada",
      };
    }

    const respostaExistente = await findRespostaByExameEQuestao(
      idExame,
      idQuestao,
    );
     if (respostaExistente) {
        return{
        status: "questao-ja-respondida",
      };
     }

     const nota = questao.alternativa_correta === respostaNormalizada ? 1 : 0;

    const respostaInserida = await inserirRespostaQuestao(
        idExame, 
        idQuestao, 
        respostaNormalizada,
        nota
    );

    return {
        status: "repondida",
        resposta: respostaInserida
    }
};

async function iniciarProximaTentativa(idUsuario){
    const concluido = await usuarioConcluiuModuloAtual(idUsuario);
    if (!concluido) {
      return {
        status: "modulo-nao-concluido",
      };
    };    

    const modulo = await findModuloAtualByUsuario(idUsuario);
     if (!modulo) {
      return {
        status: "modulo-atual-nao-encontrado",
      };
    }

    if (modulo.tentativa >= 2) {
      return {
        status: "limite-tentativas",
      };
    }

    const grupo = await findOutroGrupoAleatorio(
      idUsuario,
      modulo.id_modulo,
    );
    if (!grupo) {
      return {
        status: "grupo-alternativo-nao-encontrado",
      };
    }

    const exame = await updateProximaTentativa(
      modulo.id_exame,
      grupo,
      modulo.tentativa + 1,
    );
    if (!exame) {
      return {
        status: "exame-nao-encontrado",
      };
    }

    return {
        status: "atualizada",
        exame
    }
};

async function iniciarProximoModulo(idUsuario){
    const concluido = await usuarioConcluiuModuloAtual(idUsuario);
    if (!concluido) {
      return {
        status: "modulo-nao-concluido",
      };
    }

    const moduloAtual = await findModuloAtualByUsuario(idUsuario);
    if (!moduloAtual) {
      return {
        status: "modulo-atual-nao-encontrado",
      };
    }

        const modulo = await findProximoModuloByUsuario(idUsuario);
    if (!modulo) {
      return {
        status: "todos-modulos-concluidos",
      };
    }

    const grupo = await findOutroGrupoAleatorio(idUsuario, modulo);
    if( !grupo ){
      return {
        status: "grupo-proximo-modulo-nao-encontrado",
      };
    }

    const exame = await updateProximoModulo(moduloAtual.id_exame, modulo, grupo, 1);
    if (!exame) {
      return {
        status: "exame-nao-encontrado",
      };
    }
}

async function listarModulosRespondidos(idUsuario){
  return findModulosRespondidosByUsuario(idUsuario);
}

module.exports = {
    buscarProximaQuestao,
    responderQuestao,
    iniciarProximaTentativa,
    iniciarProximoModulo,
    listarModulosRespondidos
}
