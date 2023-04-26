import {useContext} from "react";
import {Store} from "../Store";
import {Helmet} from "react-helmet-async";
import {Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import MessageBox from "../komponensek/MessageBox";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

function CartScreen(){
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;

    const updateCartHandler = async (item , quantity) => {
        try{
            const { data } = await axios.get(`/api/products/${item._id}`);
            if (data.countInStock < quantity) {
                window.alert('Sorry. Product is out of stock');
                return;
            }
            ctxDispatch({
                type:'CART_ADD_ITEM',
                payload: {...item, quantity}
            });
        }
        catch (err){
            const { data } = await axios.get(`/api/skipass/${item._id}`);
            if (data.countInStock < quantity) {
                window.alert('Sorry. Product is out of stock');
                return;
            }
            ctxDispatch({
                type:'CART_ADD_ITEM',
                payload: {...item, quantity}
            });
        }
    }
    const removeItemHandler = (item) => {
        ctxDispatch({type: 'CART_REMOVE_ITEM', payload: item});
    }
    const checkoutHandler = () => {
        navigate('/signin?redirect=/accomodation');
    }
    return(
        <Container>
        <div>
            <Helmet>
                <title>Sikozpont. Kosar</title>
            </Helmet>
            <h1>Kosár</h1>
            <Row>
                <Col md={8}>
                    {cartItems.length === 0 ? (
                        <MessageBox>
                            A kosár üres. <Link to={"/search"}>Ha folytatni szeretné a vásárlást, kérjük, kattintson ide.</Link>
                        </MessageBox>
                    ) : (
                        <ListGroup>
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className={"align-items-center"}>
                                        <Col md={4}>
                                            <Row>
                                                <Col md={5}><img src={item.image} alt={item.name} className={"img-fluid rounded img-thumbnail"}/>{' '}</Col>
                                                <Col md={7}>{item.name.startsWith('Skipass') ? <Link to={`/skipass`}>{item.name}</Link> : <Link to={`/kolcsonzo/${item.slug}`}>{item.name}</Link>}</Col>
                                            </Row>
                                        </Col>
                                        <Col md={2}>
                                            <Button variant={"light"}
                                                    onClick={() => updateCartHandler(item , item.quantity - 1)}
                                                    disabled={item.quantity === 1}>
                                                <i className={"fas fa-minus-circle"}></i>
                                            </Button>{' '}
                                            <span>{item.quantity}</span>{' '}
                                            <Button variant={"light"}
                                                    onClick={() => updateCartHandler(item , item.quantity + 1)}
                                                    disabled={item.quantity === item.countInStock}>
                                                <i className={"fas fa-plus-circle"}></i>
                                            </Button>
                                        </Col>
                                        <Col md={2}>{item.totalAmount*item.quantity} €</Col>
                                        <Col md={2}>{item.from} - {item.to}</Col>
                                        <Col md={2}>
                                            <Button variant={"light"}
                                                    onClick={() => removeItemHandler(item)}>
                                                <i className={"fas fa-trash"}></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant={"flush"}>
                            <ListGroup.Item variant={"flush"}>
                                <h3>Termékek összesen ({cartItems.reduce((a,c) => a + c.quantity, 0)}){' '}
                                    Végösszeg: {cartItems.reduce((a,c) => a + c.totalAmount * c.quantity, 0)}{' '}€</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <div className={"d-grid"}>
                                    <Button type={"button"}
                                            onClick={checkoutHandler}
                                            disabled={cartItems.length === 0}>
                                        Tovább
                                    </Button>
                                </div>
                            </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
        </Container>
    )
}

export default CartScreen;