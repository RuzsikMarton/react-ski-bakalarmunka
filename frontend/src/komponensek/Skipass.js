import {Button, Col, Row} from "react-bootstrap";
import React from "react";

function Skipass(props) {
    const { area, duration, person, startDate, endDate, checkoutHandler, totalPrice, getData, avgtemp, avgsnow } = props;
    return (
        <div className="skipass">
            <Row>
                <Col sm={12}>
                    <h2 className="skipass-title">Skipass ajánlat</h2>
                </Col>
                <Col md={8}>
                    <Row>
                        <Col md={6}>
                            <h3 className="skipass-person">{person} személyre</h3>
                        </Col>
                        <Col md={6}>
                            <div className="skipass-details">
                                <p><strong>Felvonó:</strong> {area}</p>
                                <p><strong>Időtartam:</strong> {duration}</p>
                                <p><strong>Dátum:</strong> {startDate} - {endDate}</p>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col md={4}>
                    <Row>
                        <Col md={12}>
                            <div className="skipass-price">
                                <p><strong>Teljes ár:</strong> {totalPrice.toFixed(2)}{' '}€ {((avgtemp > -1 || avgtemp < -5) && avgsnow < 50) ? (<div>(20% kedvezmény)</div>) : ((avgtemp > -1 || avgtemp < -5) || avgsnow < 50) ? (<div>(10% kedvezmény)</div>) : (<div></div>)}</p>
                            </div>
                        </Col>
                        <Col>
                            <Button className="skipass-button" onClick={checkoutHandler} disabled={!getData}>Kosárba teszem</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default Skipass;