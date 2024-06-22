import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from 'express';

export const inputErrorHandler = (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        console.log
        return res.status(400).json({ error: error.array() })
    } else {
        next();
    }
}   