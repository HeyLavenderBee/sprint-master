const request = require("supertest");
const app = require("../app");
const pool = require("../database/db");
const { verifyToken } = require("../utils/jwt");
const authMiddleware = require("../middlewares/auth.middleware");
const { deleteUsuarioByCpf } = require("../repositories/test.repository"); 

let token = "";

afterAll(async () => {
    await pool.end();
});

describe("cadastro", () => {
    beforeEach(async () => {
        await deleteUsuarioByCpf("00100100111");
    });
    it("retorna status 201 caso cadastro seja feito", async () => {
        const response = await request(app).post("/api/usuarios").send({
            nome: "Jest Test", email: "jesttest@email.com", cpf: "00100100111", senha: "123456"
        });
        //para o teste dar certo, é preciso que a resposta tenha status 201
        //caso contrário, o teste falha
        expect(response.statusCode).toEqual(201);
    });
});


// === ATENÇÃO: para que não apareça testes falhos, apenas descomente o que for o seu teste ===

describe("login", () => {
    it("retorna status 200 caso login do usuário seja feito", async () => {
        const response = await request(app).post("/api/auth/login").send({
            cpf: "00100100111", senha: "123456"
        });
        //adiciona o token em uma variável no início do arquivo para poder usá-lo em outros testes
        token = response.body.token;

        expect(response.statusCode).toEqual(200);
    });
});


// === TESTES DE ATUALIZAR DADOS DO USUÁRIO ===

/*
//TODO: concluir aqui a função de testes
describe("atualizar cpf", () => {
    it("retorna status 200 caso cpf seja atualizado", async () => {
        const response = await request(app).patch("/api/usuarios/me").send({
            //campos de envio de acordo com a rota
        });
        expect(response.statusCode).toEqual(status);
    });
});
*/

/*
//TODO: concluir aqui a função de testes
describe("atualizar nome", () => {
    it("retorna status 200 caso cpf seja atualizado", async () => {
        const response = await request(app).patch("/api/usuarios/me").send({
            //campos de envio de acordo com a rota
        });
        expect(response.statusCode).toEqual(status);
    });
});
*/

/*
//TODO: concluir aqui a função de testes
describe("atualizar email", () => {
    it("retorna status 200 caso cpf seja atualizado", async () => {
        const response = await request(app).patch("/api/usuarios/me").send({
            //campos de envio de acordo com a rota
        });
        expect(response.statusCode).toEqual(status);
    });
});
*/

/*
//TODO: concluir aqui a função de testes
describe("atualizar senha", () => {
    it("retorna status 200 caso cpf seja atualizado", async () => {
        const response = await request(app).patch("/api/usuarios/me").send({
            //campos de envio de acordo com a rota
        });
        expect(response.statusCode).toEqual(status);
    });
});
*/

/*
//TODO: concluir aqui a função de testes para abranger duas atualizações simultaneamente
describe("atualizar email e senha", () => {
    it("retorna status 200 caso email e senha sejam atualizados", async () => {
        const response = await request(app).patch("/api/usuarios/me").send({
            //campos de envio de acordo com a rota
        });
        expect(response.statusCode).toEqual(status);
    });
});
*/


// === TESTES RELACIONADOS A QUESTIONÁRIO ===

describe("responder questão", () => {
    let idUsuario;
    let idExame;
    let idQuestao;
    //pega variáveis importantes antes de realizar o teste
    beforeEach(async () => {
        const responseQuestao = await request(app).get("/api/questoes/proxima-questao")
        .set('Authorization', `Bearer ${token}`)
        .send({token});

        idQuestao = await responseQuestao.body.id_questao;
        console.log("id questão: ", idQuestao)

        const response = await request(app).post("/api/usuarios/id-usuario")
        .set('Content-Type',  'application/json')
        .send({token});

        idUsuario = await response.body.id_usuario;

        const responseExame = await request(app).post("/api/usuarios/id-exame")
        .set('Content-Type',  'application/json')
        .send({idUsuario});

        idExame = await responseExame.body.id_exame;
    });
    it("retornar status 201 caso usuário responda a questão", async () => {
        const response = await request(app).post("/api/questoes/responder")
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type',  'application/json')
        .send({
            id_exame: idExame, id_questao: idQuestao, resposta: "c"
        });
        expect(response.statusCode).toEqual(201);
    });
});

/*
//TODO: concluir aqui a função de testes
describe("próximo módulo", () => {
    it("o que precisa retornar", async () => {
        const response = await request(app).post("").send({
            //campos de envio para uma questão ser respondida
        });
    });
});
*/

/*
//TODO: concluir aqui a função de testes
describe("próxima tentativa", () => {
    it("o que precisa retornar", async () => {
        const response = await request(app).post("").send({
            //campos de envio para uma questão ser respondida
        });
    });
});
*/
