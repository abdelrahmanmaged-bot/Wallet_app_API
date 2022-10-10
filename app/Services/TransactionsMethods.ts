import Transaction from "App/Models/Transaction";
import User from "App/Models/User";
import AnalyticviewValidator from "App/Validators/AnalyticviewValidator";
import TransactionValidator from "App/Validators/TransactionValidator";
import { DateTime } from "luxon";

class TransactionService {
  public static async validateRequest(request, auth) {
    const userId = auth.user!.id;
    const data = await request.validate(TransactionValidator);
    data.user_id = userId;
    return data;
  }

  public static async validateViewRequest(request, auth) {
    const userId = auth.user!.id;
    const data = await request.validate(AnalyticviewValidator);
    data.user_id = userId;
    return data;
  }

  public static async changeToNegativeIfExpense(payload) {
    if (payload.type == "expense") {
      payload.value = payload.value * -1;
    }

    return payload;
  }

  public static async addTransaction(payload) {
    const transaction = await Transaction.create(payload);
    return { transaction: transaction, message: "Transaction added" };
  }

  public static async calculateBalance(userId) {
    const user = await User.query()
      .where("id", userId)
      .withAggregate("transaction", (query) => {
        query.sum("value").as("total");
      })
      .firstOrFail();

    const total = user.$extras.total;

    this.updateBalance(userId, total);
  }

  public static async updateBalance(user_id, total) {
    const userBalance = await User.query().where("id", user_id).firstOrFail();
    userBalance.balance = total;
    await userBalance.save();
  }

  public static async updateTransaction(id, payload) {
    await Transaction.query().if(
      payload.type == "income",
      (query) => {
        query.where("id", id);
        query.andWhere("user_id", payload.user_id);
        query.first();
        query.update("value", payload.value);
        query.update("type", payload.type);
        query.update("income_category", payload.incomeCategory);
      },
      (query) => {
        query.where("id", id);
        query.andWhere("user_id", payload.user_id);
        query.first();
        query.update("value", payload.value);
        query.update("type", payload.type);
        query.update("income_category", null);
      }
    );
    const updatedTransaction = await Transaction.query().where("id", id);
    return {
      updatedTransaction: updatedTransaction,
      msg: "Transaction updated",
    };
  }

  public static async deleteTransaction(transactionId, user_id) {
    const transaction = await Transaction.query()
      .where("id", transactionId)
      .andWhere("user_id", user_id)
      .delete();
      if (transaction[0] === 0) {
        return {
          deletedTransaction: transaction,
          msg: "Transaction Already Deleted ",
        };
      }
    return {
      deletedTransaction: transaction,
      msg: "Transaction Deleted",
    };
  }

  public static async showTenRecords(user_id) {
    const transaction = await Transaction.query()
      .where("user_id", user_id)
      .limit(10)
      .orderBy("created_at", "desc");
    return {
      transaction: transaction,
      msg: "last 10 records ",
    };
  }

  public static async showByTime(user_id, timeId) {
    switch (timeId) {
      case "today":
        const today = await Transaction.query()
          .select()
          .where("created_at", ">=", DateTime.now().startOf("day").toISO())
          .andWhere("created_at", "<=", DateTime.now().endOf("day").toISO())
          .andWhere("user_id", user_id);
        return {
          today: today,
          msg: "Today's records ",
        };
      case "week":
        const week = await Transaction.query()
          .where("created_at", ">=", DateTime.now().startOf("week").toISO())
          .andWhere("created_at", "<=", DateTime.now().endOf("week").toISO())
          .andWhere("user_id", user_id);
        return {
          week: week,
          msg: "This week's records ",
        };
      case "month":
        const month = await Transaction.query()
          .where("created_at", ">=", DateTime.now().startOf("month").toISO())
          .andWhere("created_at", "<=", DateTime.now().endOf("month").toISO())
          .andWhere("user_id", user_id);
        return {
          month: month,
          msg: "this month's records ",
        };

      default:
        return null;
    }
  }

  public static async ShowAnalytic(payload) {
    const user_id = payload.user_id;
    const transaction = await Transaction.query()
      .where("type", payload.type)
      .if(
        payload.type == "income",
        (query) =>{
          query.andWhere("income_category", payload.incomeCategory)
        }
      )
      .andWhere("user_id", user_id)
      .andWhereBetween("created_at", [payload.from, payload.to]);
    
    return { transaction: transaction, msg: " records are being shown" };
  }
}

export default TransactionService;
