const fraseConsolo = document.getElementById("frase-consolo");

function showMessage(nota) {
  const fraseSucessso = [
    "Parabéns, você alcançou o resultado necessário.",
    "Muito bem, você entendeu!",
    "Ótimo trabalho!",
  ];
  const fraseFracasso = [
    "Ops, não foi dessa vez...",
    "Iih, parece que você não passou...",
    "Poxa, fica para depois né?",
  ];

  // Calcula um índice aleatório baseado no tamanho do array
  if (typeof nota !== "number" || isNaN(nota)) {
    alert("A nota é inválida");
    return;
  } else if (nota >= 7) {
    const indiceAleatorio = Math.floor(Math.random() * fraseSucessso.length);
    const elementoAleatorio = fraseSucessso[indiceAleatorio];
    fraseConsolo.innerText = elementoAleatorio;

    console.log(elementoAleatorio);
  } else {
    const indiceAleatorio = Math.floor(Math.random() * fraseFracasso.length);
    const elementoAleatorio = fraseFracasso[indiceAleatorio];
    fraseConsolo.innerText = elementoAleatorio;

    console.log(elementoAleatorio);
  }

}

showMessage(nota);
