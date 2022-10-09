/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post("/signup", "UsersController.signup");
Route.post("/login", "UsersController.login");

Route.group(()=>{
Route.post("/transaction", "TransactionsController.addtransaction");
Route.put("/updatetransaction/:id", "TransactionsController.updateTransaction");
Route.delete("/deletetransaction/:id", "TransactionsController.deleteTransaction");
Route.get('/viewlastten','TransactionsController.viewLastTen')
Route.get('/view/:id','TransactionsController.viewByTime')
Route.post('/view/analytic','TransactionsController.analyticView')


}).middleware('auth')