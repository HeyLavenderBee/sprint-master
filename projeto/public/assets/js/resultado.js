async function carregarNotaTotal() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("Token não encontrado. Não foi possível buscar a nota total.");
    return;
  }

  try {
    const response = await fetch("/api/questoes/nota-total", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Erro ao buscar a nota total:", response.status);
      return;
    }

    const data = await response.json();
    const notaTotal = Number(data.notaTotal) || 0;

    const resultadoText = document.querySelector(".quiz-result-text");
    const detalheText = document.querySelector(".quiz-result-text.super-small");

    if (resultadoText) {
      resultadoText.textContent = `Você acertou ${notaTotal} perguntas no último exame.`;
    }

    if (detalheText) {
      detalheText.textContent = `Nota total: ${notaTotal}.`;
    }
     atualizarImagem(notaTotal);
  } catch (error) {
    console.error("Falha ao carregar a nota total:", error);
  }
}

function atualizarImagem(notaTotal) {
    let imagem = document.getElementById('imagemPorcentagem');
    if(!imagem) return;
    imagem.src = `assets/img/resultado-questionario/porcento-${notaTotal}-correto.png`;
}

carregarNotaTotal();