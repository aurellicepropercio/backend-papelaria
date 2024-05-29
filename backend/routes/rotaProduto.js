const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
// sqlite3 tipo de banco de dados vou criar
const db = new sqlite3.Database("database.db");
 //db criar um banco de dados
const usuarios=["joao", "pedro"]
db.run(`CREATE TABLE IF NOT EXISTS
 ´roduto ( 
    id INTERGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT,
    estoque_minimo INT,
    estoque_maximo INT)`
    , (createTableError)=> {
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
  db.all('SELECT * FROM produto', (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        })
    }
    res.status(200).send({
      mensagem: "Aqui eta a lista de todos os Produtos",
      usuarios: rows  
    })

    })
    
})

    
//consultar apenas um produto pelo id
router.get("/:id",(req,res,next)=>{
    const {id} = req.params;
    db.get('SELECT * FROM produto where id=?',[id], (error, rows) => {
      if (error) {
          return res.status(500).send({
              error: error.message
          })
      }
      res.status(200).send({
        mensagem: "Aqui está o cadastro do Produto",
        usuarios: rows  
      })
  
    })
      
  })
  
  //const salvar=()=> {} (esta seta => é o mesmo que usar o nome function)
  //function salvardados(){}

 // aqui salvamos dados do produto
router.post("/",(req,res,next)=>{
     const {descricao,estoque_minimo,estoque_maximo} 
     = req.body;
    db.serialize(()=> {
        const insertProduto = db.prepare(`
        INSERT INTO produto(descricao,estoque_minimo,estoque_maximo)VALUES(?,?,?)`);
        insertProduto.run(descricao,estoque_minimo,estoque_maximo);
        insertProduto.finalize();
    })
    process.on("SIGINT",() => {
        db.close((err)=> {
          if (err) {
            return res.status(304).send(err.message);
          }
        })
    })
    res.status(200)
    .send({ mensagem: "Produto salvo com sucesso!"});
});

// aqui podemos alterar dados do produto
router.put("/",(req,res,next)=>{
   const {id,descricao,estoque_minimo,estoque_maximo} = req.body;
   db.run(`Update produto SET 
        descicao=?,
        estoque_minimo=?, 
        estoque_maximo=? 
        where id=?`,[descricao,estoque_minimo,estoque_maximo,id], (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        })
    } res.status(200).send(
      {mensagem: "Produto de id: "+id+" deletado com sucesso"});
  })
  //posso colocar na mensagem "Produto de descrição:"+descricao+" de id:"+id+" dados alterados com sucesso"
});
 // Aqui podemos deletar o cadastro de um produto por meio do id
router.delete("/:id",(req,res,next)=>{
  const {id} = req.params
  db.run('DELETE FROM produtos where id=?',[id], (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        })
    } res.status(200).send(
      {mensagem: "Produto de id: "+id+" deletado com sucesso"});
  })
  

});
module.exports = router;