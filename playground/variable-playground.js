var person = {
	name: "Johannes",
	age: 21
};

function updatePerson(obj) {
	//obj = {
	//	name: "Andrew",
	//	age: 24
	//};

	obj.age = 24;
}

updatePerson(person);
console.log(person);