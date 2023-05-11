import express from "express";
import Weather from "../models/weatherModel.js";
import {isAdmin, isAuth} from "../utils.js";
import expressAsyncHandler from "express-async-handler";

const weatherRouter = express.Router();

weatherRouter.get('/', async (req, res) => {
    const startDate = req.query.bdate;
    const endDate = req.query.edate;
    const query = {dateW: {$gte: startDate, $lte: endDate}}
    const weather = await Weather.find(query);
    res.send(weather);
});

weatherRouter.get('/all', async (req, res) => {
    const startDateD = req.query.dbdate;
    const endDateD = req.query.dedate;
    const dquery = {dateW: {$gte: startDateD, $lte: endDateD}}
    const december = await Weather.find(dquery);

    const startDateJ = req.query.jbdate;
    const endDateJ = req.query.jedate;
    const jquery = {dateW: {$gte: startDateJ, $lte: endDateJ}}
    const januar = await Weather.find(jquery);

    const startDateF = req.query.fbdate;
    const endDateF = req.query.fedate;
    const fquery = {dateW: {$gte: startDateF, $lte: endDateF}}
    const februar = await Weather.find(fquery);

    const startDateM = req.query.mbdate;
    const endDateM = req.query.medate;
    const mquery = {dateW: {$gte: startDateM, $lte: endDateM}}
    const marcius = await Weather.find(mquery);
    res.send({december,januar,februar,marcius});
});

weatherRouter.post('/',isAuth, isAdmin, expressAsyncHandler(async (req,res) => {
    const newWeather = new Weather({
        dateW: new Date('2023-10-31'),
        snow: 0,
        temperature: 0,
    });
    const weather = await newWeather.save();
    res.send({ message: "Created ", weather});
}));



const PAGE_SIZE = 12;
weatherRouter.get(
    '/admin',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || PAGE_SIZE;

        const weathers = await Weather.find()
            .skip(pageSize * (page - 1))
            .limit(pageSize);
        const countWeathers = await Weather.countDocuments();
        res.send({
            weathers,
            countWeathers,
            page,
            pages: Math.ceil(countWeathers / pageSize),
        });
    })
);

weatherRouter.put('/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const weatherId = req.params.id;
        const weather = await Weather.findById(weatherId);
        if (weather) {
            weather.dateW = req.body.dateW;
            weather.snow = req.body.snow;
            weather.temperature = req.body.temperature;
            await weather.save();
            res.send({ message: 'Weather Frissítve' });
        } else {
            res.status(404).send({ message: 'A weather nem található' });
        }
    }))

weatherRouter.get('/:id', async (req, res) => {
    const weather = await Weather.findById(req.params.id);
    if (weather) {
        res.send(weather);
    } else {
        res.status(404).send({ message: 'Weather Not Found' });
    }
});
export default weatherRouter;