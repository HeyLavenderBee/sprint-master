const questionNumberIndicator = document.getElementById(
  "question-number-indicator"
);
const progressIndicator = document.getElementById("progress-indicator");
const nextButton = document.getElementById("next-button");
const questionTextElement = document.getElementById("enunciado");
const alternativeA = document.getElementById("text-a");
const alternativeB = document.getElementById("text-b");
const alternativeC = document.getElementById("text-c");
const alternativeD = document.getElementById("text-d");
const questionImage = document.getElementById("question-image");

function setQuestionNumberIndicator(idQuestao, numero) {
  questionNumberIndicator.innerHTML = `Questão ${idQuestao}`;
  let percentage = numero * 10;
  progressIndicator.style.width = `${percentage}%`;
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

  if (!response.ok) {
    return alert("Token inválido ou expirado, faça login novamente.");
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
  console.log(idUsuario);

  endpoint = `api/usuarios/id-exame`;
  const responseExame = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idUsuario }),
  });
  const dataExame = await responseExame.json();

  console.log(dataExame.id_exame);

  let id_exame = dataExame.id_exame; //TODO: achar uma forma de pegar o idexame automaticamente do banco de dados ou o backend
  let id_questao = data.id_questao;
  let resposta = "b";

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

getQuestion();

nextButton.addEventListener("click", nextQuestion);
