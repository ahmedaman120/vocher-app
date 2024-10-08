# Backend Coding Challenge


## Task:  Voucher Pool
The objective is to create a voucher pool microservice based in NodeJs/Typescript preferably (NestJs) . You can use whichever  libraries you prefer. The service should expose a ​REST API​.

A voucher pool is a collection of voucher codes that can be used by customers to get discounts on website. Each code may only be used once, and we would like to know when it was used by the customer. Since there can be many customers in a voucher pool, we need a call that auto-generates voucher codes for each customer. Here’s a screenshot to give you an idea what it looks like:

![Voucher Pool](Voucher-Pool.png)

### Entities
* Customer
	*	Name
	*	Email (unique)
*	Special Offer
	*	Name
	*	Fixed percentage discount
*	Voucher Code
	*	Unique randomly generated Code (at least 8 chars)
	*	Assigned to a Customer and a special offer
	*	Expiration Date
	*	Can just be used once
	*	Should track date of usage

### Functionalities
* Generate Voucher Code for each customer for a given Special Offer and expiration data
* Provide an endpoint, reachable via HTTP, which receives a Voucher Code and Email and
validates the Voucher Code. In Case it is valid, return the Percentage Discount and set the
date of usage
* For a given Email return all its valid Voucher Codes with the Name of the Special Offer

### Tasks
* [X] Design a database schema
* [X] Write an application
* [X] API endpoint for verifying and redeeming vouchers
* [X] Write unit tests
* [X] A nice little Readme on how to run
* [X] Writing swagger for the API
* [X] Docker file to setup the whole application with all the dependencies (database, nodejs)


### Instalation
1. update env/dev.env based on your docker-compose env variables
```bash
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=user
DB_PASSWORD=secret
DB_DATABASE=voucherdb
NODE_ENV=test # if you want to run in memory sqlite database. remove it if you want use persistent database.
```
2. run docker compose up --build -d to build and run docker files

### Testing
1. run npm install
2. run npm run test

### Postman Collection 
you will find postman collection with examples on root project directory with name "Vochers-app.postman_collection.json" load it on postman app and test project after run 
```bash
npm run start
```

### Database schema
There's update in current schema on offer table numOfRedeem that indicate the number of customers that have used the voucher. 
![SB schema](tes.png)
