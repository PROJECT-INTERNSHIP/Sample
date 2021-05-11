// Require express to make easy
// routing on server side.
const express = require("express");

// Creating express object
const app = express();
const bcrypt = require ("bcrypt")
app.use(express.urlencoded({extended : false}))
// Require path module
const path = require('path');

// Require pug template engine
var bodyParser=require("body-parser");

// Require mongoose to use mongoDb
// in a easier way
const mongoose = require("mongoose");

const { check, validationResult } = require('express-validator');

// Define a port number
const port = 3000;

// Make a static route to use your
// static files in client side
app.use('/static', express.static('static'));

// Middleware for parsing
app.use(express.urlencoded());

// Define and use pug engine so also
// declare path on rendering
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database Connection
mongoose.connect(
	"mongodb://localhost:27017/OnlineFeedbackSystem",
	{ useUnifiedTopology: true }
);
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
	console.log("connection succeeded");
})
app.post('/index1', function(req,res){
	var name = req.body.name;
	var email =req.body.email;
	var pass = req.body.password;
	

	var data = {
		"name": name,
		"email":email,
		"password":pass,		
	}
db.collection('tbl_Student').insertOne(data,function(err, collection){
		if (err) throw err;
		console.log("Record inserted Successfully");
			
	});
		
	return res.render('signup');
})

// Create schema
const feedSchecma = mongoose.Schema({

	Manager: String,
	q1: Number,
	q2: Number,
	q3: Number,
	q4: Number,
	q5: Number,
	q6: Number,
	q7: Number,
	feedi: String

});


// Making a modal on our already
// defined schema
const feedModal = mongoose
	.model('feeds', feedSchecma);
mongoose.connect(
		"mongodb://localhost:27017/OnlineFeedbackSystem",
		{ useUnifiedTopology: true }
	);
const feedSchecma2 = mongoose.Schema({
		
		associate: String,
		q1: Number,
		q2: Number,
		q3: Number,
		q4: Number,
		q5: Number,
		q6: Number,
		q7: Number,
		feedi: String
	
	});
	
	
	// Making a modal on our already
	// defined schema
	const feedModal2 = mongoose
		.model('feedsTech', feedSchecma2);

/*app.get('/', function (req, res) {
		// Rendering your form
		res.render('homepage1');
	});*/
app.get('/index1', function (req, res) {
		// Rendering your form
		res.render('index1');
	});
app.get('/feedback_home', (req, res) =>{
	   const name= 'siriVarma';
	   const username= ' ';
		// Rendering your form
		console.log(name);
		res.render('feedback_home', {username : name});
	});



// Handling get request
app.get('/', function (req, res) {
	// Rendering your form
	res.render('login');
});

//login check
app.post('/login', async(req, res) =>{
	try{
		const username= req.body.Username;
		const password= req.body.Password;
		exports.username=username;
		const useremail = await db.collection('tbl_Student').findOne({UserName:username});
		
		//useremail.UserName == username && await bcrypt.compare(password, useremail.Password)
		if(useremail.UserName == username && await bcrypt.compare(password, useremail.Password))
		{
			res.status(201).render("feedback_home",{name : useremail.UserName});
		} else{
			res.send("password are ot matching");
		}

	} catch(error) {

		res.status(400).send("Invalid login details");
		console.log(error);
		console.log(username);
		console.log(password);

	}
	
});
app.get('/feedback_form1', function (req, res) {
	// Rendering your form
	res.render('feedback_form1');
});

app.get('/feedback_form2', function (req, res) {
	// Rendering your form
	res.render('feedback_form2');
});

// Handling data after submission of form
app.post("/feedback_form1",  function (req, res) { 
	  
	const feedData = new feedModal({
		
		Manager: req.body.Manager,
		q1: req.body.q1,
		q2: req.body.q2,
		q3: req.body.q3,
		q4: req.body.q4,
		q5: req.body.q5,
		q6: req.body.q6,
		q7: req.body.q7,
		feedi: req.body.feedi

	});
	feedData.save()
		.then(data => {
			res.render('feedback_home',
{ msg: "Your feedback successfully saved." });
		})
		.catch(err => {
			res.render('feedback_form1',
				{ msg: "Check Details." });
		});
})
app.post("/feedback_form2",  function (req, res) { 
	  
	const feedData2 = new feedModal2({
		
		associate: req.body.associate,
		q1: req.body.q1,
		q2: req.body.q2,
		q3: req.body.q3,
		q4: req.body.q4,
		q5: req.body.q5,
		q6: req.body.q6,
		q7: req.body.q7,
		feedi: req.body.feedi

	});
	feedData2.save()
		.then(data => {
			res.render('feedback_home',
{ msg: "Your feedback successfully saved." });
		})
		.catch(err => {
			res.render('feedback_form2',
				{ msg: "Check Details." });
		});
})
app.get('/changePassword', function (req, res) {
    // Rendering your form
    res.render('changePassword');
});
app.post('/changePassword', async(req, res) =>{
    try{
		const p1= req.body.newpassword1;
		const p2= req.body.newpassword2
		if(p1==p2)
		{
        const hashedPassword = await bcrypt.hash(req.body.newpassword1, 10);
        const UserName = req.body.username;
        
        var myquery = { UserName: UserName };
        var newvalues = { $set: {Password : hashedPassword } };
        db.collection("tbl_Student").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
            console.log("Record updated successfully");
        
            
        })
        res.render('login');
	}else{
		res.send("both passwords not matching");
	}
    } catch(error) {
        res.redirect('login')
        res.status(400).send("Invalid login details");
    }


}
    
    );

// Server setup
app.listen(port, () => {
	console.log("server is runing");
});
