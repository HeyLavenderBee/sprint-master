const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const cpfInput = document.getElementById("cpf");
const passwordInput = document.getElementById("password");
const cadastrarInput = document.getElementById("button-cadastrar");

function normalizarCPF(cpf) {
    const txtSemEspaco = cpf.replace(/\s/g, "");
    const txtSemPontuacao = txtSemEspaco.replace(/[^0-9]/g, "");
    return txtSemPontuacao;
}

async function cadastrarUsuario() {
  var nome = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();
  var cpf = normalizarCPF(document.getElementById("cpf").value.trim());
  var senha = document.getElementById("password").value.trim();
  console.log(cpf, "-",email)

  if (nome == "") {
    return alert("O nome é obrigatório.");
  }
  if (email == "") {
    return alert("O e-mail é obrigatório.");
  }
  if (cpf == "") {
    return alert("O CPF é obrigatório.");
  }
  if (cpf.length !== 11) {
    return alert("CPF inválido. Informe os 11 dígitos.");
  }
  if (senha == "") {
    return alert("A senha é obrigatória.");
  }
  if (senha.length < 6) {
    return alert("A senha deve ter pelo menos 6 caracteres.");
  }

  const endpoint = `api/usuarios`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, cpf, senha }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return alert(
        errorData.message ? errorData.message : "Ocorreu um erro",
      );
    }

    alert("Usuário cadastrado com sucesso!");
    window.location.href = "index.html";
  } catch (e) {
    //qualquer erro de conexão a internet ou coisas que não foi o erro do usuário
    alert(e.message ? e.message : "Ocorreu um erro interno.");
  }
}

cadastrarInput.addEventListener("click", cadastrarUsuario);
