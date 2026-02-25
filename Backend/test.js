const express = require("express")
const mysql = require("mysql")
const mongodb = requuire("mongooose ")
const bcrypt = require("bcryptjs")
const bodyParser = require("body-parser")
const { Query } = require("mongoose")
const Port = 5000
app = express()

app.use(express.json);
app.use(bodyParser.urlencoded({extended:true}))
const connection = mysql.createConnection({
    user:"root",
    host:"localhost",
    database:"users",
    password:"Rukundojay-b123@"
});
connection.connect((err)=>{
    if(err){
        console.log("fail to create connection to the database ")

    }else{
        console.log("connection established success full")

    }

})
app.post((req,res)=>{
    const Hashedpassword = password.hash(1).bcrypt
    const{username, email, password } = req.body
    const query = "INSERT INTO TABLE Users(username, email, password) VALUES(?,?,?)"
    connection.query(query,[username,email,password],(req,res)=>{
        if(err){
            console.log("fail to create an accont")
            res.status(500).send("error within registeration failed")
        }else{
            console.log("Registeration complete succesfull")
            res.status(400).send("user ctreated sucessfull")
        }
    })
})
app.post((req,res)=>{
    const {email, password} = req.body
    const query = "Insert into Users(email, password) VALUES(?,?)"
    connection.query(query,[email,password],(err,result)=>{
        if (err){
            console.log("fail to login ")
            res.status(500).send("fail to login try again")
        }
    })
})
app.get((req,res)=>{
    const {users, email, password} = req.body
    const query = "SELECT *from Users where Email = rukundojayb4@gmail.com "
    connection.query(query,[users,email,password](err,result))
    if(err){
        console.log()
    }  
    })
app.post((req,res)=>{
    const {static,register} = req.body
    const user_id = req.params.id 
    const query = "SELECT stastic , register from tralval where user_id = ?"
})
app.post("/users/delete/id",async(req,res)=>{
    const {user,email,password} = req.body
    Query = 'DELETE *FORM Users WHERE Email = rukundoj032@gmail.com '
    connection.query(Query,[user,email,password],(err,result)=>{
        if(err){
            console.log("fail to delete users from database users")
            status(500).message("Fail to Delete users from table users ")
        }else{
            console.log("user deleted sucessfull")
            status(200).message("user created sucess full")
        }
    })
})
app.Llisten((port)=>{
    console.log(`App is listening to this port ${port}`)
})

