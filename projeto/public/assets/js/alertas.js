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

  static set(message) {
    if (!message) return;
    if (document.querySelector("#alerts")) return;
    document.body.insertAdjacentHTML("beforeend", this.layout(message));
  }

  static remove() {
    const isAlerts = document.querySelector("#alerts");
    if (isAlerts) isAlerts.remove();
  }
}

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
}
