const express = require('express')
const app = express();
const cep = [
    
    {
        "cep": "01001-000",
        "logradouro": "Praça da Sé",
        "complemento": "lado ímpar",
        "bairro": "Sé",
        "localidade": "São Paulo",
        "uf": "SP",
        "ibge": "3550308",
        "gia": "1004",
        "ddd": "11",
        "siafi": "7107"
      },
      {
        "cep": "77824-120",
        "logradouro": "Rua Tietê",
        "complemento": "",
        "bairro": "Loteamento Panorama",
        "localidade": "Araguaína",
        "uf": "TO",
        "ibge": "1702109",
        "gia": "",
        "ddd": "63",
        "siafi": "9241"
      }
]
const usuario=[
    {nome:'carlos', idade:'20', peso:'100'},
    {nome:'pedro', idade:'30'},
    {nome:'joao', idade:'18', peso: '75', cep: '77807060'}
]
const alunos=["ana silva","carlos oliveira","marina santos","rafaela costa"]
alunos[1]
const mat={'idaluno':'1','idcurso':'3'}
const maticula=[
    {'idaluno':'1','idcurso':'3'},
    {'idaluno':'3','idcurso':'5'}


]
const cursos=[
    'eletricista de manutenção industrial',
    'mecanico de usinagem',
    'tecnico em automação industrial',
    'soldador de esteuturas metalicas',
    'tecnico em eletroeletronica',
    'operador de maquinas cnd'
    
    ]
app.use("/matricula/:id",(req, res, next)=>{
    const id=req.params.id;
    const nome=alunos[id]
    const dados = matricula.filter(linha => (linha.idaluno == id))
    const nomecurso = cursos[dados.idcurso]
    const resposta= {
        idaluno:id,
        nomedoaluno:nome,
        cursomatriculado:nomecurso,
        idmatricula:
        mensagem:"Dados da Matrícula"
    }
    res.send(resposta)

})
app.use("/todos",(req, res, next)=>{
    res.send(usuario)
})

app.use("/cep/:endereco",(req, res, next)=>{
    const endereco = cep.filter(enderecos => (enderecos.cep == "77824-120"))
    res.send(endereco)
})

app.use("/viacep/:valor",(req, res, next)=>{
    const valor=req.params.valor;
    const resultado="";
fetch("https\;//viacep.com.br/ws/"+valor+"/json").then(resposta=>
     
     resposta.jason()
     //"cep,logradouro, localidade"
).then(data=>{const dados={
    cep:data.cep,
    logradouro:data,logradouro,
    localidade:data,localidade
}
 res.send(dad0s)   
    
})

})

    app.use("/cep/:valor",(req, res, next)=>{
    const valor=req.params.valor
    // console.log(valor) é bom para ver o valor que tem dentro da variavel no terminal
    res.send(valor)
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