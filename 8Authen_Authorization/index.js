const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

/*
//cookie set and read.
//route in get
app.get('/',(req,res)=>{
    // res.send('the port is running');
    res.cookie("name","salman");
    res.send('done')
});

app.get('/read',(req,res)=>{
    console.log(req.cookies)
    res.send("read page");
})

*/
//$2b$10$OHH7hhgp68/idRTjL6oLUenvlswuPe/u0568opI3Mo9QoyGl1ioD6



/*
//data encrypt
app.get('/read',(req,res)=>{
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash('abcdefg',salt,(err,has)=>{
            console.log(has)
        })
    })
});

//data decryption
app.get('/decrypt',(req,res)=>{
    bcrypt.compare('abcdefg','$2b$10$OHH7hhgp68/idRTjL6oLUenvlswuPe/u0568opI3Mo9QoyGl1ioD6',(err,result)=>{
        console.log(result);
        res.send('running')
    })
})
*/

// Generate and set the token in a cookie
app.get('/', (req, res) => {
    let token = jwt.sign({ email: "salman@gmail.com" }, "secret-token");
    res.cookie("token", token);
    res.send("Token set in cookie: done");
});

// Verify and read the token from the cookie
app.get('/read', (req, res) => {
    // Directly verify the token from the cookie
    let data = jwt.verify(req.cookies.token, "secret-token");
    console.log(data);
    res.send("Token verified successfully.");
});


//running port
app.listen(3000,()=>{
    console.log(`the port is running 3000`);
});