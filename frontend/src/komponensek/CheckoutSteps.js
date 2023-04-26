import React from "react";
import {Row, Col} from "react-bootstrap";

function CheckoutSteps(props) {
    return <Row className={"checkout-steps pt-3"}>
        <Col className={props.step1 ? 'active' : ''}>Szállás</Col>
        <Col className={props.step2 ? 'active' : ''}>Bejelentkezés</Col>
        <Col className={props.step3 ? 'active' : ''}>Személyes adatok</Col>
        <Col className={props.step4 ? 'active' : ''}>Fizetés</Col>
        <Col className={props.step5 ? 'active' : ''}>Rendelés áttekintése</Col>
    </Row>
}

export default CheckoutSteps;