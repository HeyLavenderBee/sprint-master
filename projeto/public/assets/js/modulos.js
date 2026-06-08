const divAlerta = document.getElementById("alerta-tentativas");

function alterarAviso() {
  divAlerta.innerHTML = `<h3 class="texto-aviso">
          Parabéns, você concluiu todos os módulos 🎉
        </h3>`;
  divAlerta.classList.add("aviso-concluido");
}

async function verificarModulos() {
  try {
    const token = localStorage.getItem("token");

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

    const endpointModulo = `/api/certificados/hash/${encodeURIComponent(
      data.certificado_hash,
    )}`;
    const responseModulo = await fetch(endpointModulo, {
      method: "GET",
    });

    if (!responseModulo.ok) {
      return;
    }

    alterarAviso();
    confetti({
      position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      count: 200,
      size: 1.25,
      velocity: 200,
      fade: false,
    });
  } catch (error) {
    console.error("Erro ao verificar módulos:", error);
  }
}

verificarModulos();
