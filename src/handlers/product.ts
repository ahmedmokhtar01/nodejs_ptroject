import { Request, Response } from 'express';
import primsaC from '../db'





// get all products
export const getAllProducts = async (req: Request, res: Response) => {
    try {

        const user = await primsaC.user.findUnique({
            where: {
                id: req.user!.id
            },
            include: {
                product: true
            }
        })
        return res.json({
            data: user!.product
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}

// get one product  

export const getOneProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const product = await primsaC.product.findFirst({
            where: {
                id: productId,
                ownerId: req.user!.id
            }

        })

        return res.json({ data: product })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// create product 
export const creatProduct = async (req: Request, res: Response) => {

    try {
        const product = await primsaC.product.create({
            data: {
                name: req.body.name,
                ownerId: req.user!.id
            }
        })
        return res.status(201).json({ data: product });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// update product 
export const updateProduct = async (req: Request, res: Response) => {

    try {
        const { name } = req.body;
        const { productId } = req.params;
        const userId = req.user!.id;

        const isProduct = await primsaC.product.findUnique({
            where: {
                id: productId,
                ownerId: userId
            }
        })

        if (!isProduct) {
            return res.status(404).json({ error: "this product doesn't exist to update it" })
        }

        const updatedProduct = await primsaC.product.update({
            where: { id: productId },
            data: { name }
        })
        return res.status(201).json({ data: updatedProduct })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}



export const deleteProduct = async (req: Request, res: Response) => {

    try {
        const productId = req.params.id;
        const userId = req.user!.id;

        const isProduct = await primsaC.product.findUnique({
            where: {
                id: productId,
                ownerId: userId
            }
        })

        if (!isProduct) {
            return res.status(404).json({ error: "this product doesn't exist to delete it" })
        }
        const product = await primsaC.product.delete({
            where: {
                id: productId,
                ownerId: userId
            }
        })
        return res.status(201).json({ data: product })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}

