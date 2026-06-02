const userCPF = document.getElementById("user-cpf");
const userEmail = document.getElementById("user-email");
const userName = document.getElementById("nomePessoaCertificada");
const userGrade = document.getElementById("user-grade"); // Vai receber a média de todas as notas do usuário (com base nos 5 módulos)

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

  userCPF.innerText = data.cpf;
  userEmail.innerText = data.email;
  userName.innerText = data.nome
  userGrade.innerText = "10" // -> Editar aqui para quando houver a nota, colocar a média de todas
}

getUsuario();