// Import Module
const express = require("express")
const jwt = require("jsonwebtoken")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")

// Inisialisasi Apps Server
const app = express()
const port = 3003

// Middleware
const authenticateJWT = (req, res, next) => {
    // Menangkap request client dengan authorizationnya (Token)
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // Mengambil token saja
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Using Middleware
dotenv.config() 
app.use(bodyParser.json()) 

const users = [
    {
        username : "agus123",
        password : "123456",
    },
    {
        username : "asep123",
        password : "123456"
    }
]

const saltRounds = 10;

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(users[0].password, salt, function(err, hash) {
    // returns hash
    console.log(hash);
    });
});

// Route Awal
app.get('/', (req, res) => {
    res.send("Backend Version 0.0")
})

app.post('/login', (req, res) => {

    // const {username, password} = req.body //Menangkap Request dari client
    const username = req.body.username
    const password = req.body.password

    console.log(username, password)

    // Untuk mencari user yang di request tersedia atau tidak dalam database
    const user = users.find(u => { return (u.username === username) && (u.password === password)})

    // Check User Tersedia atau Tidak
    if(user){

        const token = jwt.sign({username: user.username}, process.env.TOKEN_SECRET)
        res.json({ token })
    }else{
        res.send("User Gagal Masuk")
    }

})

app.get('/users', authenticateJWT ,(req, res) => {
    res.json(users)
})


// Create Server
app.listen(port, () => {
    console.log(`Running in Port ${port}`)
})
