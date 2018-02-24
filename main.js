// think about where you want to put your connection termination statement.  
// dont forget this because if not present may throw program into an 
// infinite loop

//  next time: create the manager and sys admin functions.  Some manager funtions already defined.  
//maybe require a password for sysadmin


var mysql = require("mysql");
var inquirer = require("inquirer");

var userName;
inquirer.prompt({
	name: "username",
	type:"input",
	message:"Goodai mate!! Whots yoor nayme?"
}).then(function(answer){
	userName = answer.username;
});

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user:'root',
	password:'root',
	database: 'bamazon'
});

connection.connect(function(err){
	if (err) console.log(err);

	console.log("_________connect to bamazon________");
	inquirer.prompt({
		name:'account_type',
		type:'rawlist',
		message:'who are you?',
		choices: ['customer','manager','sysadminAKAtheImmortal']
	}).then(function(response){
		switch (response.account_type){
			case 'customer':
				regularUser();
				break;
			case 'manager':
				manager();
				break;
			case 'sysadminAKAtheImmortal':
				sysAdmin();
				break;
		}
	});
	
});

function editTable(name, department, price, quantity){
	connection.query("INSERT INTO products (name,department,price,quantity) "
		+"VALUES ('"+name+"','"+department+"','"+price+"','"+quantity+"')");
}

function seeAll(){
	connection.query("SELECT * FROM products", function(err,response){
		if (err) console.log(err);

		console.log(response);

	});
}
function buyItem(item,desiredQuantity){
	var quantity;
	connection.query("SELECT * FROM products WHERE name= ? ",{name:item},function(err,response){
		if (err){
			console.log(err);
		}
		quantity = response[0].quantity;
		if ((quantity-desiredQuantity) <0){
			console.log("Weel this ez embrasing,  looks like we rnt's good az amazin OUT UV STALK");
			return;
		}
	});
	quantity = quantity-desiredQuantity;
	connection.query("UPDATE products SET quantity= ? WHERE name= ?",[{quantity:quantity},{name:item}],function(err){
		if (err){
			console.log(err);
		}
	});
}

function editItem(id,quantity_to_add){
	var quantity;
	connection.query("SELECT * FROM products WHERE id= ? ",{id:id},function(err,response){
		if (err){
			console.log(err);
		}
	
	});
	quantity = quantity+quantity_to_add;
	connection.query("UPDATE products SET quantity= ? WHERE id= ?",[{quantity:quantity},{id:id}],function(err){
		if (err){
			console.log(err);
		}
	});
}


function viewLowInv(){
	var query = "GROUP BY quantity WHERE quantity<0";
	connection.query(query,function(err,response){
		if (err){
			console.log(err);
		}
		console.log(response);
		
	})
}



function terminateConnection(){
	connection.end();
}

function regularUser(){
	seeAll();

	function untilShoppingOver(){
		inquirer.prompt({
	      name: "item_name",
	      type: "input",
	      message: "What is the name of the item you wish to purchase?"
	    },
	    {
	    	name:"quantity",
	    	type: "input",
	    	message: "How many?(number character only)"
	    })
	    .then(function(answer) {
	      buyItem(answer.item_name,answer.quantity)
	      console.log("The item has been bought!!");
	      inquirer.prompt({
	      name: "continue",
	      type: "rawlist",
	      message: "Would you like to keep shopping, "+userName+" ?",
	      choices:["yes","no, im broke"]
	    }).then(function(answer){
	    	if (answer.continue==="yes"){
	    		regularUser();
	    	}else{
	    		console.log("Thank you come again!!")
	    		terminateConnection();
	    		return;
	    	}
	    })

		});
	}

}
function manager(){
	console.log("well, lookes like your still at work, "+ userName+". You hate your life dont you? :)")
	inquirer.prompt({
		name:'task',
		type:'rawlist',
		message:"I'm busy remembering databse stuff. What do you need?",
		choices:["View all products","View low inventory", "Add to inventory","Add a new product","exit"]
	}).then(function(response){
		switch (response.task){
			case 'View all products':
				seeAll();
				manager();
			case 'View low inventory':
				viewLowInv();
				manager();
			case 'Add to inventory':
				editItem();
				manager();
			case 'Add a new product':
				editTable();
				manager();
			case 'exit':
				terminateConnection();
				console.log("Goodbye for now")
				break;


		}
	})
}