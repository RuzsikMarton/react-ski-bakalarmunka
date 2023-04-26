import React, {useContext, useEffect, useReducer, useState} from "react";
import CheckoutSteps from "../komponensek/CheckoutSteps";
import {Helmet} from "react-helmet-async";
import {useNavigate} from "react-router-dom";
import {Store} from "../Store";
import {
    Button, Card,
    Col,
    Container,
    FormSelect,
    ListGroup,
    ListGroupItem,
    Row,
} from "react-bootstrap";
import {Radio, DatePicker} from "antd";
import moment from "moment";
import axios from "axios";
import {getError} from "../utils";
import TemperatureBar from "../komponensek/TemperatureBar";
import {toast} from "react-toastify";

const {RangePicker} = DatePicker;

const reducer = (state, action) => {
    switch (action.type){
        case 'WEATHER_REQUEST':
            return { ...state, loading: true };
        case 'WEATHER_SUCCESS':
            return {
                ...state,
                weatherSzallas: action.payload,
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

function AccomodationScreen(){

    const [{ loading, error,  weatherSzallas}, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });

    const navigate = useNavigate();
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo, cart: {accomodationData},} = state;

    const [wantRoom, setWantRoom] = useState(accomodationData.wantRoom || true);
    const [roomType, setRoomType] = useState(accomodationData.roomType || '');
    const [fromRoom, setFromRoom] = useState(accomodationData.fromRoom || '');
    const [toRoom, setToRoom] = useState(accomodationData.toRoom || '');
    const [totalDaysRoom, setTotalDaysRoom] = useState(accomodationData.totalDaysRoom || '0');
    const [totalAmountRoom, setTotalAmountRoom] = useState(accomodationData.totalAmountRoom || '0');

    const [selectedImage, setSelectedImage] = useState('');

    const [lowtemp ,setLowTemp] = useState();
    const [hightemp ,setHighTemp] = useState();
    const [avgtemp ,setAvgTemp] = useState();

    const [minsnow, setMinSnow] = useState();
    const [maxsnow, setMaxSnow] = useState();
    const [avgsnow, setAvgSnow] = useState();

    const ketszemely = ['https://res.cloudinary.com/dv5xeklce/image/upload/v1682448519/Szobak/2szemely/221-2753-medium_ekutpv.jpg','https://res.cloudinary.com/dv5xeklce/image/upload/v1682448529/Szobak/2szemely/221-2754-medium_r6uekk.jpg','https://res.cloudinary.com/dv5xeklce/image/upload/v1682448538/Szobak/2szemely/221-2758-medium_j8vafm.jpg'];
    const haromszemely = ['https://res.cloudinary.com/dv5xeklce/image/upload/v1682448723/Szobak/3szemely/79-2752-medium_pbhamx.jpg','https://res.cloudinary.com/dv5xeklce/image/upload/v1682448715/Szobak/3szemely/79-2372-medium_xznz8k.jpg','https://res.cloudinary.com/dv5xeklce/image/upload/v1682448732/Szobak/3szemely/79-2755-medium_d8krcz.jpg'];
    const negyszemely = ['https://res.cloudinary.com/dv5xeklce/image/upload/v1682448826/Szobak/4szemely/82-2222-medium_tyvhzz.jpg','https://res.cloudinary.com/dv5xeklce/image/upload/v1682448834/Szobak/4szemely/82-2224-medium_kwrsls.jpg','https://res.cloudinary.com/dv5xeklce/image/upload/v1682448843/Szobak/4szemely/82-2776-medium_muygtb.jpg'];


    useEffect(() => {
        if(toRoom === ''){
            return;
        }else{
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
                    const sumsnow = snows.reduce((acc, curr) => acc + curr, 0);
                    const avgs = sumsnow / snows.length;
                    setAvgSnow(Math.round(avgs));

                    if(roomType === '2 személyes szoba'){
                        if(avg > -1 || avg < -5){
                            setTotalAmountRoom(140*totalDaysRoom*0.8.toFixed(2))
                        }else{
                            setTotalAmountRoom(140*totalDaysRoom.toFixed(2))
                        }
                    }else if(roomType === '3 személyes szoba'){
                        if(avg > -1 || avg < -5){
                            setTotalAmountRoom(190*totalDaysRoom*0.8.toFixed(2))
                        }else{
                            setTotalAmountRoom(190*totalDaysRoom.toFixed(2))
                        }
                    }
                    else if(roomType === '4 személyes szoba'){
                        if(avg > -1 || avg < -5){
                            setTotalAmountRoom(260*totalDaysRoom*0.8.toFixed(2))
                        }else{
                            setTotalAmountRoom(260*totalDaysRoom.toFixed(2))
                        }
                    }else{
                        setTotalAmountRoom(0);
                    }
                } catch (err) {
                    dispatch({
                        type: "WEATHER_FAIL",
                        payload: getError(err),
                    });
                }
            };
            fetchWeather(fromRoom,toRoom);

        }
    },[toRoom,fromRoom,roomType,totalDaysRoom]);


    function selectTimeSlots(values){
        setFromRoom(values[0].format('YYYY-MM-DD'));
        setToRoom(values[1].format('YYYY-MM-DD'));
        setTotalDaysRoom(values[1].diff(values[0], "days")+1);
    }

    const submitHandler = () => {
        if(!wantRoom){
            ctxDispatch({
                type: 'SAVE_ACCOMODATION_DATA',
                payload: {
                    wantRoom,
                },
            });
            localStorage.setItem('accomodationData',
                JSON.stringify({
                    wantRoom,
                })
            );
            navigate('/shipping');
        }else{
            if(roomType === ''){
                toast.error('Nincs választva szoba');
                return;
            }
            if(fromRoom === ''){
                toast.error('Nincs választva dátum');
                return;
            }
            ctxDispatch({
                type: 'SAVE_ACCOMODATION_DATA',
                payload: {
                    wantRoom,
                    roomType,
                    fromRoom,
                    toRoom,
                    totalDaysRoom,
                    totalAmountRoom,
                },
            });
            localStorage.setItem('accomodationData',
                JSON.stringify({
                    wantRoom,
                    roomType,
                    fromRoom,
                    toRoom,
                    totalDaysRoom,
                    totalAmountRoom,
                })
            );
            navigate('/shipping');
        }
    }

    useEffect(() => {
        if(roomType === '2 személyes szoba'){
            setSelectedImage(ketszemely[0]);
        } else if(roomType === '3 személyes szoba'){
            setSelectedImage(haromszemely[0]);
        } else if(roomType === '4 személyes szoba'){
            setSelectedImage(negyszemely[0]);
        }else{
            setSelectedImage('');
        }
    },[roomType]);

    return(
        <div>
            <CheckoutSteps step1></CheckoutSteps>
            <Helmet><title>Szállás</title></Helmet>
            <div className={'container'}>
                <h1 className={'my-3'}>Szállás foglalás</h1>
                <Container className={'mt-5'}>
                    <Row>
                        <Col md={5}>
                            <ListGroup variant={'flush'}>
                                <ListGroupItem>
                                    Szeretnél szállást foglalni? &nbsp;
                                    <Radio.Group onChange={(e) => setWantRoom(e.target.value)} value={wantRoom}>
                                        <Radio value={true}>Igen</Radio>
                                        <Radio value={false}>Nem</Radio>
                                    </Radio.Group>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <FormSelect onChange={(e) => setRoomType(e.target.value)} disabled={!wantRoom} value={roomType}><option defaultValue=''>Válassz szoba fajtát.</option>
                                        <option value={'2 személyes szoba'}>2 személyes szoba &nbsp;&nbsp;&nbsp;130€/nap</option>
                                        <option value={'3 személyes szoba'}>3 személyes szoba &nbsp;&nbsp;&nbsp;190€/nap</option>
                                        <option value={'4 személyes szoba'}>4 személyes szoba &nbsp;&nbsp;&nbsp;260€/nap</option>
                                    </FormSelect>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <RangePicker style={{width: '100%'}} format={'YYYY-MM-DD'} disabledDate={disabledDate} onChange={selectTimeSlots} disabled={!wantRoom || roomType===''} ></RangePicker>
                                </ListGroupItem>
                                <ListGroupItem>
                                    Napok száma: {totalDaysRoom} nap
                                </ListGroupItem>
                                <ListGroupItem>
                                    Teljes ár: {totalAmountRoom}&nbsp;€ {avgtemp > -1 || avgtemp < -5 ? (<div>(20% kedvezmény)</div>):(<div></div>)}
                                </ListGroupItem>
                                {toRoom !== '' ? (<ListGroupItem>Dátum: {fromRoom} - {toRoom}</ListGroupItem>) : (<div></div>)}
                                {weatherSzallas && wantRoom ? (<ListGroupItem><TemperatureBar value={avgtemp} mintemp={lowtemp} maxtemp={hightemp} minheight={minsnow} maxheight={maxsnow}> </TemperatureBar></ListGroupItem>) : (<div></div>)}
                                <ListGroupItem>
                                    <Button onClick={submitHandler} variant={"primary"}>Tovább</Button>
                                </ListGroupItem>
                            </ListGroup>
                        </Col>
                        <Col md={7}>
                            <img src={selectedImage} alt={roomType} className={'mb-1'}></img>
                            {roomType === '2 személyes szoba' ?
                                (<Row xs={1} md={3} className={'g-2'}>
                                {ketszemely.map((x) => (
                                    <Col key={x}>
                                        <Card>
                                            <Button className={'thumbnail'} type={'button'} variant={"light"} onClick={() => setSelectedImage(x)}>
                                                <Card.Img variant={'top'} src={x} alt={'kep'} className={''}></Card.Img>
                                            </Button>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>) : roomType === '3 személyes szoba' ?
                                    (<Row xs={1} md={3} className={'g-2'}>
                                    {haromszemely.map((x) => (
                                        <Col key={x}>
                                            <Card>
                                                <Button className={'thumbnail'} type={'button'} variant={"light"} onClick={() => setSelectedImage(x)}>
                                                    <Card.Img variant={'top'} src={x} alt={'kep'} className={''}></Card.Img>
                                                </Button>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>) : roomType === '4 személyes szoba' ?
                                        (<Row xs={1} md={3} className={'g-2'}>
                                        {negyszemely.map((x) => (
                                            <Col key={x}>
                                                <Card>
                                                    <Button className={'thumbnail'} type={'button'} variant={"light"} onClick={() => setSelectedImage(x)}>
                                                        <Card.Img variant={'top'} src={x} alt={'kep'} className={''}></Card.Img>
                                                    </Button>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>) : (<div></div>)}
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}
export default AccomodationScreen;