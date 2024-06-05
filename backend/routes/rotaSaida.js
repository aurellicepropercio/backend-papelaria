const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
// sqlite3 tipo de banco de dados vou criar
const db = new sqlite3.Database("database.db");
 //db criar um banco de dados

db.run(`CREATE TABLE IF NOT EXISTS
 ´saida ( 
    id INTERGER PRIMARY KEY AUTOINCREMENT,
    id_produto INT,
    quantidade Real,
    valor_unitário)real,
    data_saida`
    , (createTableError)=> {
        if (createTableError) {
            return res.status(500).send({
                error: createTableError.message
            });
        }
    });

//consultar todos os dados
router.get("/",(req,res,next)=>{
  db.all('SELECT * FROM saida', (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        })
    }
    res.status(200).send({
      mensagem: "Aqui está a lista da saida",
      usuarios: rows  
    })

    })
    
})

    
//consultar apenas um produto pelo id
router.get("/:id",(req,res,next)=>{
    const {id} = req.params;
    db.get('SELECT * FROM saida where id=?',[id], (error, rows) => {
      if (error) {
          return res.status(500).send({
              error: error.message
          })
      }
      res.status(200).send({
        mensagem: "Aqui está o cadastro de saida",
        usuarios: rows  
      })
  
    })
      
  })
  
  //const salvar=()=> {} (esta seta => é o mesmo que usar o nome function)
  //function salvardados(){}

 // aqui salvamos dados do produto
router.post("/",(req,res,next)=>{
     const {id_produto,quantidade,valor_unitario,data_saida} 
     = req.body;
    db.serialize(()=> {
        const insertSaida = db.prepare(`
        INSERT INTO produto(id_produto,quantidade,valor_unitario,data_saida)VALUES(?,?,?,?)`);
        insertSaida.run(id_produto,quantidade,valor_unitario,data_saida);
        insertSaida.finalize();
    })
    process.on("SIGINT",() => {
        db.close((err)=> {
          if (err) {
            return res.status(304).send(err.message);
          }
        })
    })
    res.status(200)
    .send({ mensagem: "Saida salvo com sucesso!"});
});

// aqui podemos alterar dados do produto
router.put("/",(req,res,next)=>{
   const {id,id_produto,quantidade,valor_unitario,data_saida} = req.body;
   db.run(`Update saida SET 
        ID_produto=?,
        quantidade=?, 
        valor_unitario=? 
        data_saida=? 
        where id=?`,[id_produto,quantidade,valor_unitario,data_saida,id], (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        })
    } res.status(200).send(
      {mensagem: "Dados da saida salvos com sucesso"});
  })
  //posso colocar na mensagem "Produto de descrição:"+descricao+" de id:"+id+" dados alterados com sucesso"
});
 // Aqui podemos deletar o cadastro de um produto por meio do id
router.delete("/:id",(req,res,next)=>{
  const {id} = req.params
  db.run('DELETE FROM saida where id=?',[id], (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        })
    } res.status(200).send(
      {mensagem: "Dados da saida deletado com sucesso"});
  })
  

});
module.exports = router;