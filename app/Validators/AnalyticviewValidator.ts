import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Type from 'Contracts/Enums/type'
import IncomeCategory from 'Contracts/Enums/IncomeCategory'

export default class AnalyticviewValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    type:schema.enum(Object.values(Type)),
    
    incomeCategory: schema.enum.optional(Object.values(IncomeCategory) , [
      rules.requiredWhen('type', '=', 'income')
    ]),

    from: schema.date({},[
      rules.required(),
      rules.beforeOrEqual('today')
    ]),
    to:schema.date({},[
      rules.required(),

    ])
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    "*": (field, rule) => {
      return `${field} failed ${rule} validation`;
    },
  }
}