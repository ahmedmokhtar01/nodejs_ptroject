import prismaC from "../db";
import { NextFunction, Request, Response } from 'express';
import { comparePasword, createJWT, hashPasword } from "../moudules/auth";


export const createNewUser = async (req: Request, res: Response) => {
    try {
        const user = await prismaC.user.create({
            data: {
                username: req.body.username,
                password: await hashPasword(req.body.password)
            }
        })
        const token = createJWT(user);
        res.status(200).json({ token })
    } catch (e) {
        console.log(e)
    }

}

export const signIn = async (req: Request, res: Response) => {
    try {
        const user = await prismaC.user.findUnique({
            where: {
                username: req.body.username,
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isValid = await comparePasword(req.body.password, user.password);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = createJWT(user);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
}
