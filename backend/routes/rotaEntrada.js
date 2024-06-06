const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
// sqlite3 tipo de banco de dados vou criar
const db = new sqlite3.Database("database.db");
 //db criar um banco de dados

db.run(`CREATE TABLE IF NOT EXISTS
 entrada ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produto INT,
    quantidade Real ,
    valor_unitário Real,
    data_entrada date
    )`
    , (createTableError)=> {
        if (createTableError) {
        
        }
    });

//consultar todos os dados
router.get("/",(req,res,next)=>{
  db.all('SELECT * FROM entrada', (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        })
    }
    res.status(200).send({
      mensagem: "Aqui está a lista da entrada",
      usuarios: rows  
    });

    });
    
});

    
//consultar apenas um produto pelo id
router.get("/:id",(req,res,next)=>{
    const {id} = req.params;
    db.get('SELECT * FROM entrada where id=?',[id], (error, rows) => {
      if (error) {
          return res.status(500).send({
              error: error.message
          })
      }
      res.status(200)
      .send({mensagem: "Aqui está o cadastro da entrada",
        usuarios: rows  
      })
  
    })
      
  })
  
  //const salvar=()=> {} (esta seta => é o mesmo que usar o nome function)
  //function salvardados(){}

 // aqui salvamos dados de entrada
router.post("/",(req,res,next)=>{
     const {id_produto,quantidade,valor_unitario,data_entrada} 
     = req.body;
    db.serialize(()=> {
        const insertEntrada = db.prepare(`
        INSERT INTO entrada(id_produto,quantidade,valor_unitario,data_entrada)VALUES(?,?,?,?)`);
        insertEntrada.run(id_produto, quantidade, valor_unitario, data_entrada);
        insertEntrada.finalize();
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
    .send({ mensagem: "Entrada salvo com sucesso!"})
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
      const quantidadeatualizada=parseFloat(quantidade)+parseFloat(quantidadeestoque);
      db.serialize(()=> {
        //parsefloat para dizer que essa variavel é um valor numericos e não uma palavra
        //ex:parseFloat(quantidade)+parseFloat(quantidadeestoque),ou quando vou usar  numeros fracionados ex: 1,000 ,o,1
        //intfloat quando usar valor numerico inteiro ex: 1 ,2 ,3...
        //update é pra alterar o que já existe
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

// aqui podemos alterar dados do entrads
router.put("/",(req,res,next)=>{
   const {id,id_produto,quantidade,valor_unitario,data_entrada} = req.body;
   db.run(`Update entrada SET 
        ID_produto=?,
        quantidade=?, 
        valor_unitario=?, 
        data_entrada=?,
        where id=?`,[id_produto,quantidade,valor_unitario,data_entrada,id], (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        })
    } res.status(200).send(
      {mensagem: "Dados da Entrada salvos com sucesso"});
  });
  //posso colocar na mensagem "Produto de descrição:"+descricao+" de id:"+id+" dados alterados com sucesso"
});
 // Aqui podemos deletar o cadastro de um produto por meio do id
router.delete("/:id",(req,res,next)=>{
  const {id} = req.params
  db.run('DELETE FROM entrada where id=?',[id], (error, rows) => {
    if (error) {
        return res.status(500).send({
            error: error.message
        })
    } res.status(200).send(
      {mensagem: "entrada deletada com sucesso!"});
  })
  

});
module.exports = router;