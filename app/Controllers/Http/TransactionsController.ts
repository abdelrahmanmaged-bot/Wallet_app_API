import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import TransactionService from "App/Services/TransactionsMethods";

export default class TransactionsController {
  async addtransaction({ request, response, auth }: HttpContextContract) {
    const payload = await TransactionService.validateRequest(request,auth);
    const updatedPayload = await TransactionService.changeToNegativeIfExpense(payload);
    const addTransaction = await TransactionService.addTransaction(updatedPayload)
    await TransactionService.calculateBalance(payload.user_id)
    return response.json(addTransaction);
  }

  async updateTransaction({ request, response, auth, params }: HttpContextContract) {
    const payload = await TransactionService.validateRequest(request,auth);
    const updatedPayload = await TransactionService.changeToNegativeIfExpense(payload);
    const updatedTransaction = await TransactionService.updateTransaction(params.id,updatedPayload)
    await TransactionService.calculateBalance(payload.user_id)
    return response.json(updatedTransaction);
  }

  async deleteTransaction({response, auth, params}:HttpContextContract){
    const deleteTransaction = await TransactionService.deleteTransaction(params.id, auth.user!.id)
    await TransactionService.calculateBalance(auth.user!.id)
    return response.json(deleteTransaction);
  }

  async viewLastTen({ response, auth }: HttpContextContract){
    const records = await TransactionService.showTenRecords(auth.user!.id)
    return response.json(records);
  }

  public async viewByTime({ response, auth, params }: HttpContextContract) {
    const payload = await TransactionService.showByTime(auth.user!.id, params.id)
    return response.json(payload)
}

public async analyticView({ request, response, auth }: HttpContextContract) {
  const payload = await TransactionService.validateViewRequest(request,auth)
  const recordsToView = await TransactionService.ShowAnalytic(payload)
  return response.json(recordsToView)
}
}
