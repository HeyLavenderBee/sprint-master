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


const botaoBaixar = document.getElementById("button-baixar");
const elementToCapture = document.getElementById("body-certificado");
  
async function generatePDF() {
  try {
    let targetElement = elementToCapture;
    let newWindow;

    if (!targetElement) {
      newWindow = window.open(buttonLink.getAttribute("href"), "_blank");
      if (!newWindow) {
        throw new Error("Não foi possível abrir a nova janela. Verifique o bloqueador de pop-ups.");
      }

      await new Promise((resolve) => {
        newWindow.addEventListener("load", resolve);
      });

      targetElement = newWindow.document.getElementById("body-certificado");
      if (!targetElement) {
        throw new Error("Elemento #body-certificado não encontrado na nova janela.");
      }
    }

    const canvas = await html2canvas(targetElement, {
      useCORS: true,
       backgroundColor: null,
       scale: 2,
     });

    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf || newWindow?.jspdf;
    if (!jsPDF) {
      throw new Error("Biblioteca jsPDF não encontrada.");
    }

    const orientation = canvas.width > canvas.height ? "landscape" : "portrait";
    const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let imgWidth = pageWidth;
    let imgHeight = (canvas.height * pageWidth) / canvas.width;

    if (imgHeight > pageHeight) {
      imgHeight = pageHeight;
      imgWidth = (canvas.width * pageHeight) / canvas.height;
    }

    const xOffset = (pageWidth - imgWidth) / 2;
    const yOffset = (pageHeight - imgHeight) / 2;

    doc.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
    doc.save("Certificado.pdf");

    if (newWindow) {
      newWindow.close();
    }
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
  }
}


getUsuario();

function printCertificado() {
   getUsuario();
    const novaJanela = window.open(`certificado.html`, '_blank');
    window.print(novaJanela);
   
}


