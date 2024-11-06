const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const PORT = 3000;

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
            password: "123"
        }
    ]

app.post('/signup', (req, res) => {
   const { username } = req.body;
   req.session.user = username;
   req.session.email = email;
   req.session.password = password;
   return res.json(userData);
})

app.post('/login', (req, res) => {
    const { username} = req.body;
    req.session.username = username;
    console.log(req.session.username); 

    if (req.session.username === myData[0].username) {
        return res.json({myData})
    }
})

app.get('/data', (req, res) => {
    const username = req.session.username;
    if(username) {
        console.log(myData)
        return res.json(myData)
    } else {
        return res.json("need login")
    }
})


app.listen(PORT, () => {
    console.log(`Your server listen on ${PORT}`)
})