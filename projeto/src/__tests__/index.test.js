const request = require("supertest");
const app = require("../app");
const pool = require("../database/db");
const { deleteUsuarioByCpf } = require("../repositories/test.repository"); 

afterAll(async () => {
    await pool.end();
});

describe("register", () => {
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

// ATENÇÃO: para que não apareça testes falhos, apenas descomente o que for o seu teste

/*
//TODO: concluir aqui a função de testes
describe("login", () => {
    it("retorna status 200 caso login do usuário seja feito", async () => {
        const response = await request(app).post("/api/auth/login").send({
            //campos de envio com base no usuário cadastrado
        });
    });
    expect(response.statusCode).toEqual(200);
});
*/

/*
//TODO: concluir aqui a função de testes
describe("responder questão", () => {
    it("o que precisa retornar", async () => {
        const response = await request(app).post("api/auth/login").send({
            //campos de envio para uma questão ser respondida
        });
    });
    expect(response.statusCode).toEqual(200);
});
*/

/*
//TODO: concluir aqui a função de testes
describe("próximo módulo")
*/
