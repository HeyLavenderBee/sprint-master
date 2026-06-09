const questionNumberIndicator = document.getElementById(
  "question-number-indicator"
);
const progressIndicator = document.getElementById("progress-indicator");
const nextButton = document.getElementById("next-button");
const questionTextElement = document.getElementById("enunciado");
const selectA = document.getElementById("a");
const selectB = document.getElementById("b");
const selectC = document.getElementById("c");
const selectD = document.getElementById("d");
const alternativeA = document.getElementById("text-a");
const alternativeB = document.getElementById("text-b");
const alternativeC = document.getElementById("text-c");
const alternativeD = document.getElementById("text-d");
const questionImage = document.getElementById("question-image");

let resposta = "";

function setQuestionNumberIndicator(idQuestao, numero) {
  questionNumberIndicator.innerHTML = `Questão ${idQuestao}`;
  let percentage = numero * 10;
  progressIndicator.style.width = `${percentage}%`;
}

function disableNextQuestionButton(){
  if(resposta.length == 0){
    selectA.checked = false;
    selectB.checked = false;
    selectC.checked = false;
    selectD.checked = false;
    nextButton.disabled = true;
    nextButton.className = "button disabled";
  }
  else{
    nextButton.disabled = false;
    nextButton.className = "button";
  }
}

function setMarkedAlternative(selected){
  nextButton.disabled = false;
  nextButton.className = "button";
  resposta = selected;
}

function setQuestionHtml(question, a, b, c, d, image) {
  questionTextElement.textContent = question;
  alternativeA.textContent = a;
  alternativeB.textContent = b;
  alternativeC.textContent = c;
  alternativeD.textContent = d;
  let imagePath = image;
  if (image != null) {
    imagePath = image.replace("/imagens/questoes/", "");
    questionImage.src = `assets/img/questionario/${imagePath}`;
  } else {
    questionImage.src = "";
  }
}

async function getQuestion() {
  var token = localStorage.getItem("token");
  let endpoint = `api/questoes/proxima-questao`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok && data.message == "Nenhuma questão pendente encontrada") {
    window.location.href = "resultado-questionario.html";
    return;
  } else if (!response.ok) {
    return alert(data.message);
  }

  setQuestionNumberIndicator(data.numero, data.numero);
  setQuestionHtml(
    data.enunciado,
    data.alternativa_a,
    data.alternativa_b,
    data.alternativa_c,
    data.alternativa_d,
    data.imagem
  );
}

async function nextQuestion() {
  var token = localStorage.getItem("token");

  console.log(resposta);
  if(resposta.length != 1 || resposta.length == 0){
    return alert("Marque uma alternativa antes de ir para próxima questão");
  }

  let endpoint = `api/questoes/proxima-questao`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  //checa se o 'numero' é maior que 10, se sim, ir para tela de resultado questionário
  if (!response.ok && data.message == "Nenhuma questão pendente encontrada") {
    window.location.href = "resultado-questionario.html";
    return;
  } else if (!response.ok) {
    return alert(data.message);
  }

  endpoint = `api/usuarios/id-usuario`;
  const responseUsuario = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const dataUsuarios = await responseUsuario.json();
  let idUsuario = dataUsuarios.id_usuario;

  endpoint = `api/usuarios/id-exame`;
  const responseExame = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idUsuario }),
  });
  const dataExame = await responseExame.json();

  let id_exame = dataExame.id_exame; //TODO: achar uma forma de pegar o idexame automaticamente do banco de dados ou o backend
  let id_questao = data.id_questao;

  endpoint = `api/questoes/responder`;

  const next_response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id_exame, id_questao, resposta }),
  });

  getQuestion();

  document.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.checked = false;
  });
}

disableNextQuestionButton();
getQuestion();

nextButton.addEventListener("click", nextQuestion);

selectA.addEventListener("click", function(){setMarkedAlternative("a")});
selectB.addEventListener("click", function(){setMarkedAlternative("b")});
selectC.addEventListener("click", function(){setMarkedAlternative("c")});
selectD.addEventListener("click", function(){setMarkedAlternative("d")});
