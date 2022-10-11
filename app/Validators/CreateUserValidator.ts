import { schema,rules ,CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: "users", column: "email" }),
    ]),

    phone_number: schema.string([
        rules.mobile({ strict: true }),
        rules.unique({ table: "users", column: "phone_number" })
    ]),

    name: schema.string({ trim: true }, [rules.alpha()]),


    password: schema.string({}, [rules.minLength(8)]),
  });

   public messages: CustomMessages = {
    "*": (field, rule) => {
      return `${field} failed ${rule} validation`;
    },
  };
}
