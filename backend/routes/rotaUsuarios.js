const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");
const usuarios=["joao", "pedro"]
db.run(`CREATE TABLE IF NOT EXISTS
 usuarios ( id INTERGER PRIMARY KEY AUTOINCREMENT,
    nome text,
    email text,
    senha text)`, (createTableError)=> {
        if (createTableError) {
            return res.status(500).send({
                error: createTableError.message
            });
        }
    });
const usuario=[
{
    id:'1',
    nome:"Joao"
},
{
    id:2,
    nome:"pedro"
}
]
//consultar todos os dados
router.get("/",(req,res,next)=>{
  db.all('SELECT * FROM usuarios', (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        })
    }
    res.status(200).send({
      mensagem: "Aqui eta a lista de todos os usuarios",
      usuarios: rows  
    })

    })
    
})


router.get("/:id",(req,res,next)=>{
    const {id} = req.params;
    db.get('SELECT * FROM usuarios where id=?',[id], (error, rows) => {
      if (error) {
          return res.status(500).send({
              error: error.message
          })
      }
      res.status(200).send({
        mensagem: "Aqui está o cadastro do usuarios",
        usuarios: rows  
      })
  
    })
      
  })
  
  //const salvar=()=> {} (esta seta => é o mesmo que usar o nome function)
  //function salvardados(){}

 // aqui salvamos dados do usuário
router.post("/",(req,res,next)=>{
     const {nome,email,senha} = req.body;
    db.serialize(()=> {
        const insertUsuario = db.prepare(`
        INSERT INTO usuarios(nome, email, senha)VALUES(?,?,?)`);
        insertUsuario.run(nome, email,senha);
        insertUsuario.finalize();
    })
    process.on("SIGINT",() => {
        db.close((err)=> {
          if (err) {
            return res.status(304).send(err.message);
          }
        })
    })
    res.status(200)
    .send({ mensagem: "Usuario salvo com sucesso"});
});

// aqui podemos alterar dados do usuário
router.put("/",(req,res,next)=>{

});
 // Aqui podemos deletar o cadastro de um usuário por meio do id
router.delete("/:id",(req,res,next)=>{

});
module.exports = router;