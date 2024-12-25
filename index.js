import { faker } from '@faker-js/faker';
import mysql from 'mysql2';
import express from 'express';
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import methodOverride from 'method-override' ;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname , "public")));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'vasu2022',
    database: 'userinfo'
});


// home route
app.get("/", (req ,res)=>{
  const q = "SELECT count(*) FROM user";
  connection.query(q ,(err, results) => {
      if (err)throw err;
       let count = results[0]["count(*)"];
        res.render("home.ejs" ,{count});
    });

});

// show route
app.get("/user", (req ,res)=>{
  let q = "select * from user";
  connection.query(q ,(err, users) => {
    // if (err)throw err;
    res.render("show.ejs",{users} );
      // console.log(users);
  });
});

// edit request
app.get("/user/:userid/edit" , (req, res)=>{
  let {userid} = req.params;
  let q = `SELECT * FROM user WHERE userid ='${userid}'`;
  connection.query(q ,(err, result) => {
    if (err)throw err;
    let user = result[0];
    res.render("edit.ejs", {user}); 
  });
});

// Update route 
app.patch("/user/:userid" ,(req ,res)=>{
  let {userid} = req.params;
  let {password :formPass , username :newUsername} = req.body;
  let q = `SELECT * FROM user WHERE userid ='${userid}'`;
  connection.query(q ,(err, result) => {
    if(err)throw err;
    let user = result[0];
    if(formPass != user.password){
      res.send("wrong password");
    } else {
      let q2 = `UPDATE user SET username =' ${newUsername}' WHERE userid ='${userid}'`;
      connection.query(q2 ,(err , result)=>{
        res.redirect("/user"); 
      });
    }
  });
});

// for edit form
app.get("/user/new", (req ,res)=>{
  res.render("add.ejs");
});
// add route
app.post("/user", (req, res)=>{
  let {userid : userid , username : username , email: email , password : password}= req.body;

  let q = `INSERT INTO user VALUES ('${userid}' ,'${username}','${email}','${password}' )`;
  connection.query(q ,(err, result) => {
    if (err)throw err;
    res.redirect("/user"); 
  });
});

// delete user
app.delete("/user/:userid", (req, res)=>{
  let {userid} = req.params;
  let q = `DELETE FROM USER WHERE userid ='${userid}'`;
  connection.query(q ,(err, result) => {
    if (err)throw err;
    res.redirect("/user"); 
  });
});


app.listen("8080" ,()=>{
  console.log(`server is listning to port 8080`);
});





// insert new data
// let q = "INSERT INTO user (userId, username, email, password) values ?";

// let getRandomUser = () =>{
//   return [
//     faker.string.uuid(),
//     faker.internet.userName(),
//     faker.internet.email(),
//     faker.internet.password(),
//   ];
// }
// let data=[];
// for (let i=1 ; i<=100; i++){
//   data.push(getRandomUser());
// };

// connection.query(q ,[data], (err, results) => {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   console.log(results); // Output the query results
// });
// connection.end();