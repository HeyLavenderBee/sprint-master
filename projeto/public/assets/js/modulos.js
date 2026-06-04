
const endpoint = `/api/certificados/hash/data.certificadoHash`;
const response = await fetch(endpoint, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.message); //fornece o erro, geralmente aparece: 'Certificado indisponível: Conclusão de todos os módulos obrigatória'
    return;
  }

function alterarAviso(){
    const divAlerta = document.getElementById("alerta-tentativas");

   
    divAlerta.textContent = "Parabéns você concluiu todos os modulos 🎉"
    divAlerta.style.backgroundColor = "#3ab83aa1"
    divAlerta.style.color = "#ffff"
} 