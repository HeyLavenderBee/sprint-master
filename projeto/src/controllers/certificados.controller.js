const {
    findCertificadoByHash,
} = require("../services/certificados.service")

async function getCertificadoByHashController(req, res) {
    const certificadoHash = String(req.params.hash || "").trim();
    
      if (!certificadoHash) {
        return res.status(400).json({
          message: "Hash do certificado obrigatório",
        });
      }
    
      try {
        const certificado = await findCertificadoByHash(certificadoHash);
    
        if (!certificado) {
          return res.status(404).json({
            message: "Certificado inexistente para o hash informado",
          });
        }
    
        if (certificado.indisponivel) {
          return res.status(409).json({
            message: certificado.motivo,
          });
        }
    
        return res.status(200).json(certificado);
        console.log(certificado);
      } catch (e) {
        console.log(e.message)
        return res.status(500).json({
          message: "Erro interno do servidor",
        });
      }   
}

module.exports = {
    getCertificadoByHashController,
};