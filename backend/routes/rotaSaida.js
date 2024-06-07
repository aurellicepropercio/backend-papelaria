const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
// sqlite3 tipo de banco de dados vou criar
const db = new sqlite3.Database("database.db");
 //db criar um banco de dados
db.run(`CREATE TABLE IF NOT EXISTS
 saida ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produto INT,
    quantidade Real ,
    valor_unitário Real,
    data_saida Date
    )`
    , (createTableError)=> {
        if (createTableError) {
        return res.status(500).send({
         error: createTableError.message 
        });
        }
    });

//consultar todos os dados
router.get("/",(req,res,next)=>{
  const {id} = req.params;
  db.all('SELECT * FROM saida where id=?', [id], (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        });
    }
    res.status(200).send({
      mensagem: "Aqui está o cadastro da Saída",
      saida: rows  
    });

    });
    
})
 
// aqui salvamos dados da saida
router.post("/",(req,res,next)=>{
  const { id_produto, quantidade, valor_unitario,data_saida}
= req.body;
db.serialize(() => {
  const insertSaida = db.prepare(`
  INSRT INTO saida(id_produto, quantidade, valor_unitario, data_saida)
  VALUES(?,?,?,?)`);
  insertSaida.run(id_produto,quantidade, valor_unitario,data_saida);
  insertSaida.finalize();
});
  
   atualizarestoque(id_produto,quantidade)
  
   process.on("SIGINT",() => {
    db.close((err)=> {
      if (err) {
        return res.status(304).send(err.message);
      }
    });
});

 res.status(200)
 .send({ mensagem: "Entrada salvo com sucesso!"});
});

function atualizarestoque(id_produto,quantidade,valor_unitario){
  
  db.get('SELECT * FROM estoque where id_produto=?',
  [id_produto], (error, rows) =>{
    if (error) {
        return res.status(500).send({
            error: error.message
        });
    }
  
    if(rows ){
    //atualizar a quantidade no estoque
    //acrescentando a quantidade inserida em entrada 1
     
    const quantidadeestoque=rows.quantidade;
    if (quantidadeestoque<quantidade || quantidadeestoque===0){
      return res.status(404).send({
        mensagem: "Quantidade é menor que a quantidade no estoque"
      });
    }
    
    const quantidadeatualizada=parseFloat(quantidadeestoque-quantidade);
    db.serialize(()=> {
      //const total = quantidde*valor_unitario
      const updateEstoque = db.prepare(`
     UPDATE estoque SET quantidade=?,
      valor_unitario=? where id_produto=?`);
      updateEstoque.run(quantidadeatualizada, valor_unitario, id_produto);
      updateEstoque.finalize();
  });
 }else{
  //produto nao encontrado
  return res.status(404).send({
    mensagem: "Produto nao foi encontrado noestoque"
    });
  }
   
// aqui podemos alterar dados da saida
router.put("/",(req,res,next)=>{
  const {id,id_produto,quantidade,valor_unitario,data_saida} = req.body;
  db.run(`Update saida SET 
       ID_produto=?,
       quantidade=?, 
       valor_unitario=?, 
       data_saida=?,
       where id=?`,[id_produto,quantidade,valor_unitario,data_saida,id],
        (error, rows) => {
   if (error) {
       return res.status(500).send({
           error: error.message
       })
   } res.status(200).send(
     {mensagem: "Dados da Saida salvos com sucesso!"
   });
 });


  //consultar apenas um produto pelo id
router.get("/:id",(req,res,next)=>{
    const {id} = req.params;
    db.get('SELECT * FROM saida where id=?',[id], (error, rows) => {
      if (error) {
          return res.status(500).send({
              error: error.message
          })
      }
      res.status(200)
      .send({mensagem: "Aqui está o cadastro da saida",
        usuarios: rows  
      })
  
    })
      
  })
  
  //const salvar=()=> {} (esta seta => é o mesmo que usar o nome function)
  //function salvardados(){}

 // aqui salvamos dados de entrada
router.post("/",(req,res,next)=>{
     const {id_produto,quantidade,valor_unitario,data_saida} 
     = req.body;
    db.serialize(()=> {
        const insertSaida = db.prepare(`
        INSERT INTO saida(id_produto,quantidade,valor_unitario,data_saida)VALUES(?,?,?,?)`);
        insertSaida.run(id_produto, quantidade, valor_unitario, data_saida);
        insertSaida.finalize();
    });
    
    atualizarestoque(id_produto,quantidade,valor_unitario);
    
    process.on("SIGINT",() => {
        db.close((err)=> {
          if (err) {
            return res.status(304).send(err.message);
          }
        });
    });
 
    res.status(200)
    .send({ mensagem: "Saida salvo com sucesso!"})
  })

  function atualizarestoque(id_produto,quantidade,valor_unitario){
    db.get('SELECT * FROM estoque where id_produto=?',[id_produto], (error, rows) => {
      if (error) {
          return res.status(500).send({
              error: error.message
          })
      }
    if(rows ){
      //atualizar a quantidade no estoque
      //acrescentando a quantidade inserida em entrada 1
       
      const quantidadeestoque=rows.quantidade;
      if (quantidadeestoque<quantidade || quantidadeestoque===0){
        return res.status(404).send({
          mensagem: "Quantidade é menor que a quantidade no estoque"
        });
      }
      
      const quantidadeatualizada=parseFloat(quantidadeestoque-quantidade);
      db.serialize(()=> {
        //const total = quantidde*valor_unitario
        const updateEstoque = db.prepare(`
       UPDATE estoque SET quantidade=?,
        valor_unitario=? where id_produto=?`);
        updateEstoque.run(quantidadeatualizada, valor_unitario, id_produto);
        updateEstoque.finalize();
    })
      
    }else{
      //inserir a mesma quantidade inserida em entrada
      db.serialize(()=> {
        const insertEstoque = db.prepare(`
        INSERT INTO estoque(id_produto,quantidade,valor_unitario)
        VALUES(?,?,?)`);
        insertEstoque.run(id_produto, quantidade, valor_unitario);
        insertEstoque.finalize();
    });
    }
  
    });
  }

// aqui podemos alterar dados da saida
router.put("/",(req,res,next)=>{
   const {id,id_produto,quantidade,valor_unitario,data_saida} = req.body;
   db.run(`Update saida SET 
        ID_produto=?,
        quantidade=?, 
        valor_unitario=?, 
        data_saida=?,
        where id=?`,[id_produto,quantidade,valor_unitario,data_saida,id],
         (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        })
    } res.status(200).send(
      {mensagem: "Dados da Saida salvos com sucesso!"
    });
  });
  //posso colocar na mensagem "Produto de descrição:"+descricao+" de id:"+id+" dados alterados com sucesso"
});
 // Aqui podemos deletar o cadastro de um produto por meio do id
router.delete("/:id",(req,res,next)=>{
  const {id} = req.params
  db.run('DELETE FROM saida where id=?',[id], (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        });
    }
    res.status(200).send(
      {mensagem: "saida deletada com sucesso!"
      });
  });
  

});
module.exports = router;