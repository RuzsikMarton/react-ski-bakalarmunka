import React, {useContext, useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";
import {Button, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {Store} from "../Store";
import CheckoutSteps from "../komponensek/CheckoutSteps";

function ShippingAdressScreen(){
    const navigate = useNavigate();
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo, cart: {shippingAddress,accomodationData},}= state;

    const [fullName, setFullName] = useState(shippingAddress.fullName || '');
    const [telefon, setTelefon] = useState(shippingAddress.telefon || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    useEffect(() => {
        if (!userInfo) {
            navigate('/signin?redirect=/shipping');
        }
    },[userInfo, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                fullName,
                telefon,
                address,
                city,
                country,
            },
        });
        localStorage.setItem(
            'shippingAddress',
            JSON.stringify({
                fullName,
                telefon,
                address,
                city,
                country,
            })
        );
        navigate('/payment');
        console.log(accomodationData)
    };

    const backHandler = (e) =>{
        e.preventDefault();
        navigate('/accomodation')
    }

    return <div>
        <Helmet>
            <title>Személyes adatok</title>
        </Helmet>
        <CheckoutSteps step1 step2 step3></CheckoutSteps>
        <div className={"container small-container"}>
            <h1 className={"my-3"}>Személyes adatok</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className={"mb-3"} controlId={"fullName"}>
                    <Form.Label>Teljes név</Form.Label>
                    <Form.Control value={fullName} onChange={(e) => setFullName(e.target.value)} required></Form.Control>
                </Form.Group>
                <Form.Group className={"mb-3"} controlId={"telefon"}>
                    <Form.Label>Telefonszám</Form.Label>
                    <Form.Control value={telefon} onChange={(e) => setTelefon(e.target.value)} required></Form.Control>
                </Form.Group>
                <Form.Group className={"mb-3"} controlId={"address"}>
                    <Form.Label>Lakcím</Form.Label>
                    <Form.Control value={address} onChange={(e) => setAddress(e.target.value)} required></Form.Control>
                </Form.Group>
                <Form.Group className={"mb-3"} controlId={"city"}>
                    <Form.Label>Város</Form.Label>
                    <Form.Control value={city} onChange={(e) => setCity(e.target.value)} required></Form.Control>
                </Form.Group>
                <Form.Group className={"mb-3"} controlId={"country"}>
                    <Form.Label>Ország</Form.Label>
                    <Form.Control value={country} onChange={(e) => setCountry(e.target.value)} required></Form.Control>
                </Form.Group>
                <div className={"d-flex justify-content-between mb-3"}>
                    <Button variant={"primary"} type={'button'} onClick={backHandler}>Vissza</Button> <Button variant={"primary"} type={"submit"}>Tovább</Button>
                </div>
            </Form>
        </div>
    </div>
}

export default ShippingAdressScreen;