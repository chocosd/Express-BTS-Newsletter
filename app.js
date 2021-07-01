//jshint esversion: 6
const express = require("express");
const request = require("request");
const https = require("https");

require('dotenv').config();
console.log(process.env);

const app = express();
const port = 3000;
app.use(express.json());

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  var data = {
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ],
  };

  const jsonData = JSON.stringify(data);
  const listId = process.env.LIST_ID;
  const apiKey = process.env.API_KEY;
  const url = `https://us6.api.mailchimp.com/3.0/lists/${listId}`;

  const options  = {
    method: "POST",
    auth: ""
  }

  const request = https.request(url, options, function(response) {
    response.on("data", function(data){
      console.log(JSON.parse(data));


        if (response.statusCode >= 200 && response.statusCode < 300) {
            res.sendFile(__dirname + "/success.html");
        } else if (response.statusCode >= 400 && response.statusCode < 500) {
            res.sendFile(__dirname + "/failure.html");
        } else if (response.statusCode >= 500 && response.statusCode < 599) {
            res.sendFile(__dirname + "/failure.html");
        };

    })
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/")
})

app.listen(process.env.PORT || port, function() {
  console.log("Server is running on port " + port);
});
