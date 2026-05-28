//sidebar
const btnAltName = document.getElementById("alt-name");
const btnAltCpf = document.getElementById("alt-cpf");
const btnAltemail = document.getElementById("alt-email");
const btnAltPassword = document.getElementById("alt-password");
const btnAltPfp = document.getElementById("btn-pfp");
const btnOpenEdit = document.getElementById("btn-open-edit");
const btnEdit = document.getElementById("btn-save-edit");

const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const cpfInput = document.getElementById("cpf-input");
const passwordInput = document.getElementById("password-input");
const confPasswordInput = document.getElementById("conf-pasword-input");

const inputsHolder = document.getElementById("alts-holder");
const confHolder = document.getElementById("conf-password");


function resetEverything(){
    nameInput.disabled = true;
    emailInput.disabled = true;
    cpfInput.disabled = true;
    passwordInput.disabled = true;
    btnAltName.disabled = false;
    btnAltemail.disabled = false;
    btnAltCpf.disabled = false;
    btnAltPassword.disabled = false;
    btnOpenEdit.className = "btn-edit btn-open-edit-show";
    btnAltPfp.className = "btn-pfp-hide";
    confHolder.className = "field-hide" ;
    inputsHolder.className = "alts-holder-hide" ;
}

//event listeners dos botões
btnAltName.addEventListener("click",function(){
    nameInput.disabled = false;
    btnAltName.disabled = true;
})
btnAltemail.addEventListener("click",function(){
    emailInput.disabled = false;
    btnAltemail.disabled = true;
})
btnAltCpf.addEventListener("click",function(){
    cpfInput.disabled = false;
    btnAltCpf.disabled = true;
})
btnAltPassword.addEventListener("click",function(){
    confHolder.className = "field";
    passwordInput.disabled = false;
    btnAltPassword.disabled = true;
})
btnOpenEdit.addEventListener("click",function(){
    btnAltPfp.className = "btn-pfp"
    inputsHolder.className = "sidebar alts-holder-show";
    btnOpenEdit.className = "btn-open-edit-hide";
})
btnEdit.addEventListener("click", function(){ //substuir pela funcao de atualizar os dados de vdd
    resetEverything();// colocar isso no final da função pls
})

resetEverything();
