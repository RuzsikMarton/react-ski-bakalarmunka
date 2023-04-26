import React, {useContext, useEffect, useReducer, useState} from "react";
import {Form, Row, Col, Button, Card} from "react-bootstrap";
import Skipass from "../komponensek/Skipass";
import {DatePicker} from "antd";
import {Store} from "../Store";
import axios from "axios";
import {getError} from "../utils";
import LoadingBox from "../komponensek/LoadingBox";
import moment from "moment";
import TemperatureBar from "../komponensek/TemperatureBar";
import {useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet-async";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                skipass: action.payload,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'WEATHER_REQUEST':
            return { ...state, loading: true };
        case 'WEATHER_SUCCESS':
            return {
                ...state,
                weather: action.payload,
                loading: false,
            };
        case 'WEATHER_FAIL':
            return { ...state, loading: false, error: action.payload };


        default:
            return state;
    }
};

function SkiPassScreen(){

    const [{ loading, error, skipass, weather}, dispatch] =
        useReducer(reducer, {
            skipass: [],
            loading: true,
            error: '',
        });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get("/api/skipass",{
                });
                dispatch({ type: "FETCH_SUCCESS", payload: data});
            } catch (err) {
                dispatch({
                    type: "FETCH_FAIL",
                    payload: getError(err),
                });
            }
        };
        fetchData();
    },[]);

    const [product, setProduct] = useState({});
    const [duration, setDuration] = useState('');
    const [date, setDate] = useState();
    const [person, setPerson] = useState('');
    const [from, setStartDate] = useState();
    const [to, setEndDate] = useState();

    const [bdate, setBDate] = useState();
    const [edate, setEDate] = useState();

    const [totalAmount, setTotalAmount] = useState(0);

    const [getarea, setGetArea] = useState('');
    const [getduration, setGetDuration] = useState('');
    const [getperson, setGetPerson] = useState('');
    const [getstartDate, setGetStartDate] = useState();
    const [getendDate, setGetEndDate] = useState();
    const [getData, setGetData] = useState(false);

    const [lowtemp ,setLowTemp] = useState();
    const [hightemp ,setHighTemp] = useState();
    const [avgtemp ,setAvgTemp] = useState();

    const [minsnow, setMinSnow] = useState();
    const [maxsnow, setMaxSnow] = useState();
    const [avgsnow, setAvgSnow] = useState();


    function disabledDate(current) {
        if (duration === '2'){
            return (current && (current < moment('2023-12-01') || current > moment('2024-03-31')))
        } else if (duration === '3'){
            return (current && (current < moment('2023-12-01') || current > moment('2024-03-30')))
        } else if (duration === '7'){
            return (current && (current < moment('2023-12-01') || current > moment('2024-03-26')))
        } else if (duration === '14'){
            return (current && (current < moment('2023-12-01') || current > moment('2024-03-19')))
        } else{
            return (current && (current < moment('2023-12-01') || current > moment('2024-04-01')))
        }
    }


    function selectDate(value){
        setDate(value.format('DD/MM/YYYY'));
        setStartDate(value.format('DD/MM/YYYY'))
        setEndDate(value.add(parseInt(duration-1,10), 'days').format('DD/MM/YYYY'));
        setBDate(value.format('YYYY-MM-DD'));
        setEDate(value.add(parseInt(duration-1,10), 'days').format('YYYY-MM-DD'));
    }

    const getPriceHandler = (e) => {
        e.preventDefault();
        const fetchData = async () => {
            try {
                const {data} = await axios.get("/api/skipass",{
                });
                dispatch({ type: "FETCH_SUCCESS", payload: data});
            } catch (err) {
                dispatch({
                    type: "FETCH_FAIL",
                    payload: getError(err),
                });
            }
        };
        fetchData();
        const fetchWeather = async (bdate,edate) => {
            try {
                const {data} = await axios.get("/api/weather",{params: {bdate,edate}
                });
                dispatch({ type: "WEATHER_SUCCESS", payload: data});
                console.log(weather);

                const temp = data.map(item => item.temperature);
                setLowTemp(Math.min(...temp));
                setHighTemp(Math.max(...temp));
                const sum = temp.reduce((acc, curr) => acc + curr, 0);
                const avg = sum / temp.length;
                setAvgTemp(Math.round(avg));

                const snows = data.map(item => item.snow);
                setMinSnow(Math.min(...snows));
                setMaxSnow(Math.max(...snows))
                const sumsnow = snows.reduce((acc, curr) => acc + curr, 0);
                const avgs = sumsnow / snows.length;
                setAvgSnow(Math.round(avgs));
                if((avg > -1 || avg < -5) && avgs < 50){
                    if(duration==='Teljes szezon'){
                        setTotalAmount((product.ar*15)*0.8);
                    }else{
                        setTotalAmount((product.ar*duration)*0.8);
                    }
                } else if((avg > -1 || avg < -5) || avgs < 50){
                    if(duration==='Teljes szezon'){
                        setTotalAmount((product.ar*15)*0.9);
                    }else{
                        setTotalAmount((product.ar*duration)*0.9);
                    }
                } else {
                    if(duration==='Teljes szezon'){
                        setTotalAmount(product.ar*15);
                    }else{
                        setTotalAmount(product.ar*duration);
                    }
                }
            } catch (err) {
                dispatch({
                    type: "WEATHER_FAIL",
                    payload: getError(err),
                });
            }
        };

        fetchWeather(bdate,edate);

        setGetPerson(person);
        setGetArea(product.name);
        setGetDuration(duration);
        setGetStartDate(from);
        setGetEndDate(to);
        setGetData(true);
    }

    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {cart} = state;
    const checkoutHandler = async () => {
            const existItem = cart.cartItems.find((x) => x._id === product._id && x.from === from && x.to === to);
            const quantity = existItem ? existItem.quantity + 1 : 1;
            const totalDays = duration;
            console.log(quantity);
            product.name = 'Skipass - ' + product.name + ' ' + person.toString() + ' ' + 'személyre';
            ctxDispatch({
                type: 'CART_ADD_ITEM',
                payload: {...product, quantity, from, to, totalDays, totalAmount}
            });
            navigate('/kosar');
    }


    return(
        <div>
            <Helmet><title>Skipass</title></Helmet>
            <Card className={"my-5 p-3 shadow"} style={{background: '#f9f9f9'}}>
            <Form className={"my-3 mx-3"} onSubmit={getPriceHandler}>
                <Row>
                    <Col>
                        <h2 className={"mb-3 text-bold"} style={{fontSize: '2rem'}}>Skipass</h2>
                        <p>
                            Legideálisabb körülmények a síeléshez:
                        </p>
                        <ul className={'ul-skipass'}>
                            <li className={'li-skipass'}>A legideálisabb homersékletet a síeléshez a -5 és -1 Celsius fok közti tartományt tekintik.</li>
                            <li className={'li-skipass'}>A legideálisabb hó magasság 50cm fellett található.</li>
                        </ul>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className={"mb-3"} controlId={"areaForm"}>
                            <Form.Label>Skipass felvonók</Form.Label>
                            <Form.Select name={"skipass"} onChange={(e) => setProduct(JSON.parse(e.target.value))} required>
                                <option hidden value={''}>Válassz skipass fajtát</option>
                                {skipass.map((item) => (
                                    <option key={item._id} value={JSON.stringify(item)}>{item.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className={"mb-3"} controlId={"durationForm"}>
                            <Form.Label>Időtartam</Form.Label>
                            <Form.Select name={"duration"} onChange={(e) => {
                                if(e.target.value === '10'){
                                    setDuration('Teljes szezon')
                                    setDate('01/12/2023')
                                    setStartDate('01/12/2023')
                                    setEndDate('31/3/2024')
                                    setBDate('2023-12-01')
                                    setEDate('2024-3-31')
                                }else {
                                    setDuration(e.target.value)
                                    setDate('')
                                }
                                console.log(from,to,duration)
                            }} required>
                                <option value={"0"} hidden>Duration</option>
                                <option value={"1"}>1 nap</option>
                                <option value={"2"}>2 nap</option>
                                <option value={"3"}>3 nap</option>
                                <option value={"7"}>7 nap</option>
                                <option value={"14"}>14 nap</option>
                                <option value={"10"}>Egész szezon</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className={"mb-3"} controlId={"dateForm"}>
                            <Form.Label>Dátum</Form.Label><br/>
                            {duration === 'Teljes szezon' ? (
                                <DatePicker
                                    size={'large'}
                                    format='DD/MM/YYYY'
                                    disabled
                                    value={null}
                                    placeholder={''}
                                />
                            ) : (
                                <DatePicker
                                    id={'datepicker'}
                                    name="date"
                                    size={'large'}
                                    format='DD/MM/YYYY'
                                    onChange={selectDate}
                                    required
                                    disabledDate={disabledDate}
                                    placeholder={'Válassz dátumot'}
                                />
                            )}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className={"mb-3"} controlId={"personForm"}>
                            <Form.Label>Személyek</Form.Label>
                            <Form.Control type={'number'} placeholder={"Jegyek száma"} onChange={(e) => setPerson(e.target.value)} min="1" required></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Label>{' '}</Form.Label><br/>
                        <Button className={"mx-auto my-auto"} type={"submit"} disabled={product === '' || duration === '' || date === '' ||  person === ''}>Kérem az ajánlatot</Button>
                    </Col>
                </Row>
            </Form>
            </Card>
            {weather ? (<div><Skipass area={getarea} duration={getduration} startDate={getstartDate} endDate={getendDate} person={getperson} avgtemp={avgtemp} avgsnow={avgsnow} checkoutHandler={checkoutHandler} totalPrice={totalAmount*getperson} getData={getData}></Skipass>
                    <Row className={"mt-5"}>
                        <Col>
                            <TemperatureBar value={avgtemp} mintemp={lowtemp} maxtemp={hightemp} minheight={minsnow} maxheight={maxsnow}></TemperatureBar>
                        </Col>
                    </Row>
                </div>)
                : <div></div>}
        </div>
    )
}
export default SkiPassScreen;