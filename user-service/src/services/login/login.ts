import User from "../../sequelize-config/models/User";
import bcrypt from 'bcrypt'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { loginSchema } from "../../schemas/userSchema";
const dotenv = require('dotenv');
dotenv.config();
const SECRET_KEY = process.env.secretkey;


export async function login(user: loginSchema) {
    console.log(user.username, user.password)
    const foundUser = await User.findOne({
      where: {
        username: user.username
      }
    });
 
    if (!foundUser) {
      console.log('didnt find user!')
      throw new Error();
    }
 
    const isMatch = bcrypt.compareSync(user.password.toString(), foundUser.password.toString());
    console.log("password is " + isMatch)
    if (isMatch) {
      console.log('works')
      const payload = {user: foundUser.username}
      const token = jwt.sign(payload, SECRET_KEY!, { expiresIn: '2d' });
 
      return { name: foundUser.username, token: token };
    } else {
      throw new Error();
    }
}