import { Request, Response } from 'express';
import primsaC from '../db';
import { Prisma, Update } from '@prisma/client';
import { error, profileEnd } from 'console';
import { json } from 'stream/consumers';
import { pseudoRandomBytes } from 'crypto';


// updates


export const getOneUpdate = async (req: Request, res: Response) => {
    try {
        const update = await primsaC.update.findUnique({
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json({
            data: update
        })
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            massegge: "you can't update "
        })
    }
}
export const getAlllUpdates = async (req: Request, res: Response) => {
    // get all updates associated with specific user 
    try {
        const userUpdates = await primsaC.user.findMany({
            where: {
                id: req.user!.id
            },
            include: {
                product: {
                    include: {
                        updates: true
                    }
                }
            }
        })
        const update = userUpdates.map(user => user.product.map(product => product.updates.map(update => update.body)));

        res.status(200).json({ data: update })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}
export const createUpdate = async (req: Request, res: Response) => {

    try {
        const product = await primsaC.product.findUnique({
            where: {
                id: req.body.productId
            }
        })
        if (!product) {
            res.status(404).json({ error: "can't find this product " })
        }
        const { title, body, version } = req.body;
        const productId = product!.id
        const update = await primsaC.update.create({
            data: {
                title: title,
                body: body,
                version: version, // Set default value to null if not provided
                updateAt: new Date(), // Manually setting the current date/time
                productId: productId,
            }
        })

        return res.status(200).json({
            data: update
        })
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}
export const updateUpdates = async (req: Request, res: Response) => {
    try {
        const products = await primsaC.product.findMany({
            where: {
                ownerId: req.user!.id
            },
            include: {
                updates: true
            }
        })

        const updates = products.flatMap(product => product.updates)
        const match = updates.find(update => update.id == req.params.id)
        if (!match) {
            return res.json({ error: "soryy" })
        }
        const updatedUpdate = await primsaC.update.update({
            where: {
                id: req.params.id
            },
            data: {
                title: req.body.title,
                body: req.body.body,
                updateAt: new Date()
            }
        })

        return res.status(200).json({ data: updatedUpdate })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}
export const deleteUpdate = async (req: Request, res: Response) => {
    try {
        const products = await primsaC.product.findMany({
            where: {
                ownerId: req.user!.id
            },
            include: {
                updates: true
            }

        })

        const updates = products.flatMap(product => product.updates)
        console.log(updates.map(update => update.id))
        const match = updates.find(update => update.id === req.params.id)
        if (!match) {
            return res.json({ error: "soryy" })
        }

        const deleteUpdate = await primsaC.update.delete({
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json({ data: deleteUpdate })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}