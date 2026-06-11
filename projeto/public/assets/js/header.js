const nameLabel = document.getElementById("user-name");
const emailLabel = document.getElementById("user-email");
const userPhoto = document.getElementById("user-photo");

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

async function getDisplayData() {
  const token = localStorage.getItem("token");

  try {
    const endpoint = `/api/usuarios/usuario`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      return Redirecionar.set(data.message ? data.message : "Ocorreu um erro", "index.html");
    }
    var profilePhoto = await getCurrentProfilePhoto();
    userPhoto.src = `assets/img/fotos-perfil/${profilePhoto}.png`;
    nameLabel.innerHTML = data.nome;
    emailLabel.innerHTML = data.email;
  } catch (e) {
    Alerts.set("Erro interno do servidor. Tente novamente mais tarde.");
  }
}

getDisplayData();

