var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var db = require("./db.js");

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get("/", function(req, res) {
	res.send("Todo API root");
}); 

//GET /todos?completed=false&q=work
app.get("/todos", function(req, res) {
	var query = req.query;
	var where = {};
	
	if (query.hasOwnProperty("completed") && query.completed === "true") {
		where.completed = true
	} else if (query.hasOwnProperty("completed") && query.completed === "false") {
		where.completed = false
	}

	if (query.hasOwnProperty("q") && query.q.length > 0) {
		where.description = {
			$like: "%" + query.q + "%"
		}
	}

	db.todo.findAll({where: where}).then(function(todos) {
		res.json(todos);
	}, function (e) {
		res.status(500).send();
	});

	// var filteredTodos = todos;

	// if (queryParams.hasOwnProperty("completed") && queryParams.completed === "true") {
	// 	filteredTodos = _.where(todos, {
	// 		completed: true
	// 	});
	// } else if (queryParams.hasOwnProperty("completed") && queryParams.completed === "false") {
	// 	filteredTodos = _.where(todos, {
	// 		completed: false
	// 	});
	// }

	// if (queryParams.hasOwnProperty("q") && queryParams.q.length > 0) {
	// 	filteredTodos = _.filter(filteredTodos, function(todo) {
	// 		return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) !== -1;
	// 	})
	// }

	// res.json(filteredTodos);
});

//GET /todos/:id
app.get("/todos/:id", function(req, res) {
	var todoId = parseInt(req.params.id);

	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			return res.json(todo.toJSON());
		} else {
			return res.status(404).send();
		}
	}, function(e) {
		return res.status(500).send();
	});

	// var matchedToDo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (matchedToDo) {
	// 	res.json(matchedToDo);
	// } else {
	// 	res.status(404).send();
	// }
});

//POST /todos
app.post("/todos", function(req, res) {
	var body = _.pick(req.body, "description", "completed");

	//call create on db.todo
	db.todo.create(body).then(function(todo) {
		return res.json(todo.toJSON());
	}, function(e) {
		return res.status(400).json(e);
	});

	//if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	return res.status(400).json(e);
	//}

	//	respond with 200 and todo
	//	res.status(400).json(e)

	// body.description = body.description.trim();
	// body.id = todoNextId++;
	// todos.push(body);

	// res.json(body);
});

//DELETE /todos:id
app.delete("/todos/:id", function(req, res) {
	var todoId = parseInt(req.params.id);
	var matchedToDo = _.findWhere(todos, {
		id: todoId
	});

	if (matchedToDo) {
		todos = _.without(todos, matchedToDo);
		res.json(matchedToDo);
	} else {
		res.status(404).json({
			"error": "no todo found with that id"
		});
	}
});

//PUT /todos:id
app.put("/todos/:id", function(req, res) {
	var todoId = parseInt(req.params.id);
	var matchedToDo = _.findWhere(todos, {
		id: todoId
	});
	var body = _.pick(req.body, "description", "completed");
	var validAttributes = {};

	if (!matchedToDo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty("completed") && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty("completed")) {
		return reponse.status(400).send();
	}

	if (body.hasOwnProperty("description") && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty("description")) {
		return reponse.status(400).send();
	}

	_.extend(matchedToDo, validAttributes);
	res.json(matchedToDo);

});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Express listening on port " + PORT + "!");
	});
});