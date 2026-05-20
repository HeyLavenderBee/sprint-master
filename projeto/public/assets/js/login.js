const cpfInput = document.getElementById("log-cpf");

function normalizarCPF(cpf) {
    const txtSemEspaco = cpf.replace(/\s/g, "");
    const txtSemPontuacao = txtSemEspaco.replace(/[^0-9]/g, "");
    return txtSemPontuacao;
}

async function loginUsuario() {
    var cpf = normalizarCPF(cpfInput.value); 
    var senha = document.getElementById("log-password").value.trim();

    if (cpf == "") {
        alert("O CPF é obrigatório.");
        return;
    }

    if (cpf.length !== 11) {
        alert("CPF inválido. Informe os 11 dígitos.");
        return;
    }

    if (!senha) {
        alert("A senha é obrigatória.");
        return;
    }

    if (senha.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
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

        if (!response.ok) {
            return alert(data.message ? data.message : "Ocorreu um erro");
        }

        alert("Usuário logado com sucesso!");
        window.location.href = "home.html";
    } catch (e) {
        alert("Erro interno do servidor");
    }
}

cpfInput.addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
        loginUsuario();
    }
});