const fraseConsolo = document.getElementById("frase-consolo");
const imagePercent = document.getElementById("img-percent");
const percentText = document.getElementById("porcentagem-acerto");
const resultImage = document.getElementById('imagem-porcentagem');

function updateImage(nota) {
    if(!resultImage) return;
    resultImage.src = `assets/img/resultado-questionario/porcento-${nota}-correto.png`;
}

function showMessage(nota) {
  const fraseSucessso = [
    "Parabéns, você alcançou o resultado necessário!",
    "Muito bem, você entendeu!",
    "Ótimo trabalho!",
  ];
  const fraseFracasso = [
    "Ops, não foi dessa vez...",
    "Iih, parece que você não passou...",
    "Poxa, fica para depois, né?",
  ];

  // Calcula um índice aleatório baseado no tamanho do array
  if (typeof nota !== "number" || isNaN(nota)) {
    alert("A nota é inválida");
    return;
  } else if (nota >= 7) {
    const indiceAleatorio = Math.floor(Math.random() * fraseSucessso.length);
    const elementoAleatorio = fraseSucessso[indiceAleatorio];
    fraseConsolo.innerText = elementoAleatorio;
  } else {
    const indiceAleatorio = Math.floor(Math.random() * fraseFracasso.length);
    const elementoAleatorio = fraseFracasso[indiceAleatorio];
    fraseConsolo.innerText = elementoAleatorio;
  }
}

async function getScore() {
  const token = localStorage.getItem("token");
  if (!token) return alert("Não foi possível buscar a nota total para o questionário. Faça login e tente novamente.");

  try {
    const endpoint = `/api/questoes/modulos-respondidos`;
    const result = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await result.json();
    const lastModuleData = data[data.length-1]; //pega último módulo feito
    const nota = lastModuleData.nota;
    const tentativa = lastModuleData.tentativa;
    showMessage(nota);
    updateImage(nota);
  } catch (e) {
    return alert("Erro no servidor. Não foi possível carregar nota do exame.");
  }
}

getScore();
