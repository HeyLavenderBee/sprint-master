const userName = document.getElementById("user-name");
const buttonLink = document.getElementById("button-abrir-link");

async function getUsuario() {
  const token = localStorage.getItem("token");

  // busca o usuário diretamente a partir do token no header Authorization
  const endpoint = `/api/usuarios/usuario`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

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

  userName.innerText = data.nome;

  const endpointCertificado = `/api/certificados/${data.certificado_hash}`;
  const responseCertificado = await fetch(endpointCertificado, {
    method: "GET",
  });

  const dataCertificado = await responseCertificado.json();

  if (!responseCertificado.ok) {
    return Redirecionar.set(
      dataCertificado.message
        ? dataCertificado.message
        : "Você precisa concluir todos os módulos antes.",
      "dashboard.html",
    );
  }

  buttonLink.setAttribute(
    "href",
    `certificado.html?certificado=${data.certificado_hash}`,
  );
}

getUsuario();
