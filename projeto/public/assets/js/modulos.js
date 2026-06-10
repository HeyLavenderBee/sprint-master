const divAlerta = document.getElementById("alerta-tentativas");
function alterarAviso() {
  divAlerta.innerHTML = `<h3 class="texto-aviso">
          Parabéns, você concluiu todos os módulos 🎉
        </h3>`;
  divAlerta.classList.add("aviso-concluido");
  showConfetti();
}

function showConfetti() {
  confetti({
    position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    count: 200,
    size: 1.25,
    velocity: 200,
    fade: false,
  });
}

async function obterDados() {
  const token = localStorage.getItem("token");
  const endpoint = `/api/questoes/modulos-respondidos`;
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok && data.message?.includes("token")) {
      Redirecionar.set(data.message, "index.html");
    } else if (!response.ok) {
      return Alerts.set(data.message);
    }
    
    const tentativasRestantes1 = document.getElementById(
      "tentativas-restantes-1",
    );

    const maiorPontuacao1 = document.getElementById("maior-pontuacao-1");
    let maiorNota1 = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i].id_modulo === 1) {
        tentativasRestantes1.textContent = `Tentativas restantes: ${2 - data[i].tentativa}`;
        if (data[i].nota > maiorNota1) maiorNota1 = data[i].nota;
        maiorPontuacao1.textContent = `Maior pontuação: ${maiorNota1}/10`;
      }
    }

    const tentativasRestantes2 = document.getElementById(
      "tentativas-restantes-2",
    );

    const maiorPontuacao2 = document.getElementById("maior-pontuacao-2");
    let maiorNota2 = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id_modulo === 2) {
        tentativasRestantes2.textContent = `Tentativas restantes: ${2 - data[i].tentativa}`;
        if (data[i].nota > maiorNota2) maiorNota2 = data[i].nota;
        maiorPontuacao2.textContent = `Maior pontuação: ${maiorNota2}/10`;
      }
    }
    const tentativasRestantes3 = document.getElementById(
      "tentativas-restantes-3",
    );
    const maiorPontuacao3 = document.getElementById("maior-pontuacao-3");
    let maiorNota3 = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id_modulo === 3) {
        tentativasRestantes3.textContent = `Tentativas restantes: ${2 - data[i].tentativa}`;
        if (data[i].nota > maiorNota3) {
          maiorNota3 = data[i].nota;
        }
        maiorPontuacao3.textContent = `Maior pontuação: ${maiorNota3}/10`;
      }
    }
    const tentativasRestantes4 = document.getElementById(
      "tentativas-restantes-4",
    );
    const maiorPontuacao4 = document.getElementById("maior-pontuacao-4");
    let maiorNota4 = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id_modulo === 4) {
        tentativasRestantes4.textContent = `Tentativas restantes: ${2 - data[i].tentativa}`;
        if (data[i].nota > maiorNota4) maiorNota4 = data[i].nota;
        maiorPontuacao4.textContent = `Maior pontuação: ${maiorNota4}/10`;
      }
    }
    const tentativasRestantes5 = document.getElementById(
      "tentativas-restantes-5",
    );
    const maiorPontuacao5 = document.getElementById("maior-pontuacao-5");
    let maiorNota5 = 0;
    for (let i = 0; i < data.length; i++) {
      let maiorNota = 0;
      if (data[i].id_modulo === 5) {
        tentativasRestantes5.textContent = `Tentativas restantes: ${2 - data[i].tentativa}`;
        if (data[i].nota > maiorNota5) maiorNota5 = data[i].nota;
        maiorPontuacao5.textContent = `Maior pontuação: ${maiorNota5}/10`;
      }
    }
  } catch (error) {
    Alert.set(
      "Erro ao pegar notas e tentativas dos módulos. <br> Tente novamente mais tarde ou faça login novamente.",
    );
  }
}

obterDados();

async function verificarModulos() {
  const token = localStorage.getItem("token");
  try {
    const endpoint = `/api/usuarios/usuario`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok && data.message?.includes("token")) {
      Redirecionar.set(data.message, "index.html");
    } else if (!response.ok) {
      return Alerts.set(data.message);
    }

    const data = await response.json();

    if (!data?.certificado_hash) {
      return;
    }

    const endpointModulo = `/api/certificados/${encodeURIComponent(
      data.certificado_hash,
    )}`;

    const responseModulo = await fetch(endpointModulo, {
      method: "GET",
    });

    if (!responseModulo.ok) {
      return;
    }

    alterarAviso();
  } catch (error) {
    console.error("Erro ao verificar módulos:", error);
  }
}

verificarModulos();

async function getModulos() {
  const token = localStorage.getItem("token");
  const endpoint = `api/questoes/modulos-respondidos`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    return;
  }

  const data = await response.json();

  var currentModule = 0;
  for (let i = 0; i < data.length; i++) {
    if (i == data.length - 1) {
      currentModule = data[i].id_modulo;
    }
  }
  return currentModule + 1;
  
}

getModulos();


async function setModulos() {
  const currentModule = await getModulos();
  for (let i = 1; i <= currentModule; i++) {
    const moduloLiberado = document.getElementById(
      `btn-modulo-${i}`,
    );
    moduloLiberado.classList.remove("blocked");
    moduloLiberado.innerText = "Acessar";
    moduloLiberado.setAttribute("href", "questionario.html");
  }
}

setModulos();

async function setCompletedModules() {
  const currentModule = await getModulos();
  if (currentModule > 1) {
    for (let i = 1; i < currentModule; i++) {
      const moduloConcluido = document.getElementById(
        `btn-modulo-${i}`,
      );
      moduloConcluido.classList.add("done");
      moduloConcluido.innerText = "Feito!";
    moduloConcluido.removeAttribute("href");

    }
  }
}

setCompletedModules();

