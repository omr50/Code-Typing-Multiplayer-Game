import User from "../../sequelize-config/models/User";
import bcrypt from 'bcrypt'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { userSchema } from "../../schemas/userSchema";
const dotenv = require('dotenv');
dotenv.config();
const SECRET_KEY = process.env.secretkey;


async function signup(user: userSchema) { 
  if (!user)
    throw new Error('Enter valid Credentials!');

    const existing_Username = await User.findOne({
      where: {
        username: user.username
      }
    });

    const existing_Email = await User.findOne({
      where: {
        email: user.email
      }
    });

    if (existing_Email) {
      throw new Error('Email already exists!')
    }

    if (existing_Username) {
      throw new Error('Username already exists!')
    }

    // create user.
    await User.create({
      email: user.email,
      username: user.username,
      password: user.password,
    });
}

export default signup