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

async function verificarModulos() {
  const token = localStorage.getItem("token");
  try {
    const endpoint = `api/usuarios/usuario`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return;
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

