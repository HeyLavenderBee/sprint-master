class Alerts {
  static layout(message) {
    return `
            <div id="alerts" class="box">
                <div class="window box">
                    <div class="w-100 box">
                        <div class="w-100 box-soon">
                            <img src="/assets/img/scrum-master-logo-circle.png" alt="SM" class="icon-sm">
                            <span class="text-SM">Scrum Master</span>
                        </div>
                    </div>
                    <div class="w-100 box">
                        <div class="w-100 box">  
                            <img src="/assets/img/alerta.png" alt="Alerta" class="icon-alert">
                        </div>
                        <span class="text">${message}</span>
                    </div>
                    <div class="w-100 box align-end">
                        <button class="btn-ok margin" onclick="Alerts.remove();">Ok</button>
                    </div>
                </div>
            </div>
        `;
  }

 // Exibe o alerta na tela, verificando se a mensagem e o elemento já existem
  static set(message) {
    if (!message) return;  // Valida se há mensagem a exibir
    if (document.querySelector("#alerts")) return; // Previne múltiplos alertas simultâneos
    document.body.insertAdjacentHTML("beforeend", this.layout(message)); // Insere o alerta no final do body
  }

  static remove() {
    const isAlerts = document.querySelector("#alerts");  // A variável alertExists busca se já existe um elemento com o ID 'alerts'.
    if (isAlerts) isAlerts.remove(); // Se ele já existir, a função remove o alerta, funcionando como uma trava de segurança.
  }
}

// A função Verificacao serve para gerenciar a exibição dos alertas na tela.
class Verificacao {
  static layout(message) {
    return `
            <div id="alerts" class="box">
                <div class="window box">
                    <div class="w-100 box">
                        <div class="w-100 box-soon">
                            <img src="/assets/img/scrum-master-logo-circle.png" alt="SM" class="icon-sm">
                            <span class="text-SM">Scrum Master</span>
                        </div>
                    </div>
                    <div class="w-100 box">
                        <div class="w-100 box">  
                            <img src="/assets/img/verificacao.png" alt="Verificação" class="icon-alert">
                        </div>
                        <span class="text">${message}</span>
                    </div>
                    <div class="w-100 box align-end">
                        <button class="btn-ok margin" onclick="Verificacao.remove();">Ok</button>
                    </div>
                </div>
            </div>
        `;
  }

  static set(message) {
    if (!message) return;
    if (document.querySelector("#alerts")) return;
    document.body.insertAdjacentHTML("beforeend", this.layout(message));
  }

  static remove() {
    const isAlerts = document.querySelector("#alerts");
    if (isAlerts) isAlerts.remove();
  }

  // Essas duas últimas statics fazem as mesmas ações que as de cima, antes da classe de Verificação.
}
