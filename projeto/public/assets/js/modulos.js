const divAlerta = document.getElementById("alerta-tentativas");

function alterarAviso() {
  divAlerta.innerHTML = `<h3 class="texto-aviso">
          Parabens, você concluiu todos os módulos 🎉
        </h3>`;
  divAlerta.classList.add("aviso-concluido");
}

async function verificarModulos() {
  var token = localStorage.getItem("token");

  const endpoint = `api/usuarios/usuario`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  let data = await response.json();

  const endpointModulo = `/api/certificados/hash/${data.certificado_hash}`;
  const responseModulo = await fetch(endpointModulo, {
    method: "GET",
  });

  const dataModulo = await responseModulo.json();

  if (!responseModulo.ok) {
    return;
  }


}alterarAviso();

verificarModulos();
