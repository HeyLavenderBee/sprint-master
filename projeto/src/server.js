const app = require("./app");
//colocar require do env aqui 

const PORT = process.env.PORT;

app.listen(PORT,function(){
    console.log(`Rodando em http://localhost:${PORT}`);
});
