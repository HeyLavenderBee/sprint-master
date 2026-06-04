// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';
//puxando elementos do html
// const botaoAbrir = document.getElementById("button-abrir");
// const botaoImprimir = document.getElementById("button-imprimir");
const bodyCertificado = document.querySelector("#body-certificado")
const botaoBaixar = document.getElementById("button-baixar");
//html2canvas
// const novaJanela = window.open('/assets/pages/certificado.html');
 const elementToCapture = document.getElementById("body-certificado");

// botaoBaixar.addEventListener("click", function(){
    
//     html2canvas(certificado, {
//         allowTaint: true,
//      }).then((canvas) => {
//          document.body.append(canvas);
//      });
// });

//  function generatePDF(){

// //   html2canvas(document.querySelector("#body-certificado"))
//   const {jsPDF} = window.jspdf;
//   const content = document.getElementById("body-certificado");
//   const doc = new jsPDF();

//  doc.save("Certificado.pdf")


//  }

    //Conteúdo do PDF

    //Configuração do arquivo final do PDF
    // const options = {
    //     margin: [10, 10, 10, 10],
    //     filename: "Certificado.pdf",
    //     html2canvas: {scale: 2},
    //     jsPDF: {unit: "mm", format: "a4", orientation: "portrait"}
    // }

    //Gerar e baixar o PDF



    //Solução Lorenzo

    function configurarDownloadCertificado() {
  const botaoDownload = document.getElementById("botao-baixar");
  const certificado = document.getElementById("body-certificado");

  if (!botaoDownload || !certificado) {
    return;
  }

  botaoDownload.addEventListener("click", async function () {
    try {
      botaoDownload.disabled = true;

    //   const nomeUsuario =
    //     document.getElementById("certificadoNome")?.textContent || "aluno";

      const nomeArquivo = `Certificado.pdf`;

      const certificadoExportacao = certificado.cloneNode(true);
      certificadoExportacao.id = "certificadoParaDownloadExportacao";
      certificadoExportacao.classList.add("certificado-exportando");
      document.body.appendChild(certificadoExportacao);

      const canvas = await html2canvas(certificadoExportacao, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        width: certificadoExportacao.offsetWidth,
        height: certificadoExportacao.offsetHeight,
        windowWidth: certificadoExportacao.scrollWidth,
        windowHeight: certificadoExportacao.scrollHeight,
      });

      certificadoExportacao.remove();

      const jsPdf = window.jspdf?.jsPDF;

      if (!jsPdf) {
        throw new Error("Biblioteca jsPDF nao carregada.");
      }

      const pdf = new jsPdf({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const imagem = canvas.toDataURL("image/png");
      pdf.addImage(imagem, "PNG", 0, 0, 297, 210);
      pdf.save(nomeArquivo);
    } catch (error) {
      document.getElementById("certificadoParaDownloadExportacao")?.remove();
      console.error(error);
      mostrarAlerta("Não foi possível baixar o certificado.", "erro");
    } finally {
      botaoDownload.disabled = false;
    }
  });
}