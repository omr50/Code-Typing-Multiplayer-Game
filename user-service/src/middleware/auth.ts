import jwt, { Secret, JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';

const dotenv = require('dotenv');
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
    const token = req.header('Authorization')?.replace('Bearer ', '');
 
    if (!token) {
      throw new Error();
    }
 
    const decoded = jwt.verify(token, SECRET_KEY!);
    (req as CustomRequest).token = decoded;
 
    return next();

  } catch (err) {
    res.status(401).send('Please authenticate');
  }
 };

 // so this auth middleware will check the token it recieves from the request
 // auth headers. If the token is valid then return next() which allows it to 
 // pass to whatever endpoint it wants to pass to, otherwise you get a 401
 // error.