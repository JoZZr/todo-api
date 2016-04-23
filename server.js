var express = require("express");
var app = express();
const PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: "Finishing node.js course",
	completed: false
}, {
	id: 2,
	description: "Got to market",
	completed: false
}, {
	id: 3,
	description: "Party",
	completed: true
}];

app.get("/", function (req, res) {
	res.send("Todo API root");
});

app.get("/todos", function (req, res) {
	res.json(todos);
});

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

app.listen(PORT, function () {
	console.log("Express listening on port " + PORT + "!"); 
});