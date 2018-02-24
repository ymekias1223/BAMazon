CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products(
id integer auto_increment not null primary key,
name varchar(150),
department varchar(150),
price decimal,
quantity integer not null,
product_sales decimal not null
);


#after this you would probably want to seed the database with some entries.  I create the database 
#on the cmd line 