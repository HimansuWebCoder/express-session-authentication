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

app.post('/login', (req, res) => {
    const { username} = req.body;
    req.session.username = username;
    console.log(req.session.username); 

    const findUserData = myData.find(data => req.session.username === data.username );

    if (findUserData) {
        // return res.json(findUserData)
        return res.json("Login successfully")
    } else {
        return res.json("Invalid username")
    }
})

app.get('/data', (req, res) => {
    const findUserData = myData.find(data => req.session.username === data.username);

    if(findUserData) {
        console.log(findUserData)
        return res.json(findUserData)
    } else {
        return res.json("need login")
    }
})


app.listen(PORT, () => {
    console.log(`Your server listen on ${PORT}`)
})