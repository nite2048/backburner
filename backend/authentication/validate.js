import { findUserById } from '../database/db.js';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config({quiet : true});

const validate = async (req, _res, next) => {
     const cookies = parseCookies(req.headers.cookie)

     if (!cookies) {
          const err = new Error('Unauthorized');
          err.status = 401
          next(err)
     }

     const token = cookies.jwt;

     if (!token) {
          const err = new Error('User not found');
          err.status = 403
          next(err)
     }

     try {
          const decode = jsonwebtoken.verify(token, process.env.JWT_SECRET);
          const user = await findUserById(decode) // The decode is a string that contains the user id contained in the payload

          if(!user) {
               const err = new Error('User not found');
               err.status = 403
               next(err) // Stop route execution
          }

          req.user = user; // Make the user available for the subsequent middleware
          next();

     } catch (err) {
          next(err);
     }
};


function parseCookies(cookieHeader) {
     if (!cookieHeader)
         return {};

     return cookieHeader.split(';').reduce((cookies, pair) => {
          const [key, ...value] = pair.trim().split('=');
          cookies[key] = decodeURIComponent(value.join('='));

          return cookies;
     }, {});
}

export default validate;
