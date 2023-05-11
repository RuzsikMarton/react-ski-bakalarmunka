import {Button, Col, Container, Row} from "react-bootstrap";
import TemperatureBar from "../komponensek/TemperatureBar";
import {useEffect, useReducer, useState} from "react";
import axios from "axios";
import {getError} from "../utils";
import LoadingBox from "../komponensek/LoadingBox";
import MessageBox from "../komponensek/MessageBox";
import {DatePicker} from "antd";
import moment from "moment";
import {Helmet} from "react-helmet-async";
const {RangePicker} = DatePicker;

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                december: action.payload.december,
                januar: action.payload.januar,
                februar: action.payload.februar,
                marcius: action.payload.marcius,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'WEATHER_REQUEST':
            return { ...state, loading: true };
        case 'WEATHER_SUCCESS':
            return {
                ...state,
                weather: action.payload.weather,
                loading: false,
            };
        case 'WEATHER_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

function disabledDate(current) {
    return( (current && (current < moment('2023-12-01') || current > moment('2024-04-01'))))
}


function WeatherScreen() {

    const [{loading, error, weather}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    })

    const [bdate, setBDate] = useState();
    const [edate, setEDate] = useState();
    const [lowtemp ,setLowTemp] = useState();
    const [hightemp ,setHighTemp] = useState();
    const [avgtemp ,setAvgTemp] = useState();

    const [minsnow, setMinSnow] = useState();
    const [maxsnow, setMaxSnow] = useState();

    const [lowtempd ,setLowTempD] = useState();
    const [hightempd ,setHighTempD] = useState();
    const [avgtempd ,setAvgTempD] = useState();
    const [minsnowd, setMinSnowD] = useState();
    const [maxsnowd, setMaxSnowD] = useState();

    const [lowtempj ,setLowTempJ] = useState();
    const [hightempj,setHighTempJ] = useState();
    const [avgtempj ,setAvgTempJ] = useState();
    const [minsnowj, setMinSnowJ] = useState();
    const [maxsnowj, setMaxSnowJ] = useState();

    const [lowtempf ,setLowTempF] = useState();
    const [hightempf,setHighTempF] = useState();
    const [avgtempf ,setAvgTempF] = useState();
    const [minsnowf, setMinSnowF] = useState();
    const [maxsnowf, setMaxSnowF] = useState();

    const [lowtempm ,setLowTempM] = useState();
    const [hightempm,setHighTempM] = useState();
    const [avgtempm ,setAvgTempM] = useState();
    const [minsnowm, setMinSnowM] = useState();
    const [maxsnowm, setMaxSnowM] = useState();

    useEffect(() => {
        const fetchData = async (dbdate,dedate,jbdate,jedate,fbdate,fedate,mbdate,medate) => {
            dispatch({type: 'FETCH_REQUEST'});
            try {
                const {data} = await axios.get("/api/weather/all",{params: {dbdate,dedate,jbdate,jedate,fbdate,fedate,mbdate,medate}
                });
                dispatch({ type: "FETCH_SUCCESS", payload: data});
                //dec
                let temp = data.december.map(item => item.temperature);
                setLowTempD(Math.min(...temp));
                setHighTempD(Math.max(...temp));
                let sum = temp.reduce((acc, curr) => acc + curr, 0);
                let avg = sum / temp.length;
                setAvgTempD(Math.round(avg));
                let snows = data.december.map(item => item.snow);
                setMinSnowD(Math.min(...snows));
                setMaxSnowD(Math.max(...snows))
                //jan
                temp = data.januar.map(item => item.temperature);
                setLowTempJ(Math.min(...temp));
                setHighTempJ(Math.max(...temp));
                sum = temp.reduce((acc, curr) => acc + curr, 0);
                avg = sum / temp.length;
                setAvgTempJ(Math.round(avg));
                snows = data.januar.map(item => item.snow);
                setMinSnowJ(Math.min(...snows));
                setMaxSnowJ(Math.max(...snows))
                //feb
                temp = data.februar.map(item => item.temperature);
                setLowTempF(Math.min(...temp));
                setHighTempF(Math.max(...temp));
                sum = temp.reduce((acc, curr) => acc + curr, 0);
                avg = sum / temp.length;
                setAvgTempF(Math.round(avg));
                snows = data.februar.map(item => item.snow);
                setMinSnowF(Math.min(...snows));
                setMaxSnowF(Math.max(...snows))
                //mar
                temp = data.marcius.map(item => item.temperature);
                setLowTempM(Math.min(...temp));
                setHighTempM(Math.max(...temp));
                sum = temp.reduce((acc, curr) => acc + curr, 0);
                avg = sum / temp.length;
                setAvgTempM(Math.round(avg));
                snows = data.marcius.map(item => item.snow);
                setMinSnowM(Math.min(...snows));
                setMaxSnowM(Math.max(...snows))

            } catch (err) {
                dispatch({
                    type: "FETCH_FAIL",
                    payload: getError(err),
                });
            }
        }
        fetchData('2023-12-01','2023-12-31','2024-01-01','2024-01-31','2024-02-01','2024-02-29','2024-03-01','2024-03-31')
    },[])

    function selectTimeSlots(values){
        setBDate(values[0].format('YYYY-MM-DD'))
        setEDate(values[1].format('YYYY-MM-DD'))
    }

    const weatherHandler = (e) =>{
        e.preventDefault()
        const fetchWeather = async (bdate,edate) => {
            try {
                const {data} = await axios.get("/api/weather",{params: {bdate,edate}
                });
                dispatch({ type: "WEATHER_SUCCESS", payload: data});

                const temp = data.map(item => item.temperature);
                setLowTemp(Math.min(...temp));
                setHighTemp(Math.max(...temp));
                const sum = temp.reduce((acc, curr) => acc + curr, 0);
                const avg = sum / temp.length;
                setAvgTemp(Math.round(avg));

                const snows = data.map(item => item.snow);
                setMinSnow(Math.min(...snows));
                setMaxSnow(Math.max(...snows))
            } catch (err) {
                dispatch({
                    type: "WEATHER_FAIL",
                    payload: getError(err),
                });
            }
        };
        fetchWeather(bdate,edate);
        console.log(bdate,edate)

    }

    return(
        loading ? (<LoadingBox></LoadingBox>
        ) : error ? (
            <MessageBox variant={"danger"}>{error}</MessageBox>) :
            (<Container>
                <Helmet><title>Időjárás</title></Helmet>
                <Row className={'mt-3 mb-3'}>
                    <Col md={6}><h2 className={'d-flex justify-content-center text-bold'}>December</h2><TemperatureBar value={avgtempd} mintemp={lowtempd} maxtemp={hightempd} minheight={minsnowd} maxheight={maxsnowd}></TemperatureBar></Col>
                    <Col md={6}><h2 className={'d-flex justify-content-center text-bold'}>Január</h2><TemperatureBar value={avgtempj} mintemp={lowtempj} maxtemp={hightempj} minheight={minsnowj} maxheight={maxsnowj}></TemperatureBar></Col>
                </Row>
                <Row className={'mt-5'}>
                    <Col md={6}><h2 className={'d-flex justify-content-center text-bold'}>Február</h2><TemperatureBar value={avgtempf} mintemp={lowtempf} maxtemp={hightempf} minheight={minsnowf} maxheight={maxsnowf}></TemperatureBar></Col>
                    <Col md={6}><h2 className={'d-flex justify-content-center text-bold'}>Március</h2><TemperatureBar value={avgtempm} mintemp={lowtempm} maxtemp={hightempm} minheight={minsnowm} maxheight={maxsnowm}></TemperatureBar></Col>
                </Row>
                <Row className={'mt-3'}>
                    <h3><b>Itt megmézheted a várható időjárást:</b></h3><br/>
                    &nbsp; <RangePicker disabledDate={disabledDate} className={'mb-3'} format={'YYYY-MM-DD'} style={{ width: '60%' }} onChange={selectTimeSlots}></RangePicker >  &nbsp;&nbsp;&nbsp; <Button className={'mb-3'} style={{ width: '25%' }} onClick={weatherHandler}>Kérem az időjárás előrejelzést</Button>
                </Row>
                {avgtemp ? (<div><TemperatureBar value={avgtemp} mintemp={lowtemp} maxtemp={hightemp} minheight={minsnow} maxheight={maxsnow}></TemperatureBar></div>) : (<div></div>)}
            </Container>)

    )
}
 export default WeatherScreen;