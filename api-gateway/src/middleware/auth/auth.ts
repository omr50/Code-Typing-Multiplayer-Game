import jwt, { Secret, JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.secretkey;

// Extend request to add new 
// token parameter to it.
export interface CustomRequest extends Request {
  token: string | JwtPayload;
 }

 // if they have correct jwt, let them through.
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('req body', req.body)
    const username = req.params.user;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log("u + t", username, token)
    if (!token) {
      throw new Error();
    }
 
    const decoded = jwt.verify(token, SECRET_KEY!);
    console.log("decoded",decoded)
    if (typeof decoded == 'string' || !('user' in decoded)) {
      console.log("EITHER STRING OR NOT USER")
      throw new Error();
    } 
    else {
      if (username != decoded.user) {
        console.log("NOT EQUAL")
        throw new Error();
      }
    }
    (req as CustomRequest).token = decoded;
 
    return next();

  } catch (err) {
    console.log("error", err)
    res.status(401).send('Authentication Error!');
  }
 };

 // so this auth middleware will check the token it recieves from the request
 // auth headers. If the token is valid then return next() which allows it to 
 // pass to whatever endpoint it wants to pass to, otherwise you get a 401
 // error.