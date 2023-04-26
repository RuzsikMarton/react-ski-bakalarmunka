import React, {useContext, useEffect, useReducer} from "react";
import LoadingBox from "../komponensek/LoadingBox";
import MessageBox from "../komponensek/MessageBox";
import {Store} from "../Store";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {getError} from "../utils";
import {Helmet} from "react-helmet-async";
import {Button, Card, Col, ListGroup, Row} from "react-bootstrap";
import {toast} from "react-toastify";

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'PAY_REQUEST':
            return { ...state, loadingPay: true };
        case 'PAY_SUCCESS':
            return { ...state, loadingPay: false, successPay: true };
        case 'PAY_FAIL':
            return { ...state, loadingPay: false };
        case 'PAY_RESET':
            return {
                ...state,
                loadingPay: false,
                successPay: false,
            };

        default:
            return state;
    }
}

function OrderScreen() {
    const { state } = useContext(Store);
    const { userInfo } = state;

    const params = useParams();
    const { id: orderId } = params;
    const navigate = useNavigate();

    const [{ loading, error, order, loadingPay, successPay }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
    });

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        if (!userInfo) {
            return navigate('/signin');
        }
        if (!order._id || successPay ||(order._id && order._id !== orderId)) {
            fetchOrder();
            if(successPay) {
                dispatch({type: 'PAY_RESET'});
            }
        }
    }, [order, userInfo, orderId, navigate, successPay]);

    const payOrderHandler = async () => {
        try {
            dispatch({type: 'PAY_REQUEST'});
            const {data} = await axios.put(
                `/api/orders/${order._id}/pay`,{},{
                    headers: { authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({type: 'PAY_SUCCESS', payload: data});
            toast.success('Rendelés kifizetve');

        }catch (err) {
            toast.error(getError(err));
            dispatch({type: 'PAY_FAIL'});
        }
    }

    return loading ? (
        <LoadingBox></LoadingBox>
    ) : error ? (
        <MessageBox variant={"danger"}>{error}</MessageBox>
    ) : (
        <div>
            <Helmet>
                <title>Rendelés {orderId}</title>
            </Helmet>
            <h1>Rendelés {orderId}</h1>
            <Row>
                <Col md={8}>
                    <Card className={"mb-3"}>
                        <Card.Body>
                            <Card.Title>Személyes adatok</Card.Title>
                            <Card.Text>
                                <strong>Név:</strong> {order.shippingAddress.fullName} <br/>
                                <strong>Telefonszám:</strong> {order.shippingAddress.telefon} <br/>
                                <strong>Lakcím:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className={"mb-3"}>
                        <Card.Body>
                            <Card.Title>Fizetés</Card.Title>
                            <Card.Text>
                                <strong>Fajtája:</strong> {order.paymentMethod}
                            </Card.Text>
                            {order.isPaid ? (
                                <MessageBox variant={"success"}>Kifizetett: {order.paidAt}</MessageBox>) : (
                                <MessageBox variant={"danger"}>Nincs kifizetve</MessageBox>
                                )}
                        </Card.Body>
                    </Card>
                    {!order.accomodationData.wantRoom ? (<div></div>) : (
                        <Card className={'mb-3'}>
                            <Card.Body>
                                <Card.Title>Szállás</Card.Title>
                                <Card.Text>
                                    <strong>Szoba fajtája: </strong> {order.accomodationData.roomType} <br/>
                                    <strong>Dátum:</strong> {order.accomodationData.fromRoom} - {order.accomodationData.toRoom}<br/>
                                    <strong>Napok száma: </strong> {order.accomodationData.totalDaysRoom} nap<br/>
                                    <strong>Ár: </strong> {order.accomodationData.totalAmountRoom} €<br/>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    )}
                    <Card className={"mb-3"}>
                        <Card.Body>
                            <Card.Title>Termékek</Card.Title>
                            <Card.Text>
                                {order.orderItems.length === 0 ? (<div>Nincsenek termékek</div>) : (
                                <ListGroup variant={"flush"}>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col md={5}></Col>
                                            <Col md={2}>Darabszám</Col>
                                            <Col md={3}>Kölcsönzés ideje</Col>
                                            <Col md={2}>Ár</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {order.orderItems.map((item) => (
                                        <ListGroup.Item key={item._id}>
                                            <Row className={"align-items-center"}>
                                                <Col md={5}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="img-fluid rounded img-thumbnail"
                                                    ></img>{' '}
                                                    {item.name.startsWith('Skipass') ? <Link to={`/skipass`}>{item.name}</Link> : <Link to={`/kolcsonzo/${item.slug}`}>{item.name}</Link>}
                                                </Col>
                                                <Col md={1}><span>{item.quantity}</span></Col>
                                                <Col md={4}>{item.from} - {item.to}</Col>
                                                <Col md={2}>{item.totalAmount} €</Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>)}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className={"mb-3"}>
                        <Card.Body>
                            <Card.Title>Rendelés összegzése</Card.Title>
                            <ListGroup variant={"flush"}>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Termékek</Col>
                                        <Col>{order.itemsPrice.toFixed(2)} €</Col>
                                    </Row>
                                </ListGroup.Item>
                                {!order.accomodationData.wantRoom ? (<div></div>) :
                                    (<ListGroup.Item>
                                        <Row>
                                            <Col>Szállás</Col>
                                            <Col>{order.accomodationData.totalAmountRoom.toFixed(2)} €</Col>
                                        </Row>
                                    </ListGroup.Item>)}
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Fizetés {order.paymentMethod}</Col>
                                        <Col>{order.paymentPrice.toFixed(2)} €</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Összesen</strong></Col>
                                        <Col><strong>{order.totalPrice.toFixed(2)} €</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                                {userInfo.isAdmin && !order.isPaid &&(
                                    <ListGroup.Item>
                                        {loadingPay && <LoadingBox></LoadingBox>}
                                        <div className={"d-grid"}>
                                            <Button type={"button"} onClick={payOrderHandler}>Rendelés kifizetve</Button>
                                        </div>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </div>
    );
}

export default OrderScreen;