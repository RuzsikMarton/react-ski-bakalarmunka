import CheckoutSteps from "../komponensek/CheckoutSteps";
import {Helmet} from "react-helmet-async";
import {Button, Form} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {Store} from "../Store";
import {useNavigate} from "react-router-dom";

function PaymentMethodScreen(){
    const navigate = useNavigate();
    const {state, dispatch: ctxDispatch}  = useContext(Store);
    const {
        cart: { shippingAddress, paymentMethod },
    } = state;

    const [paymentMethodName, setPaymentMethod] = useState(
        paymentMethod || 'Helyben'
    );

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);
    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
        localStorage.setItem('paymentMethod', paymentMethodName);
        navigate('/placeorder');
    };

    const backHandler = (e) =>{
        e.preventDefault();
        navigate('/shipping')
    };

    return <div>
        <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
        <div className={"container small-container"}>
            <Helmet>
                <title>Fizetés</title>
            </Helmet>
            <h1 className={"my-3"}>Fizetés tipusa</h1>
            <Form onSubmit={submitHandler}>
                <div className="mb-3 mx-3">
                    <Form.Check
                        type="radio"
                        id="Helyben"
                        label="Helyben"
                        value="Helyben"
                        checked={paymentMethodName === 'Helyben'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                </div>
                <div className="mb-3 mx-3">
                    <Form.Check
                        type="radio"
                        id="Kártya"
                        label="Kártya"
                        value="Kártya"
                        checked={paymentMethodName === 'Kártya'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <Button variant={"primary"} type={'button'} onClick={backHandler}>Vissza</Button> <Button type={"submit"}>Tovább</Button>
                </div>
            </Form>
        </div>
    </div>
}

export default PaymentMethodScreen;