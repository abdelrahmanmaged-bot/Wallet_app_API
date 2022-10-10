import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UserServices from "App/Services/UserMethods";

export default class UsersController {
  async signup({ request, response }: HttpContextContract) {
    return response.json(await UserServices.signup(request));
  }

  async login({ request, response, auth }: HttpContextContract) {
    return response.json(await UserServices.login(request,auth));
  }
}
