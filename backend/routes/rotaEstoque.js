const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
// sqlite3 tipo de banco de dados vou criar
const db = new sqlite3.Database("database.db");
 //db criar um banco de dados

db.run(`CREATE TABLE IF NOT EXISTS
 estoque ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produto INT,
    quantidade Real,
    valor_unitario Real,
    Totsl Real
    )
   `
    , (createTableError)=> {
        if (createTableError) {
         
          
        }
    });

//consultar todos os dados
router.get("/",(req,res,next)=>{
  db.all('SELECT * FROM estoque', (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        })
    }
    res.status(200).send({
      mensagem: "Aqui está a lista de todo o estoque",
      usuarios: rows  
    })

    })
    
})

    
//consultar apenas um estoque pelo id
router.get("/:id",(req,res,next)=>{
    const {id} = req.params;
    db.get('SELECT * FROM estoque where id=?',[id], (error, rows) => {
      if (error) {
          return res.status(500).send({
              error: error.message
          })
      }
      res.status(200).send({
        mensagem: "Aqui está o cadastro do Estoque",
        usuarios: rows  
      })
  
    })
      
  })
  
  //const salvar=()=> {} (esta seta => é o mesmo que usar o nome function)
  //function salvardados(){}

 // aqui salvamos dados do estoque
router.post("/",(req,res,next)=>{
     const {id_produto,quantidade,valor_unitario,total} 
     = req.body;
    db.serialize(()=> {
        const insertEstoque = db.prepare(`
        INSERT INTO estoque(id_produto,quantidade,valor_unitario,)VALUES(?,?,?,)`);
        insertEstoque.run(id_produto,quantidade,valor_unitario);
        insertEstoque.finalize();
    })
    process.on("SIGINT",() => {
        db.close((err)=> {
          if (err) {
            return res.status(304).send(err.message);
          }
        })
    })
    res.status(200)
    .send({ mensagem: "Estoque salvo com sucesso!"});
});

// aqui podemos alterar dados do estoque
router.put("/",(req,res,next)=>{
   const {id,id_produto,quantidade,valor_unitario} = req.body;
   db.run(`Update produto SET 
           id_produto=?,
           quantidade=?, 
           valor_unitario=? 
       where id=?`,[id_produto,quantidade,valor_unitario,id], (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        })
    } res.status(200).send(
      {mensagem: "Dados do Estoque salvos com sucesso"});
  })
  //posso colocar na mensagem "estoque de descrição:"+descricao+" de id:"+id+" dados alterados com sucesso"
});
 // Aqui podemos deletar o cadastro de um estoque por meio do id
router.delete("/:id",(req,res,next)=>{
  const {id} = req.params
  db.run('DELETE FROM estoque where id=?',[id], (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        })
    } res.status(200).send(
      {mensagem: "Dados do estoque deletado com sucesso"});
  })
  

});
module.exports = router;