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
},
]
//consultar todos os dados
router.get("/",(req,res,next)=>{
  db.all('SELECT * FROM usuario', (error, rows) => {
    if (error) {
        return res.status(500)({
            error: error.message
        });
    }
    }
  )
    
})

// aqui salvamos dados do usuário
router.post("/",(req,res,next)=>{

 
});

// aqui podemos alterar dados do usuário
router.put("/",(req,res,next)=>{

});
 // Aqui podemos deletar o cadastro de um usuário por meio do id
router.delete("/:id",(req,res,next)=>{

});
module.exports = router;