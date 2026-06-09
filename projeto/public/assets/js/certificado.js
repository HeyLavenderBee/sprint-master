const botaoBaixar = document.getElementById("button-baixar");
const elementToCapture = document.getElementById("body-certificado");
  
async function generatePDF() {
  try {
    let targetElement = elementToCapture;
    let newWindow;

    if (!targetElement) {
      newWindow = window.open("certificado.html", "_blank");
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

  
  
  
  
  
  
  
