//consultar tarefa por id
//atualizar o status da tarefa 


//1 requires
const express = require('express');
const mysql = require('mysql2');
const cors = ('cors');

const mysql_config = require('/inc/mysql_config');
const functions = require('/inc/functions');

//2 criação de duas constatntes para definição da disponibilidade da
// api e da versão da api
const API_AVAILABILITY = true;
const API_VERSION = '2.0.0';

//3 iniciar o server
const app = express();
app.listen(3000,()=>{
    console.log("API está ativo")
})

//4 checar se API está disponivel 
app.use((req,res,next)=>{
    if (API_AVAILABILITY){
        next();
    }else{
        res.json(functions.response('atenção', 'API está em manuntenção, sinto muito', 0, null))
    }
})

//5 mysql connection
const connection = mysql.createConnection(mysql_config);

//6 cors
app.use(cors());

//7 rotas
//rota inicial que vai dizer que a API está disponível
app.get('/', (req,res)=>{
    res.json(functions.response('sucesso', 'API está rodando',0, null))
})

//9 rota para chegar em todas as tarefas 
app.get('/tasks',(req,res)=>{
    connection.query('SELECT * FROM tasks', (err,rows))
})

//10 rota para pegar a task pelo id
app.get('/tasks/:id', (req,res)=>{
    const id = req.params.id;
    connection.query('SELECT * FROM tasks WHERE id=?', [id], (err, rows)=>{
        if(!err){
            //devolver os dados da task
            if(rows.lengt>0){
                res.json(functions.response('Sucesso', 'Sucesso na pesquisa', rows.lengt,rows))
            }else{
                 res.json(functions.response('Atenção', 'Não foi possivel encontrar a task solicitada', 0, null))
            }
        }
        else{
            res.json(functions.response('error', err.message, 0, null))
        }
    })
})

//11 atualizar o status de uma task - método 
app.put('/tasks/:id/status/:status', (req,res)=>{
    const id = req.params.id;
    const status = req.params.status;
    connection.query('UPDATE tasks SET status =? WHERE id =?', [status,id], (err,rows)=>{
        if(!err){
            if(rows.affectedRows>0){
                res.json(functions.response('Sucesso','Sucesso na lateração do status', rows.affectedRows,nuul))
            }
            else{
                res.json(functions.response('Atenção', 'Task não encontrada', 0, null))
            }
        }
    })
})

//8 midleware para caso alguma frota não seja encontrada
app.use((req,res)=>{
    res.json(functions.response('atenção', 'rota não encontrada',0, null))
})