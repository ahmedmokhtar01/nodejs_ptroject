import { Router } from "express";
import { Request, Response } from 'express';
const router = Router() // this is the subrouters of the root route
import { body, oneOf, validationResult } from "express-validator";
import { inputErrorHandler } from "./moudules/input_error_middleware";
import { resolve } from "path";
import { creatProduct, deleteProduct, getAllProducts, getOneProduct, updateProduct } from "./handlers/product";
import { createUpdate, deleteUpdate, getAlllUpdates, getOneUpdate, updateUpdates } from "./handlers/update";


//SELECT * USER FROM USER
// SELECT * PRODUCT FROM PRODUCT 
// WHERE USER.ID = PRODUCT.USERID


//product stuff
router.get('/product', getAllProducts);
router.get('/product/:id', getOneProduct)
router.put('/product/:id', body("name").isString(), inputErrorHandler, updateProduct)
router.post('/product', body("name").exists().isString(), inputErrorHandler, creatProduct) // here you create a new product 
router.delete('/product/:id', deleteProduct)

//update stuff update
router.get('/update', getAlllUpdates)
router.get('/update/:id', getOneUpdate)
router.put('/update/:id',
    body('title').optional(),
    body('body').optional(),
    body('version').optional(),
    body('status').optional().isIn(['IN_PROGRESS', 'LIVE', 'DEPRECATED', 'ARCHIVED']),
    updateUpdates)
router.post('/update',
    body('title').exists().isString(),
    body('body').exists().isString(),
    body('productId').exists().isString(),
    createUpdate)
router.delete('/update/:id', deleteUpdate)

//updatePoints stuff
router.get('/updatepoints', () => { })
router.get('/updatepoints/:id', () => { })
router.put('/updatepoints/:id',
    body('name').optional().isString(),
    body('descrption').optional().isString(),
    () => { })
router.post('/updatepoints',
    body('name').exists().isString(),
    body('descrption').exists().isString(),
    () => { })
router.delete('/updatepoints', () => { })

export default router