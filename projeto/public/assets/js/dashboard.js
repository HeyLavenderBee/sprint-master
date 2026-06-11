//sidebar
//botoes
const btnAltName = document.getElementById("alt-name");
const btnAltCpf = document.getElementById("alt-cpf");
const btnAltemail = document.getElementById("alt-email");
const btnAltPassword = document.getElementById("alt-password");
const btnChangePfp = document.getElementById("btn-pfp");
const btnOpenEdit = document.getElementById("btn-open-edit");
const btnEdit = document.getElementById("btn-save-edit");
const btnCertificado = document.getElementById("btn-certificado");
const btnLogOut = document.getElementById("btn-logout");
//inputs
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const cpfInput = document.getElementById("cpf-input");
const passwordInput = document.getElementById("password-input");
const confPasswordInput = document.getElementById("conf-password-input");
//extras
const inputsHolder = document.getElementById("alts-holder");
const confHolder = document.getElementById("conf-password");
const imagens = ["null.png", "image1.png", "image2.png", "image3.png"];
const nameDisplay = document.getElementById("name-display");
const emailDisplay = document.getElementById("email-display");
const photoDisplay = document.getElementById("profile-img");
const progressImg = document.getElementById("progress-img");
const checklist = document.getElementById("checklist");

async function graphMaker(data) {
  if (data.length == 0) {
    var atualModule = 0;
  } else {
    var atualModule = data[data.length - 1].id_modulo;
  }
  var progress = atualModule * 20;
  // verifica se o usuario tem algum registro de questionario
  if (progress != 0) {
    if (data[data.length - 1].nota < 7) {
      progress -= 20;
    }
  }
  progressImg.src = `/assets/img/dashboard/progresso-${progress}-dashboard.png`;
}

async function getCurrentProfilePhoto() {
  const token = localStorage.getItem("token");
  const endpoint = "api/usuarios/foto-perfil";
  const result = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await result.json();
  return data.foto;
}

async function changeCurrentProfilePhoto() {
  const currentPhoto = await getCurrentProfilePhoto();
  var nextPhoto = currentPhoto;

  const resTotal = await fetch('api/usuarios/total-fotos');
  const { total } = await resTotal.json();
  var imagensLength = total;

  if (currentPhoto > imagensLength - 2) {
    nextPhoto = 0;
  } else {
    nextPhoto++;
  }

  const imagem = nextPhoto;

  const token = localStorage.getItem("token");
  const endpoint = "api/usuarios/mudar-foto-perfil";
  const result = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ imagem }),
  });

  getDisplayData();
}

async function checklistMaker(data) {
  if (data.length == 0) {
    var progress = 0;
  } else {
    var progress = data[data.length - 1].id_modulo;
  }
  var list = "";

  // verifica se o usuario tem algum registro de questionario
  // caso não tenha, cai aqui
  if (progress == 0) {
    for (let i = 0; i < 5; i++) {
      if (i == progress) {
        list += `<li class="levels__item">
                    <span class="levels__name">Nível ${i + 1}</span>
                    <span class="levels__icon" aria-hidden="true">
                        <img src="/assets/img/dashboard/play-dashboard.png" width="18" height="18" />
                    </span>
                    <span class="levels__status">Disponível</span>
                </li>`;
      }
      if (i > progress) {
        list += `<li class="levels__item">
                    <span class="levels__name">Nível ${i + 1}</span>
                    <span class="levels__icon" aria-hidden="true">
                        <img src="/assets/img/dashboard/cadeado-sm.png" width="18" height="18" />
                    </span>
                    <span class="levels__status">Disponível</span>
                </li>`;
      }
    }
  }
  // caso tenha um registro, cai aqui
  else {
    if (data[data.length - 1].nota > 6) {
      progress++;
    }
    for (let i = 0; i < 5; i++) {
      // modulo ja concluido
      if (i + 1 < progress) {
        list += `<li class="levels__item">
                    <span class="levels__name">Nível ${i + 1}</span>
                    <span class="levels__icon" aria-hidden="true">
                        <img src="/assets/img/dashboard/feito-dashboard.png" width="18" height="18" />
                    </span>
                    <span class="levels__status">Disponível</span>
                </li>`;
      }
      // modulo atual
      if (i + 1 == progress) {
        list += `<li class="levels__item">
                    <span class="levels__name">Nível ${i + 1}</span>
                    <span class="levels__icon" aria-hidden="true">
                        <img src="/assets/img/dashboard/play-dashboard.png" width="18" height="18" />
                    </span>
                    <span class="levels__status">Disponível</span>
                </li>`;
      }
      // modulo bloqueado
      if (i + 1 > progress) {
        list += `<li class="levels__item">
                    <span class="levels__name">Nível ${i + 1}</span>
                    <span class="levels__icon" aria-hidden="true">
                        <img src="/assets/img/dashboard/cadeado-sm.png" width="18" height="18" />
                    </span>
                    <span class="levels__status">Disponível</span>
                </li>`;
      }
    }
  }
  checklist.innerHTML = list;
}

async function getUserProgress() {
  const token = localStorage.getItem("token");

  try {
    const endpoint = `/api/questoes/modulos-respondidos`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) return Redirecionar.set(data.message ? data.message : "Ocorreu um erro", "index.html");
    graphMaker(data);
    checklistMaker(data);

    if (data.length >= 5 && data[data.length - 1].id_modulo == 5 && data[data.length - 1].nota > 6) {
      btnCertificado.classList.remove("blocked");
      btnCertificado.setAttribute("href", "tela-certificado.html");
    }
  } catch (e) {
    Alerts.set("Erro interno do servidor. Tente novamente mais tarde.");
  }
}

async function getDisplayData() {
  const token = localStorage.getItem("token");

  try {
    const endpoint = `/api/usuarios/usuario`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) return Redirecionar.set(data.message ? data.message : "Ocorreu um erro", "index.html");
    
    var profilePhoto = await getCurrentProfilePhoto();
    photoDisplay.src = `assets/img/fotos-perfil/${profilePhoto}.png`;
    nameDisplay.innerHTML = data.nome;
    emailDisplay.innerHTML = data.email;
    getUserProgress();
  } catch (e) {
    Alerts.set("Erro interno do servidor. Tente novamente mais tarde.");
  }
}

function normalizarCPF(cpf) {
  const txtSemEspaco = cpf.replace(/\s/g, "");
  const txtSemPontuacao = txtSemEspaco.replace(/[^0-9]/g, "");
  return txtSemPontuacao;
}

async function getUserData() {
  const token = localStorage.getItem("token");

  try {
    const endpoint = `/api/usuarios/usuario`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) return Redirecionar.set(data.message ? data.message : "Ocorreu um erro", "index.html");

    nameInput.value = data.nome;
    emailInput.value = data.email;
    cpfInput.value = data.cpf;
  } catch (e) {
    Alerts.set("Erro interno do servidor. Tente novamente mais tarde.");
  }
}

async function updateUserData() {
  var nome = nameInput.value.trim();
  var email = emailInput.value.trim();
  var cpf = normalizarCPF(cpfInput.value.trim());
  var senha = passwordInput.value ? passwordInput.value.trim() : "";
  var confsenha = confPasswordInput.value ? confPasswordInput.value.trim() : "";
  const token = localStorage.getItem("token");

  if (nameInput.disabled == false) {
    if (nome == "") return Alerts.set("Campo nome está vazio.");
    try {
      const endpoint = `/api/usuarios/me`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome }),
      });

      const data = await response.json();
      if (!response.ok) return Redirecionar.set(data.message ? data.message : "Ocorreu um erro", "index.html");
    } catch (e) {
      Alerts.set("Erro interno do servidor. Tente novamente mais tarde.");
    }
  }
  if (emailInput.disabled == false) {
    if (email == "") {
      return Alerts.set("Campo email está vazio.");
    }
    try {
      const endpoint = `/api/usuarios/me`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        return Redirecionar.set(data.message ? data.message : "Ocorreu um erro", "index.html");
      }
    } catch (e) {
      Alerts.set("Erro interno do servidor. Tente novamente mais tarde.");
    }
  }
  if (cpfInput.disabled == false) {
    if (cpf == "")
      return Alerts.set("Campo CPF está vazio.");
    
    if (cpf.length !== 11)
      return Alerts.set("CPF inválido. Informe os 11 dígitos.");
    
    try {
      const endpoint = `/api/usuarios/me`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cpf }),
      });

      const data = await response.json();
      if (!response.ok) return Redirecionar.set(data.message ? data.message : "Ocorreu um erro", "index.html");
    } catch (e) {
      Alerts.set("Erro interno do servidor. Tente novamente mais tarde.");
    }
  }
  if (passwordInput.disabled == false) {
    if (senha == "")
      return Alerts.set("Campo senha está vazio.");
    
    if (senha.length < 6)
      return Alerts.set("A senha deve ter pelo menos 6 caracteres.");
    
    if (senha != confsenha)
      return Alerts.set("As duas senhas precisam ser iguais para alterá-la.");
    
    try {
      const endpoint = `/api/usuarios/me`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senha }),
      });

      const data = await response.json();
      if (!response.ok) return Redirecionar.set(data.message ? data.message : "Ocorreu um erro", "index.html");
    } catch (e) {
      Alerts.set("Erro interno do servidor. Tente novamente mais tarde.");
    }
  }
  getDisplayData();
  resetEverything();
  return Verificacao.set("Usuário atualizado com sucesso!");
}

function resetEverything() {
  nameInput.disabled = true;
  emailInput.disabled = true;
  cpfInput.disabled = true;
  passwordInput.disabled = true;
  btnAltName.disabled = false;
  btnAltemail.disabled = false;
  btnAltCpf.disabled = false;
  btnAltPassword.disabled = false;
  passwordInput.value = "";
  confPasswordInput.value = "";
  btnOpenEdit.className = "btn-edit btn-open-edit-show";
  btnChangePfp.className = "btn-pfp-hide";
  confHolder.className = "field-hide";
  inputsHolder.className = "alts-holder-hide";
}

//event listeners dos botões
btnAltName.addEventListener("click", function () {
  nameInput.disabled = false;
  btnAltName.disabled = true;
});
btnAltemail.addEventListener("click", function () {
  emailInput.disabled = false;
  btnAltemail.disabled = true;
});
btnAltCpf.addEventListener("click", function () {
  cpfInput.disabled = false;
  btnAltCpf.disabled = true;
});
btnAltPassword.addEventListener("click", function () {
  confHolder.className = "field";
  passwordInput.disabled = false;
  btnAltPassword.disabled = true;
});
btnOpenEdit.addEventListener("click", function () {
  btnChangePfp.className = "btn-pfp";
  inputsHolder.className = "sidebar alts-holder-show";
  btnOpenEdit.className = "btn-open-edit-hide";
  getUserData();
});
btnChangePfp.addEventListener("click", function () {
  changeCurrentProfilePhoto();
});
btnEdit.addEventListener("click", function () {
  updateUserData();
});
// Função para deslogar o perfil do usuário.
btnLogOut.addEventListener("click", function () {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

resetEverything();
getDisplayData();
