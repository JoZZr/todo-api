var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get("/", function (req, res) {
	res.send("Todo API root");
});

//GET /todos
app.get("/todos", function (req, res) {
	res.json(todos);
});

//GET /todos/:id
app.get("/todos/:id", function (req, res) {
	var todoId = parseInt(req.params.id);
	var matchedToDo;

	for (var i = 0; i < todos.length; i++) {
		if (todoId === todos[i].id) {
			matchedToDo = todos[i];
		}
	}

	if (matchedToDo) {
		res.json(matchedToDo);
	} else {
		res.status(404).send();
	}
});

//POST /todos
app.post("/todos", function (req, res) {
	var body = req.body;

	console.log("description: " + body.description);

	body.id = todoNextId++;
	todos.push(body);

	res.json(body);
});


app.listen(PORT, function () {
	console.log("Express listening on port " + PORT + "!"); 
});