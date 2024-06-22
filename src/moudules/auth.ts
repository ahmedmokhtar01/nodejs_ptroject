import jwt, { Secret } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

const secrete = process.env.JWT_SEC!;

declare global {
    namespace Express {
        interface Request {
            user?: User; // Make this property optional, or type it as needed
        }
    }
}


export const comparePasword = (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
}

export const hashPasword = (password: string) => {
    return bcrypt.hash(password, 10); //this number 10 refer to make hashing more complex
}



export const createJWT = (user: User) => {
    const token = jwt.sign({ id: user.id, username: user.username }, secrete)
    return token;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        res.status(401);
        res.json({
            massegs: "doesn't authorziation",
        })
        return
    }
    const [, token] = bearer.split(" ")

    if (!token) {
        res.status(401);
        res.json({
            massegs: "sorry you don't have access ",
        })
        return
    }
    try {
        const user = jwt.verify(token, secrete as Secret);
        req.user = user as User
        next();
        return;
    } catch (e) {
        res.status(401);
        res.json({
            massage: "you havn't access "
        })
    }
}

