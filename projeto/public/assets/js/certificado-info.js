const userCPF = document.getElementById("user-cpf");
const userEmail = document.getElementById("user-email");
const userName = document.getElementById("nomePessoaCertificada");
const userGrade = document.getElementById("user-grade"); // Vai receber a média de todas as notas do usuário (com base nos 5 módulos)

// Função para formatar a data do timestamp para a versão pt-BR
function formatDate(dateString) {
  // Caso retorne vazio
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR");
}

// Função para formatar o CPF do usuário
function formatCpf(cpfString) {
  if (!cpfString) return "";
  const cpfUser = cpfString;
  return cpfUser.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// Função para calcular a média das notas de todos os módulos
function calculateAverageGrade(modulosConcluidos) {
  // Caso retorne vazio
  if (!Array.isArray(modulosConcluidos) || modulosConcluidos.length === 0) {
    return null;
  }
  // Mapeia os módulos como no certificado.service (Não sei se vai funcionar)
  const notas = modulosConcluidos.map((modulo) => {
    const notasConcluidas = modulo.notasTentativas
      .filter((tentativa) => tentativa.concluida)
      .map((tentativa) => Number(tentativa.nota) || 0);

    if (notasConcluidas.length === 0) {
      return 0;
    }

    return Math.max(...notasConcluidas);
  });

  const soma = notas.reduce((total, nota) => total + nota, 0);
  return (soma / notas.length).toFixed(2).replace(".", ",");
}

// Função para pegar o certificado
async function getCertificado() {
  const urlParams = new URLSearchParams(window.location.search);
  const certificadoHash = urlParams.get("certificado"); // pega o certificado_hash no url '?certificado=certificado_hash'

  if (!certificadoHash) {
    return Redirecionar.set(
      "O url do certificado não foi informado.",
      "dashboard.html",
    );
  }

  const endpoint = `/api/certificados/${encodeURIComponent(certificadoHash)}`; //encodeUriComponent garante 'segurança' no url, espaços viram %20 e etc.
  const response = await fetch(endpoint, {
    method: "GET",
  });

  const data = await response.json();
  
  // Adicionei essa verficação pois o data.message pode ser sobre o token
  //  ou sobre o certificado, e dessa forma, é possível redirecionar para página certa.
  if (!response.ok && data.message?.includes("token")) {
    Redirecionar.set(data.message, "index.html");
  } else if (!response.ok) {
    return Redirecionar.set(
      data.message
        ? data.message
        : "Você precisa concluir todos os módulos antes.",
      "dashboard.html",
    );
  }

  userCPF.innerText = formatCpf(data.aluno?.cpf) || "";
  userEmail.innerText = data.aluno?.email || "";
  userName.innerText = data.aluno?.nome || "";
  userGrade.innerText =
    calculateAverageGrade(data.progresso?.modulosConcluidos) || ""; // chama a função de calcular a média

  const dataEmissao = document.getElementById("data-emissao-certificado");
  if (dataEmissao) {
    dataEmissao.innerText =
      formatDate(data.certificado?.emitidoEm) || dataEmissao.innerText; //chama a função de formatar data
  }

  console.log(data);
}

getCertificado();