import express, {query} from 'express';
import Skipass from "../models/skipassModel.js";

const skipassRouter = express.Router();

skipassRouter.get(
    '/',
    async (req, res) => {
        const skipass = await Skipass.find();
        res.send(skipass);
    })
skipassRouter.get('/:id', async (req, res) => {
    const product = await Skipass.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});

export default skipassRouter;