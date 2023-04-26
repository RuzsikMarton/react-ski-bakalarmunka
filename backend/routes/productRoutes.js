import express, {query} from 'express';
import Product from '../models/productModel.js';
import expressAsyncHandler from "express-async-handler";
import {isAdmin, isAuth} from "../utils.js";

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
    const products = await Product.find();
    res.send(products);
});

productRouter.post('/',isAuth, isAdmin, expressAsyncHandler(async (req,res) => {
    const newProduct = new Product({
        name: 'minta nev ' + Date.now(),
        slug: 'minta-nev-' + Date.now(),
        image: '/img/p1.jpg',
        ar: 0,
        category: 'minta kategoria',
        brand: 'minta marka',
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        description: 'minta leiras',
        sizes: ['0'],
    });
    const product = await newProduct.save();
    res.send({ message: 'Termék létrehozva', product});
})
);

productRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product) {
            product.name = req.body.name;
            product.slug = req.body.slug;
            product.ar = req.body.ar;
            product.image = req.body.image;
            product.category = req.body.category;
            product.brand = req.body.brand;
            product.countInStock = req.body.countInStock;
            product.description = req.body.description;
            product.sizes = req.body.sizes;
            await product.save();
            res.send({ message: 'Termék Frissítve' });
        } else {
            res.status(404).send({ message: 'A termék nem található' });
        }
    })
);

productRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.remove();
            res.send({message: 'Termék törölve'});
        } else {
            res.status(404).send({message: 'Product Not Found'});
        }
    })
);

productRouter.post(
    '/:id/reviews',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product) {
            if (product.reviews.find((x) => x.name === req.user.name)) {
                return res
                    .status(400)
                    .send({ message: 'Már beküldtél egy értékelést.' });
            }

            const review = {
                name: req.user.name,
                rating: Number(req.body.rating),
                comment: req.body.comment,
            };
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((a, c) => c.rating + a, 0) /
                product.reviews.length;
            const updatedProduct = await product.save();
            res.status(201).send({
                message: 'Review Created',
                review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
                numReviews: product.numReviews,
                rating: product.rating,
            });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);



const PAGE_SIZE = 8;

productRouter.get(
    '/admin',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || PAGE_SIZE;

        const products = await Product.find()
            .skip(pageSize * (page - 1))
            .limit(pageSize);
        const countProducts = await Product.countDocuments();
        res.send({
            products,
            countProducts,
            page,
            pages: Math.ceil(countProducts / pageSize),
        });
    })
);



productRouter.get(
    "/search",
    expressAsyncHandler(async (req, res) => {
        const { query } = req;
        const pageSize = query.pageSize || PAGE_SIZE;
        const page = query.page || 1;
        const category = query.category || "";
        const brand = query.brand || "";
        const ar = query.ar || "";
        const rating = query.rating || "";
        const order = query.order || "";
        const searchQuery = query.query || "";

        const queryFilter =
            searchQuery && searchQuery !== "all"
                ? {
                    name: {
                        $regex: searchQuery,
                        $options: "i",
                    },
                }
                : {};
        const categoryFilter = category && category !== "all" ? { category } : {};
        const brandFilter = brand && brand !== "all" ? { brand } : {};
        const ratingFilter =
            rating && rating !== "all"
                ? {
                    rating: {
                        $gte: Number(rating),
                    },
                }
                : {};
        const arFilter =
            ar && ar !== "all"
                ? {
                    // 1-50
                    ar: {
                        $gte: Number(ar.split("-")[0]),
                        $lte: Number(ar.split("-")[1]),
                    },
                }
                : {};
        const sortOrder =
            order === "featured"
                ? { featured: -1 }
                : order === "lowest"
                    ? { ar: 1 }
                    : order === "highest"
                        ? { ar: -1 }
                        : order === "toprated"
                            ? { rating: -1 }
                            : order === "newest"
                                ? { createdAt: -1 }
                                : { _id: -1 };

        const products = await Product.find({
            ...queryFilter,
            ...categoryFilter,
            ...brandFilter,
            ...arFilter,
            ...ratingFilter,
        })
            .sort(sortOrder)
            .skip(pageSize * (page - 1))
            .limit(pageSize);

        const countProducts = await Product.countDocuments({
            ...queryFilter,
            ...categoryFilter,
            ...brandFilter,
            ...arFilter,
            ...ratingFilter,
        });
        res.send({
            products,
            countProducts,
            page,
            pages: Math.ceil(countProducts / pageSize),
        });
    })
);

productRouter.get(
    "/categories",
    expressAsyncHandler(async (req, res) => {
        const categories = await Product.find().distinct("category");
        res.send(categories);
    })
);

productRouter.get(
    "/brands",
    expressAsyncHandler(async (req, res) => {
        const brands = await Product.find().distinct("brand");
        res.send(brands);
    })
);

productRouter.get("/slug/:slug", async (req, res) => {
    const product = await Product.findOne({ slug: { $eq: req.params.slug } });

    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: "Product not found" });
    }
});
productRouter.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});

export default productRouter;