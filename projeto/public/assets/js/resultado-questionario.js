const fraseConsolo = document.getElementById("frase-consolo");
const imagePercent = document.getElementById("img-percent");
const percentText = document.getElementById("porcentagem-acerto");
const choiceContainer = document.getElementById("choice-container");
const chancesLeft = document.getElementById("tentativa-restante");

async function init() {
  await goToQuestionnaire();
  getScore();
}

function showConfetti(nota){
  if (nota === 10) {
    confetti({
      position: { x: window.innerWidth / 2, y: window.innerHeight / 2 }, 
      count: 200,
      size: 1.25,
      velocity: 200,
      fade: false,
    });
  }
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

function setPercentImage(nota){
  let percent = nota * 10;
  imagePercent.src = `/assets/img/resultado-questionario/porcento-${percent}-correto.png`;
  percentText.innerHTML = `${percent}%`;
}

function showChoiceMessage(nota, tentativa){
  if(tentativa == 1){
    chancesLeft.innerHTML = "Ainda resta uma tentativa.";
  } else if(tentativa == 2){
    chancesLeft.innerHTML = "Não restam mais tentativas.";
  }

  if(nota == 10 && tentativa == 1){
    choiceContainer.innerHTML = `
      <p class="choice-text">Você conseguiu a nota máxima na primeira tentativa! <br> Não é mais preciso refazer o módulo atual, então vá para o próximo módulo com o botão abaixo.</p>
      <div class="button-choice-container">
        <a>
          <button class="button-quiz-result" id="next-module-button">Ir para próximo módulo</button>
        </a>
      </div>
    `;
  } else if(nota > 6 && tentativa == 1){
    choiceContainer.innerHTML = `
      <p class="choice-text">Você deseja refazer a tentativa para tentar conseguir uma nota maior, ou ir para o próximo módulo? <br> (Não se preocupe: caso tenha uma nota menor que a atual, a maior nota será contada na nota final)</p>
      <div class="button-choice-container">
        <a href="questionario.html" alt="Tentar Novamente">
          <button class="button-quiz-result" id="try-again-button">Tentar Novamente</button>
        </a>
        <a>
          <button class="button-quiz-result" id="next-module-button">Ir para próximo módulo</button>
        </a>
      </div>
    `;
  } else if(nota > 6 && tentativa == 2){
    choiceContainer.innerHTML = `
      <p class="choice-text">Não há mais tentativas restantes e você já obteve a nota mínima para o exame. <br>Continue para o próximo módulo.</p>
    `;
  } else if(nota < 7 && tentativa == 1){
    choiceContainer.innerHTML = `
      <p class="choice-text">Você não passou com a nota mínima. <br> Cloque no botão abaixo para tentar novamente para atingir ao menos 70%.</p>
      <button class="button-quiz-result" id="try-again-button" alt="Tentar novamente">Tentar Novamente</button>
    `;
  } else{
    choiceContainer.innerHTML = `
      <p class="choice-text">Infelizmente você não atingiu a nota mínima em nenhuma das tentativas... <br> Para ter a oportunidade de obter o certificado, aceita resetar todo o progresso e começar do zero?</p>
      <button class="button-quiz-result" id="reset-progress-button" alt="Resetar progresso">Resetar progresso</button>
    `;
  }
}

//volta para o questionário caso não tenha respondido todas as questões do módulo
async function goToQuestionnaire(){
  var token = localStorage.getItem("token");
  let endpoint = `api/questoes/proxima-questao`;
  try{
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (data.message == undefined) {
      window.location.href = "questionario.html";
    }
  } catch(e){
    alert("Erro interno no servidor. Tente novamente mais tarde");
  }
}

async function tryAgain(){
  var token = localStorage.getItem("token");
  const endpoint = `/api/questoes/proxima-tentativa`;
  try{
    const result = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    window.location.href = "questionario.html";
  } catch(e){
    alert("Erro interno. Tente novamente mais tarde.");
  }
}

async function nextModule() {
  var token = localStorage.getItem("token");
  const endpoint = `/api/questoes/proximo-modulo`;
  try{
    const result = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    window.location.href = "questionario.html";
  } catch(e){
    alert("Erro interno. Tente novamente mais tarde.");
  }
}

async function resetProgress(){
  var token = localStorage.getItem("token");
  console.log("Resetando progresso...");
  const endpoint = `/api/usuarios/resetar-progresso`;
}

async function getScore(){
  var token = localStorage.getItem("token");
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
  setPercentImage(nota);
  showMessage(nota);
  showChoiceMessage(nota, tentativa);
  showConfetti(nota);
}

init();

// === event listener dos botões do choice-container ===
document.addEventListener("click", function(e){
  if(e.target.id === "try-again-button"){
    e.preventDefault(); //não permite ir para a página antes de rodar a função
    tryAgain();
  }
  if(e.target.id === "reset-progress-button"){
    e.preventDefault(); //não permite ir para a página antes de rodar a função
    resetProgress();
  }
  if(e.target.id === "next-module-button"){
    e.preventDefault();
    nextModule();
  }
})
