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

const alunos=[
    "ana silva",
    "carlos oliveira",
    "marina santos",
    "rafaela costa",
    "pedro almeida"
]
const cursos=[
    'Eletricista de Manutenção Industrial',
    'Mecânico de Usinagem',
    'Técnico em Automação Industrial',
    'Soldador de Estruturas Metálicas',
    'Técnico em Eletroeletrônica',
    'Operador de Máquinas CNC',
    'Técnico em Logística',
    'Programador de Computador',
    'Desenhista Técnico Mecânico',
    'Técnico em Segurança do Trabalho'
]

const matricula=[
    {'idaluno':'2','idcurso':'6'},
    {'idaluno':'3','idcurso':'5'}

]

app.use("/matricula/:idaluno",(req, res, next)=>{
    const id =req.params.idaluno;
    const nome =alunos[id]
    const matriculado = matricula.filter (linha=>linha.idaluno==id)
    const nomecurso = cursos[matriculado[0].idcurso]
    function findByKey(key, value) {
        return (item, i) => item[key] === value
    }
        let findParams = findByKey('idcurso',matriculado[0].idcurso )
        let index = matricula.findIndex(findParams)
    const resposta= {
        idaluno:id,
        nomedoaluno:nome,
        cursomatriculado:nomecurso,
        idmatricula: index,
        idcurso :matriculado[0].idcurso,
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