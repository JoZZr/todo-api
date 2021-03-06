var Sequelize = require("Sequelize");
var sequelize = new Sequelize(undefined, undefined, undefined, {
	dialect: "sqlite",
	storage: __dirname + "/basic-sqlite-database.sqlite"
});

var Todo = sequelize.define("todo", {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync({
	//force: true
}).then(function() {
	console.log("Everything is synced");

	Todo.findOne({
		where: {
			id: 2
		}
	}).then(function(todo) {
		if (todo) {
			console.log(todo);
		} else {
			console.log("No todo item found");
		}
	});

	// Todo.create({
	// 	description: "Take out trash"
	// }).then(function() {
	// 	return Todo.create({
	// 		description: "Clean office"
	// 	});
	// }).then(function() {
	// 	//return Todo.findById(1);
	// 	return Todo.findAll({
	// 		where: {
	// 			description: {
	// 				$like: "%Office%"
	// 			}
	// 		}
	// 	});
	// }).then(function(todos) {
	// 	if (todos) {
	// 		todos.forEach(function(todo) {
	// 			console.log(todo.toJSON());
	// 		});
	// 	} else {
	// 		console.log("No todo found!");
	// 	}
	// }).catch(function(error) {
	// 	console.log(error);
	// });
});