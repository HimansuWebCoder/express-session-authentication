const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const knex = require("knex");
const PORT = 3000;

const db = knex({
     client: 'pg',
  connection: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "todos",
    password: "test",
}

})


app.use(session({
  secret: '*****',
  resave: false,
  saveUninitialized: false,
  cookie: {secure: false}
}))

const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true, 
};

app.use(express.json())
app.use(cors(corsOptions))

const myData = [
        {
            username: "boss",
            password: "123",
            age: 22,
            passion: 'web development',
        }
    ]

app.post('/signup', (req, res) => {
   const { username } = req.body;
   req.session.user = username;
   myData.push({username: username});
   // return res.json(myData);
   return res.json("signup successfully");
})

app.post("/todos", (req, res) => {
    const {todo} = req.body;
    db("todos").insert({title: todo}).returning("*")
        .then(data => {
            return res.json(data);
        })
})

app.post('/login', (req, res) => {
    const { todo } = req.body;
    req.session.todo = todo;
    // req.session.username = username;
    // console.log(req.session.username); 

    // const findUserData = myData.find(data => req.session.username === data.username );
    const findTodo = db("todos").where({title: req.session.todo}).first();

//     findTodo.then(findtodo => {
//   if (findtodo) {
//     db("todos")
//       .select("todo")
//       .where({ title: findtodo.title })  // Use the resolved value's property
//       .then(data => {
//         return res.json(data);
//       })
//       .catch(error => {
//         console.error(error);
//         return res.status(500).json({ error: "Database query error" });
//       });
//   } else {
//     return res.json("Invalid todo");
//   }
// });


    // findTodo.then((findtodo) => )

    findTodo.then(findtodo => {
        if (findtodo) {
            db("todos").select("*").where({title: findtodo.title})
               .then(data => {
                return res.json(data)
               })
        }
    })

    // if (findTodo) {
    //     // return res.json(findUserData)
    //     // return res.json("Login successfully")
    //     db("todos").select("todo").where(findTodo)
    //       .then(data => {
    //         return res.json(data);
    //       })
    // } else {
    //     return res.json("Invalid username")
    // }
})

app.get('/data', (req, res) => {
     if (!req.session.todo) {
        return res.json("Need to log in or Invalid todo");
    }

    db("todos")
        .where({ title: req.session.todo })
        .first()
        .then(findTodo => {
            if (findTodo) {
                console.log(findTodo.title);
                return res.json(findTodo.title);
            } else {
                return res.json("need login");
            }
        })
});



app.listen(PORT, () => {
    console.log(`Your server listen on ${PORT}`)
})