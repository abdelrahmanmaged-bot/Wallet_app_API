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