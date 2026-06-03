import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const botaoBaixar = document.getElementById("button-baixar");
const botaoAbrir = document.getElementById("button-abrir");
const botaoImprimir = document.getElementById("button-imprimir");

function generatePDF(){
html2canvas(document.querySelector("#body-certificado"))
const {jsPDF} = window.jspdf;
 const content = document.getElementById("body-certificado");
const doc = new jsPDF(content);

doc.save("Certificado.pdf")






}

    //Conteúdo do PDF

    //Configuração do arquivo final do PDF
    // const options = {
    //     margin: [10, 10, 10, 10],
    //     filename: "Certificado.pdf",
    //     html2canvas: {scale: 2},
    //     jsPDF: {unit: "mm", format: "a4", orientation: "portrait"}
    // }

    //Gerar e baixar o PDF