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

  if (!response.ok) {
    console.error("Erro ao buscar usuário:", data);
    return;
  }

  userName.innerText = data.nome;

  buttonLink.setAttribute("href", `certificado.html?certificado=${data.certificado_hash}`)
}

getUsuario();
