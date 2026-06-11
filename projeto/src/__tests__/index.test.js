const request = require("supertest");
const app = require("../app");
const pool = require("../database/db");
const { verifyToken } = require("../utils/jwt");
const authMiddleware = require("../middlewares/auth.middleware");
const { deleteUsuarioByCpf } = require("../repositories/test.repository"); 

let token = "";
const alternativasCorretas = [
  "b", "b", "c", "d", "b", "b", "c", "c", "b", "c", // questões 1-10
  "c", "a", "c", "b", "b", "b", "b", "c", "c", "c", // questões 11-20
  "c", "b", "b", "c", "b", "c", "b", "b", "c", "c", // questões 21-30
  "b", "b", "b", "c", "c", "c", "c", "c", "c", "b", // questões 31-40
  "b", "a", "c", "b", "c", "b", "b", "b", "b", "b", // questões 41-50
  "c", "c", "b", "b", "b", "b", "c", "c", "c", "b", // questões 51-60
];

afterAll(async () => {
    await pool.end();
});

describe("cadastro", () => {
    beforeEach(async () => {
        await deleteUsuarioByCpf("00100100111");
    });
    it("retorna status 201 caso cadastro seja feito", async () => {
        const response = await request(app).post("/api/usuarios").send({
            nome: "Jest Test", email: "jesttest@test.com", cpf: "00100100111", senha: "123456"
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

describe("atualizar cpf", () => {
    it("retorna status 200 caso cpf seja atualizado", async () => {
        const response = await request(app).patch("/api/usuarios/me")
        .set('Authorization', `Bearer ${token}`)
        .send({
            cpf: "00100100112"
        });
        const response2 = await request(app).patch("/api/usuarios/me")
        .set('Authorization', `Bearer ${token}`)
        .send({
            cpf: "00100100111"
        });
        expect(response2.statusCode).toEqual(200);
    });
});

describe("atualizar nome", () => {
    it("retorna status 200 caso nome seja atualizado", async () => {
        const response = await request(app).patch("/api/usuarios/me")
        .set('Authorization', `Bearer ${token}`)
        .send({
            nome: "Super Test"
        });
        expect(response.statusCode).toEqual(200);
    });
});

describe("atualizar email", () => {
    it("retorna status 200 caso email seja atualizado", async () => {
        const response = await request(app).patch("/api/usuarios/me")
        .set('Authorization', `Bearer ${token}`)
        .send({
            email: "supertest@test.com"
        });
        expect(response.statusCode).toEqual(200);
    });
});

describe("atualizar senha", () => {
    it("retorna status 200 caso senha seja atualizado", async () => {
        const response = await request(app).patch("/api/usuarios/me")
        .set('Authorization', `Bearer ${token}`)
        .send({
            senha: "234567"
        });
        expect(response.statusCode).toEqual(200);
    });
});

describe("atualizar email e senha", () => {
    it("retorna status 200 caso email e senha sejam atualizados", async () => {
        const response = await request(app).patch("/api/usuarios/me")
        .set('Authorization', `Bearer ${token}`)
        .send({
            email: "test@test.com",
            senha: "345678"
        });
        expect(response.statusCode).toEqual(200);
    });
});



// === TESTES RELACIONADOS A QUESTIONÁRIO ===

describe("responder questão", () => {
    let idUsuario;
    let idExame;
    let idQuestao;
    let alternativa;
    //pega variáveis importantes antes de realizar o teste
    beforeEach(async () => {
        const responseQuestao = await request(app).get("/api/questoes/proxima-questao")
        .set('Authorization', `Bearer ${token}`)
        .send({token});

        idQuestao = await responseQuestao.body.id_questao;

        const response = await request(app).post("/api/usuarios/id-usuario")
        .set('Content-Type',  'application/json')
        .send({token});

        idUsuario = await response.body.id_usuario;

        const responseExame = await request(app).post("/api/usuarios/id-exame")
        .set('Content-Type',  'application/json')
        .send({idUsuario});

        idExame = await responseExame.body.id_exame;

        alternativa = alternativasCorretas[idQuestao-1]
    });
    it("retornar status 201 caso usuário responda a questão", async () => {
        const response = await request(app).post("/api/questoes/responder")
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type',  'application/json')
        .send({
            id_exame: idExame, id_questao: idQuestao, resposta: alternativa
        });
        expect(response.statusCode).toEqual(201);
    }); 
});

//TODO: concluir aqui a função de testes
describe("próximo módulo", () => {
    beforeEach(async () => {
        for(let i = 0; i < 9; i++){
            const responseQuestao = await request(app).get("/api/questoes/proxima-questao")
            .set('Authorization', `Bearer ${token}`)
            .send({token});

            idQuestao = await responseQuestao.body.id_questao;

            const response = await request(app).post("/api/usuarios/id-usuario")
            .set('Content-Type',  'application/json')
            .send({token});

            idUsuario = await response.body.id_usuario;

            const responseExame = await request(app).post("/api/usuarios/id-exame")
            .set('Content-Type',  'application/json')
            .send({idUsuario});

            idExame = await responseExame.body.id_exame;

            var alternativa = alternativasCorretas[idQuestao-1]

            const responseFinal = await request(app).post("/api/questoes/responder")
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type',  'application/json')
            .send({
                id_exame: idExame, id_questao: idQuestao, resposta: alternativa
            });
        }
    })
    it("retornar status 200 caso usuário acesse o próximo módulo", async () => {
        const response = await request(app).patch("/api/questoes/proximo-modulo")
        .set('Authorization', `Bearer ${token}`)
        expect(response.statusCode).toEqual(200);
    });
});

//TODO: concluir aqui a função de testes
describe("próxima tentativa", () => {
    beforeEach(async () => {
        for(let i = 0; i < 10; i++){
            const responseQuestao = await request(app).get("/api/questoes/proxima-questao")
            .set('Authorization', `Bearer ${token}`)
            .send({token});

            idQuestao = await responseQuestao.body.id_questao;

            const response = await request(app).post("/api/usuarios/id-usuario")
            .set('Content-Type',  'application/json')
            .send({token});

            idUsuario = await response.body.id_usuario;

            const responseExame = await request(app).post("/api/usuarios/id-exame")
            .set('Content-Type',  'application/json')
            .send({idUsuario});

            idExame = await responseExame.body.id_exame;

            var alternativa = alternativasCorretas[idQuestao-1]

            const responseFinal = await request(app).post("/api/questoes/responder")
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type',  'application/json')
            .send({
                id_exame: idExame, id_questao: idQuestao, resposta: alternativa
            });
        }
    });
    it("retornar status 200 caso usuário acesse a próxima tentativa", async () => {
        const response = await request(app).patch("/api/questoes/proxima-tentativa")
        .set('Authorization', `Bearer ${token}`)
        expect(response.statusCode).toEqual(200);
    });
});
