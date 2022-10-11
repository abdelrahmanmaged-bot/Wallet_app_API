import User from "App/Models/User";
import CreateUserValidator from "App/Validators/CreateUserValidator";


class UserServices {
  public static async signup(request) {
    const data = await request.validate(CreateUserValidator);
    data.balance = 0;

    const user = await User.create(data);

    return { user: user, message: "User added" };
  }

  

  public static async login(request, auth) {
    var { uid, password } = request.only(["uid", "password"]);
    try {
      const token = await auth
        .use("api")
        .attempt(uid, password, { expiresIn: "10 days" });
      return token;
    } catch {
      return "Invalid credentials";
    }
  }
}

export default UserServices;
