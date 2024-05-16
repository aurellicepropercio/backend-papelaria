const express = require('express')
const app = express();
const usuario=[
    {nome:'carlos', idade:'20', peso:'100'},
    {nome:'pedro', idade:'30'},
    {nome:'joao', idade:'18', peso: '75', cep: '77807060'}
]
app.use("/todos",(req, res, next)=>{
    res.send(usuario)
})

app.use("/nome",(req, res, next)=>{
    res.send(usuario[1].nome)
})
app.use("/cep",(req, res, next)=>{
    res.send(cep)
})

app.use("/soma",(req, res, next)=>{ total=0;
    let toal=0;
    for(i=0;  i<usuario.length;  i++)
    {
     total=total+parseInt(usuario[i].idade)
    }
    res.send("Soma total: "+total);
})
module.exports = app