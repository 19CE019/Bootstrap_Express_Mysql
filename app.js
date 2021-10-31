const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'universityform'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM users";
    mysql.query(sql, (err, row) => {
        if(err) throw err;
        else{
            res.render('user_index', {
                title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
                users : row
            });
        }
        
    });
});

app.get('/add',(req, res) => {
    res.render('user_add', {
        title : 'CRUD Operation using NodeJS / ExpressJS / MySQL'
    });
});

app.post('/save',(req, res) => { 
    let data = {CourseId: req.body.CourseId, Department: req.body.Department, Institute: req.body.Institute, University: req.body.University};
    let sql = "INSERT INTO users SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from users where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            user : result[0]
        });
    });
});


app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update users SET CourseId='"+req.body.CourseId+"',  Department='"+req.body.Department+"', University='"+req.body.University+"',  Institute='"+req.body.Institute+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});


app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from users where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});


// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});