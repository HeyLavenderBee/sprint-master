const cpfInput = document.getElementById("log-cpf");
const senhaInput = document.getElementById("log-password");
const btnLogin = document.getElementById("btn-login");


async function loginUsuario(){
    // colocar validação de input aqui (use um if para cada campo)
    
    var cpf = cpfInput.value.trim();
    var senha = senhaInput.value.trim();

    var token = ""; 
    const endpoint = `api/auth/login`;

    try{
        const response = await fetch(
            endpoint,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({cpf, senha})
            }
        )

        const data = await response.json();
        token = data.token;

        if(!response.ok){
            return alert(data.message ? data.message : "Ocorreu um erro");
        }
        console.log("resposta: ",response);
        alert("Usuário logado com sucesso!");
        localStorage.setItem("token", token);
        window.location.href = "home.html";
    } catch(e){ //qualquer erro de conexão a internet ou coisas que não foi o erro do usuário
        alert("Erro interno do servidor");
    }
}


btnLogin.addEventListener("click", loginUsuario)

