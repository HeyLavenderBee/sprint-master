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


const botaoBaixar = document.getElementById("button-baixar");
//pega o body do certificado
const elementToCapture = document.getElementById("body-certificado");


async function generatePDF() {
  try {
    //existe porque é a variável que vai conter o elemento já capturado
    let targetElement = elementToCapture;
    let newWindow;

    // Se o elemento não for encontrado na página atual, tenta abrir o link em uma nova janela e capturar o elemento lá
    if (!targetElement) {
      newWindow = window.open(buttonLink.getAttribute("href"), "_blank");
      if (!newWindow) {
        throw new Error("Não foi possível abrir a nova janela. Verifique o bloqueador de pop-ups.");
      }

      // Espera a nova janela carregar completamente antes de tentar acessar o elemento
      await new Promise((resolve) => {
        newWindow.addEventListener("load", resolve);
      });

      // Tenta acessar o elemento na nova janela
      targetElement = newWindow.document.getElementById("body-certificado");
      if (!targetElement) {
        throw new Error("Elemento #body-certificado não encontrado na nova janela.");
      }
    }

    // Usa html2canvas para capturar o elemento em um canvas
    const canvas = await html2canvas(targetElement, {
      useCORS: true,
       backgroundColor: null,
       scale: 2,
     });

     // Converte o canvas para uma imagem em formato PNG
    const imgData = canvas.toDataURL("image/png");

    // Verifica se a biblioteca jsPDF está disponível
    const { jsPDF } = window.jspdf || newWindow?.jspdf;
    if (!jsPDF) {
      throw new Error("Biblioteca jsPDF não encontrada.");
    }

    // Cria um novo documento PDF usando jsPDF, ajustando a orientação com base nas dimensões do canvas
    const orientation = canvas.width > canvas.height ? "landscape" : "portrait";
    const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Calcula as dimensões da imagem para caber na página, mantendo a proporção
    let imgWidth = pageWidth;
    let imgHeight = (canvas.height * pageWidth) / canvas.width;
    // Se a altura da imagem for maior que a altura da página, ajusta a largura e a altura para caber
    if (imgHeight > pageHeight) {
      imgHeight = pageHeight;
      imgWidth = (canvas.width * pageHeight) / canvas.height;
    }
    // Calcula as coordenadas para centralizar a imagem na página
    const xOffset = (pageWidth - imgWidth) / 2;
    const yOffset = (pageHeight - imgHeight) / 2;
    // Adiciona a imagem ao PDF e salva o arquivo
    doc.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
    doc.save("Certificado.pdf");
    // Fecha a nova janela se ela foi aberta
    if (newWindow) {
      newWindow.close();
    }
  }
  //Exibe mensagens de erro caso o try falhar 
  catch (error) {
    console.error("Erro ao gerar PDF:", error);
  }
}


getUsuario();

