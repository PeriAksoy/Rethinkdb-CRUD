var express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const r = require('rethinkdbdash')({
    servers: [
        {
            host: 'localhost', 
            port: 28015        
        }
    ]
});

var app = express();

app.use(express.json())
app.use(cors());

//POST
app.post("/",async (req,res) =>{
    let todoItem=req.body;
    const id = await r.uuid();
    todoItem = {
        ...todoItem,
        id: id
        }
    await r.db("Todo_list").table("Todos").insert(todoItem).run();
    res.send(todoItem);
});

//DELETE
app.delete("/:id",async (req,res) =>{
    const todoId = req.params.id;
    await r.db("Todo_list").table("Todos").get(todoId).delete().run();
    res.send({
        message: "başarılı"
    });
});

//GET

app.get("/", async (req,res) =>{
    const todo = await r.db("Todo_list").table("Todos");
    res.send(todo);
});

//PUT

app.put ("/:id", async(req,res) =>{
    const todoId = req.params.id;
    const newTodo = req.body.todo;
    await r.db("Todo_list").table("Todos").get(todoId).update({ todo:newTodo}).run();
    res.send({ id:todoId,todo:newTodo});
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});




