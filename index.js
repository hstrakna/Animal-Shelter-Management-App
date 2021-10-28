
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const date = require("date");
const http = require('http');
const php = require('php');
const _ = require("lodash");
const ejs = require("ejs");

const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(express.static('/public/images'));


app.get('/', function(req, res){

  app.set("view engine", "ejs");
  res.render("index");
});

app.get('/add-people', function(req, res){

  res.render("add-people");
});

app.get('/add-animals', function(req, res){
  res.render("add-animals");
});

app.get('/queries', function(req, res){
  res.render("queries");
});

app.get('/add-adoptions', function(req, res){
  res.render("add-adoptions");
});

  var connection = mysql.createConnection({
    host: '10.0.0.84',
    user: 'USER',
    password: 'cosc578',
    database: 'SHELTER_DB'
  });

  connection.connect();

  module.exports = connection;

app.post('/addpeople', function(req, res) {

  connection.query("INSERT INTO ADOPTIVE_PERSON (ssn,fname,lname,sex,phone,num_kids,num_cats,num_dogs,email,bday) VALUES ('"+req.body.ssn+"','"+req.body.fname+"','"+req.body.lname+"','"+req.body.sex+"','"+req.body.phone+"','"+req.body.num_kids+"','"+req.body.num_cats+"','"+req.body.num_dogs+"','"+req.body.email+"','"+req.body.bday+"')",function(error, result){
     if (error) {
       if (error.code == 'ER_DUP_ENTRY') {
         console.log("duplicate entry!");
       } else {
         console.log("other error");
         res.redirect("/add-people");
       }
    } else {
      console.log("success!");
      res.redirect("/add-people");
    }
  });

});


app.post('/addadoption', function(req, res) {

  connection.query("INSERT INTO ADOPTION (Person_ssn,Animal_id,Animal_name,Person_fname,Person_lname,Adoption_date) VALUES ('"+req.body.Person_ssn+"','"+req.body.Animal_id+"','"+req.body.Animal_name+"','"+req.body.Person_fname+"','"+req.body.Person_lname+"','"+req.body.Adoption_date+"')",function(error, result){
     if (error) {
       console.log("error!");
       } else {
      // toDelete = req.body.animal_id;
      // connection.query("DELETE FROM ANIMAL WHERE animal_id = ('"+toDelete+"')", function(error, result){
      //   if (error) {
      //     console.log("error deleting");
      //   }
      // });

      res.redirect("/add-adoptions");
    }
  });

});

app.post('/addanimals', function(req, res) {

  connection.query("INSERT INTO ANIMAL (name,sex,bday,species,weight,color,breed,entry_date,likes_cats,likes_dogs,likes_kids) VALUES ('"+req.body.name+"','"+req.body.sex+"','"+req.body.bday+"','"+req.body.species+"','"+req.body.weight+"','"+req.body.color+"','"+req.body.breed+"','"+req.body.entry_date+"','"+req.body.likes_cats+"','"+req.body.likes_dogs+"','"+req.body.likes_kids+"')",function(error, result){
     if (error) {
       if (error.code == 'ER_DUP_ENTRY') {
         console.log("duplicate entry!");
       } else {
         console.log("other error");
         res.redirect("/add-animals");
       }
    } else {
      console.log("success!");
      res.redirect("/add-animals");
    }
  });

});

app.get('/view-adoptions', function(req, res){

      var obj = [];
      var newArray = [];
      var query = connection.query("SELECT * FROM ADOPTION ORDER BY animal_id", function(err, result) {
        for (var i = 0; i < result.length; i++) {
          var row = result[i];
          obj.push(row.Person_ssn);
          obj.push(row.Animal_id);
          obj.push(row.Animal_name);
          obj.push(row.Person_fname);
          obj.push(row.Person_lname);
          obj.push(row.Adoption_date);
        }

            var newArray = listToMatrix(obj, 6);
            // res.write(JSON.stringify(result));

            console.log(newArray);
            res.render("view-adoptions", {query: newArray});
        });
    });

//view people db connection
app.get('/view-people', function(req, res){

  var obj = [];
  var newArray = [];
  var query = connection.query("SELECT * FROM ADOPTIVE_PERSON ORDER BY lname", function(err, result) {
    for (var i = 0; i < result.length; i++) {
      var row = result[i];
      obj.push(row.ssn);
      obj.push(row.fname);
      obj.push(row.lname);
      obj.push(row.sex);
      obj.push(row.phone);
      obj.push(row.num_kids);
      obj.push(row.num_cats);
      obj.push(row.num_dogs);
      obj.push(row.email);
      obj.push(row.bday);
    }

        var newArray = listToMatrix(obj, 10);
        // res.write(JSON.stringify(result));

        console.log(newArray);
        res.render("view-people", {query: newArray});
    });
});


// view animals db connection
app.get('/view-animals', function(req, res){

  app.set("view engine", "ejs");


  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static("public"));



  var obj = [];
  var newArray = [];
  var query = connection.query("SELECT * FROM ANIMAL ORDER BY entry_date DESC", function(err, result) {
    for (var i = 0; i < result.length; i++) {
      var row = result[i];
      obj.push(row.animal_id);
      obj.push(row.name);
      obj.push(row.sex);
      obj.push(row.bday);
      obj.push(row.species);
      obj.push(row.weight);
      obj.push(row.color);
      obj.push(row.breed);
      obj.push(row.entry_date);
      obj.push(row.likes_cats);
      obj.push(row.likes_dogs);
      obj.push(row.likes_kids);
    }

        var newArray = listToMatrix(obj, 12);
        // res.write(JSON.stringify(result));

        console.log(newArray);
        res.render("view-animals", {query: newArray});
    });


});


function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});
