import React, {useContext, useEffect, useReducer} from "react";
import {Helmet} from "react-helmet-async";
import {Button, Card, Col, ListGroup, Row} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {Store} from "../Store";
import CheckoutSteps from "../komponensek/CheckoutSteps";
import {toast} from "react-toastify";
import {getError} from "../utils";
import axios from "axios";
import LoadingBox from "../komponensek/LoadingBox";

const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST': {
            return {...state, loading: true}
        }
        case 'CREATE_SUCCESS': {
            return {...state, loading: false}
        }
        case 'CREATE_FAIL': {
            return {...state, loading: false}
        }
        default: return state;
    }
}


function PlaceOrderScreen(){
    const navigate = useNavigate();
    const [{loading}, dispatch] = useReducer(reducer, {
        loading: false,
    })
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) /100;
    cart.itemsPrice = round2(
        cart.cartItems.reduce((a,c) => a + c.quantity * c.totalAmount, 0)
    );
    cart.paymentPrice = cart.paymentMethod === 'Helyben' ? 5 : 0;
    {!cart.accomodationData.wantRoom ? (cart.totalPrice = cart.itemsPrice + cart.paymentPrice) : (cart.totalPrice = cart.itemsPrice + cart.paymentPrice + cart.accomodationData.totalAmountRoom)}

    const placeOrderHandler = async () => {
        if(cart.cartItems.length === 0 && !cart.accomodationData.wantRoom){
            return(toast.error('Üres a kosár'))
        }
        try {
            dispatch({ type: 'CREATE_REQUEST' });

            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: cart.itemsPrice,
                    paymentPrice: cart.paymentPrice,
                    totalPrice: cart.totalPrice,
                    accomodationData: cart.accomodationData,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            ctxDispatch({ type: 'CART_CLEAR' });
            dispatch({ type: 'CREATE_SUCCESS' });
            localStorage.removeItem('cartItems');
            localStorage.removeItem('accomodationData');
            navigate(`/order/${data.order._id}`);
        } catch (err) {
            dispatch({ type: 'CREATE_FAIL' });
            toast.error(getError(err));
        }
    };

    useEffect(() => {
        if(!cart.paymentMethod) {
            navigate('/payment');
        }
    },[cart, navigate]);
    const method = cart.paymentMethod.toLowerCase();
    return  (   <div>
        <CheckoutSteps step1 step2 step3 step4 step5></CheckoutSteps>
        <Helmet>
            <title>Rendelés attekintése</title>
        </Helmet>
        <h1 className="my-3">Rendelés attekintése</h1>
        <Row>
            <Col md={8}>
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title>Személyes adatok</Card.Title>
                        <Card.Text>
                            <strong>Név:</strong> {cart.shippingAddress.fullName} <br />
                            <strong>Telefonszám:</strong> {cart.shippingAddress.telefon} <br />
                            <strong>Lakcím: </strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.country}
                        </Card.Text>
                        <Link to="/shipping">Szerkesztés</Link>
                    </Card.Body>
                </Card>
                <Card className={"mb-3"}>
                    <Card.Body>
                        <Card.Title>Fizetés</Card.Title>
                        <Card.Text>
                            <strong>Fajtája:</strong> {cart.paymentMethod}
                        </Card.Text>
                        <Link to="/payment">Szerkesztés</Link>
                    </Card.Body>
                </Card>
                {!cart.accomodationData.wantRoom ? (<div></div>) : (
                    <Card className={'mb-3'}>
                        <Card.Body>
                            <Card.Title>Szállás</Card.Title>
                            <Card.Text>
                                <strong>Szoba fajtája: </strong> {cart.accomodationData.roomType} <br/>
                                <strong>Dátum:</strong> {cart.accomodationData.fromRoom} - {cart.accomodationData.toRoom}<br/>
                                <strong>Napok száma: </strong> {cart.accomodationData.totalDaysRoom} nap<br/>
                                <strong>Ár: </strong> {cart.accomodationData.totalAmountRoom} €<br/>
                            </Card.Text>
                            <Link to="/accomodation">Szerkesztés</Link>
                        </Card.Body>
                    </Card>
                )}
                <Card className={"mb-3"}>
                    <Card.Body>
                        <Card.Title>Termékek</Card.Title>
                        {cart.cartItems.length === 0 ? (<div>Nincsenek termékek</div>) : (
                        <ListGroup variant={"flush"}>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={5}></Col>
                                    <Col md={2}>Darabszám</Col>
                                    <Col md={3}>Kölcsönzés ideje</Col>
                                    <Col md={2}>Ár</Col>
                                </Row>
                            </ListGroup.Item>
                            {cart.cartItems.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className={"align-items-center"}>
                                        <Col md={"5"}>
                                            <Row>
                                            <Col md={"4"}><img src={item.image} alt={item.name} className={"img-fluid rounded img-thumbnail"}/>{' '}</Col>
                                            <Col md={"8"}>{item.name.startsWith('Skipass') ? <Link to={`/skipass`}>{item.name}</Link> : <Link to={`/kolcsonzo/${item.slug}`}>{item.name}</Link>}</Col>
                                            </Row>
                                        </Col>
                                        <Col md={1}><span>{item.quantity}</span></Col>
                                        <Col md={4}>{item.from} - {item.to}</Col>
                                        <Col md={2}>{item.totalAmount * item.quantity} €</Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>)}
                        <Link to={'/kosar'}>Szerkesztés</Link>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4}>
                <Card>
                    <Card.Body>
                        <Card.Title>Rendelés összegzése</Card.Title>
                        <ListGroup variant={"flush"}>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Termékek</Col>
                                    <Col>{cart.itemsPrice.toFixed(2)} €</Col>
                                </Row>
                            </ListGroup.Item>
                            {!cart.accomodationData.wantRoom ? (<div></div>) :
                                (<ListGroup.Item>
                                <Row>
                                    <Col>Szállás</Col>
                                    <Col>{cart.accomodationData.totalAmountRoom.toFixed(2)} €</Col>
                                </Row>
                            </ListGroup.Item>)}
                            <ListGroup.Item>
                                <Row>
                                    <Col>Fizetés {method}</Col>
                                    <Col>{cart.paymentPrice.toFixed(2)} €</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Összesen</strong></Col>
                                    <Col><strong>{cart.totalPrice.toFixed(2)} €</strong></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <div className={"d-grid"}>
                                    <Button type={"button"} onClick={placeOrderHandler} >Rendelés</Button>
                                </div>
                                {loading && <LoadingBox></LoadingBox>}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </div>
    )
}

export default PlaceOrderScreen;