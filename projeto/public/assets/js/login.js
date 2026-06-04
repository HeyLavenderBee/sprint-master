const cpfInput = document.getElementById("log-cpf");
const senhaInput = document.getElementById("log-password");
const btnLogin = document.getElementById("btn-login");

function normalizarCPF(cpf) {
    const txtSemEspaco = cpf.replace(/\s/g, "").trim();
    const txtSemPontuacao = txtSemEspaco.replace(/[^0-9]/g, "");
    return txtSemPontuacao;
}

async function loginUsuario() {
    var cpf = normalizarCPF(cpfInput.value); 
    var senha = document.getElementById("log-password").value.trim();

    if (cpf == "") {
        return Alerts.set("O CPF é obrigatório.");
    }
    if (cpf.length !== 11) {
        return Alerts.set("CPF inválido. Informe os 11 dígitos.");
    }
    if (senha == "") {
        return Alerts.set("A senha é obrigatória.");
    }

    const endpoint = `api/auth/login`;
    var token = "";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cpf, senha })
        });

        const data = await response.json();
        token = data.token;

        if(!response.ok) {
            return Alerts.set(data.message ? data.message : "Ocorreu um erro");
        }

        localStorage.setItem("token", token);
        Alerts.set("Usuário logado com sucesso!");
        window.location.href = "home.html";
    } catch (e) {
        Alerts.set("Erro interno do servidor");
    }
}

btnLogin.addEventListener("click", loginUsuario)
