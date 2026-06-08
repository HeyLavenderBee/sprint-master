const divAlerta = document.getElementById("alerta-tentativas");

function alterarAviso() {
  divAlerta.innerHTML = `<h3 class="texto-aviso">
          Parabéns, você concluiu todos os módulos 🎉
        </h3>`;
  divAlerta.classList.add("aviso-concluido");
  showConfetti();
}

function showConfetti(){
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
    console.log(data);
    const tentativasRestantes1 = document.getElementById("tentativas-restantes-1");
    tentativasRestantes1.textContent = `Tentativas restantes: ${data[0].tentativa}`;
   }catch (error) {}
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