import {Link, useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useReducer, useRef, useState} from "react";
import axios from "axios";
import {Button, Card, Col, Container, FloatingLabel, Form, ListGroup, ListGroupItem, Row, FormSelect} from "react-bootstrap";
import Rating from "../komponensek/Rating";
import {Helmet} from "react-helmet-async";
import LoadingBox from "../komponensek/LoadingBox";
import MessageBox from "../komponensek/MessageBox";
import {getError} from "../utils";
import {Store} from "../Store";
import {DatePicker} from "antd";
import {toast} from "react-toastify";
const {RangePicker} = DatePicker;

const reducer = (state, action) =>{
    switch (action.type){
        case 'REFRESH_PRODUCT':
            return { ...state, product: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreateReview: true };
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreateReview: false };
        case 'CREATE_FAIL':
            return { ...state, loadingCreateReview: false };
        case 'FETCH_REQUEST':
            return{...state, loading: true};
        case 'FETCH_SUCCESS':
            return {...state, product: action.payload, loading: false};
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
};

    function ProductScreen(){
        let reviewsRef = useRef();

        const [rating, setRating]= useState(0);
        const [comment, setComment] = useState("");

        const navigate = useNavigate();
        const params = useParams();
        const {slug} = params;
        const [from, setFrom] = useState();
        const [to, setTo] = useState();
        const [totalDays, setTotalDays] = useState(0);
        const [totalAmount, setTotalAmount] = useState(0);
        const [productsize, setProductSize] = useState('');


        const [{loading, error, product, loadingCreateReview}, dispatch] = useReducer(reducer, {
            product: [],
            loading: true,
            error: ''
        });
    useEffect(()=>{
        const fetchData = async () =>{
            dispatch({type: 'FETCH_REQUEST'});
            try{
                const result = await axios.get(`/api/products/slug/${slug}`);
                dispatch({type: 'FETCH_SUCCESS', payload: result.data});
            }
            catch (err){
                dispatch({type:'FETCH_FAIL', payload: getError(err)});
            }
        };
        fetchData();
    }, [slug]);

    useEffect(()=>{
        setTotalAmount((totalDays * parseInt(product.ar)).toFixed(2));
    },[totalDays, product.ar])

    const {state , dispatch: ctxDispatch} = useContext(Store);
    const {cart, userInfo} = state;
    const addToCartHandler = async () =>{
        const existItem = cart.cartItems.find((x) => x._id === product._id && x.from === from && x.to === to);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);

        if(productsize === ''){
            toast.error('Nem választottál méretet!');
            return;
        }
        if(totalDays < 1){
            toast.error('Nem választottál időpontot!');
            return;
        }
        if (data.countInStock < quantity) {
            toast.error('Termék nem elérhtető');
            return;
        }
        if(product.category === 'Síléc' || product.category === 'Snowboard'){
            product.name = product.name + ' ' + productsize + 'cm';
        }else {
            product.name = product.name + ' ' + productsize + ' ' + 'méret';
        }
        ctxDispatch({
            type:'CART_ADD_ITEM',
            payload: {...product, quantity, from, to, totalDays, totalAmount}
        });
        navigate('/kosar');
    }

    function selectTimeSlots(values){
        setFrom(values[0].format('DD/MM/YYYY'))
        setTo(values[1].format('DD/MM/YYYY'))
        setTotalDays(values[1].diff(values[0], "days")+1);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if(!comment || !rating) {
            toast.error('Adj meg szöveget és pontszámot');
            return;
        }
        try{
            const {data} = await axios.post(`/api/products/${product._id}/reviews`,
                { rating, comment, name: userInfo.name },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });

            dispatch({
                type: 'CREATE_SUCCESS',
            });
            toast.success('Értékelés sikeresen beküldve');
            product.reviews.unshift(data.review);
            product.numReviews = data.numReviews;
            product.rating = data.rating;
            dispatch({ type: 'REFRESH_PRODUCT', payload: product });
            window.scrollTo({
                behavior: 'smooth',
                top: reviewsRef.current.offsetTop,
            })
        }catch (error){
            toast.error(getError(error));
            dispatch({type: 'CREATE_FAIL'});
        }
    }

    return(
        loading? (<LoadingBox></LoadingBox>
        ) : error?(
            <MessageBox variant={"danger"}>{error}</MessageBox>
        ) :  (<Container className={"mt-5"}>
                    <Row className={"product-row"}>
                    <Col md={4} className={"transparent-bg"}>
                        <ListGroup variant={"flush"}>
                            <ListGroupItem className={"transparent-bg"}>
                                <Helmet>
                                    <title>{product.name}</title>
                                </Helmet>
                                <h1>{product.name}</h1>
                            </ListGroupItem>
                            <ListGroupItem
                                className={"transparent-bg"}>
                                <Rating
                                    rating = {product.rating}
                                    numReviews = {product.numReviews}>
                                </Rating>
                            </ListGroupItem>
                            <ListGroupItem className={"transparent-bg"}>Ár/nap: {product.ar} €</ListGroupItem>
                            <ListGroupItem>Méret: <FormSelect onChange={(e) => {setProductSize(e.target.value)}}><option selected value="">Válassz méretet</option>{product.category === "Cipő" ? (product.sizes.map((sizes) => (<option key={sizes} value={sizes}>{sizes} EU</option>)))
                            : (product.sizes.map((sizes) => (<option key={sizes} value={sizes}>{sizes} cm</option>)))}</FormSelect></ListGroupItem>
                            <ListGroupItem>
                                <RangePicker style={{width: '100%'}} format='DD/MM/YYYY' onChange={selectTimeSlots}></RangePicker>
                            </ListGroupItem>
                            <ListGroupItem>
                                Napok száma: {totalDays} nap
                            </ListGroupItem>
                            <ListGroupItem>
                                Teljes ár: {totalAmount}&nbsp;€
                            </ListGroupItem>
                            {/*<ListGroupItem>
                                <Row>
                                    <Col>Elérhetőség:</Col>
                                    <Col>{product.countInStock>0?
                                        <Badge bg="success">Elérhető</Badge>:
                                        <Badge bg="danger">Nem elérhető</Badge>}</Col>
                                </Row>
                            </ListGroupItem>*/}
                            {product.countInStock > 0 &&(
                                <ListGroupItem>
                                    <div className={"d-grid"}>
                                        <Button onClick={addToCartHandler} variant={"primary"}>
                                            Kosárba teszem
                                        </Button>
                                    </div>
                                </ListGroupItem>
                            )}

                        </ListGroup>
                    </Col>
                    <Col md={8} className={"text-center"}>
                        <img className={"img-product"} src={product.image} alt={product.name}/>
                    </Col>
                    </Row>
                    <Row>
                    <Col>
                        <Card>
                            <ListGroup>
                                <ListGroupItem className={"text-center text-"}>
                                    <Card.Title>
                                        <Row>
                                            <Col md={6}><b>{product.name}</b></Col>
                                            <Col md={6}><b>Ár/nap: {product.ar} €</b></Col>
                                        </Row>
                                    </Card.Title>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Card.Body>
                                        <ListGroup variant={"flush"}>
                                            <ListGroupItem className={"transparent-bg"}>
                                                <b>Leírás:</b>
                                                <p>
                                                    {product.description}
                                                </p>
                                            </ListGroupItem>
                                        </ListGroup>
                                    </Card.Body>
                                </ListGroupItem>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            <div className={"my-3"}>
                <h2 ref={reviewsRef}>Értékelések</h2>
                <div className={"mb-3"}>
                    {product.reviews.length === 0  && (<MessageBox>Nincs értékelés</MessageBox>)}
                </div>
                <ListGroup>
                    {product.reviews.map((review) => (
                        <ListGroup.Item key={review._id}>
                            <strong>{review.name}</strong>
                            <Rating rating={review.rating} caption={" "}></Rating>
                            <p>{review.createdAt.substring(0,10)}</p>
                            <p>{review.comment}</p>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <div className={"my-3"}>
                    {userInfo ? (
                        <form onSubmit={submitHandler}>
                            <h2>Értékelés írasa</h2>
                            <Form.Group className={"mb-3"} controlId={"rating"}>
                                <Form.Label>Pontszámok</Form.Label>
                                <Form.Select aria-label={"Rating"} value={rating} onChange={(e) => setRating(e.target.value)}>
                                    <option value={""}>Válassz...</option>
                                    <option value={"1"}>1 csillag </option>
                                    <option value={"2"}>2 csillag</option>
                                    <option value={"3"}>3 csillag</option>
                                    <option value={"4"}>4 csillag</option>
                                    <option value={"5"}>5 csillag</option>
                                </Form.Select>
                            </Form.Group>
                            <FloatingLabel label={"Értékelés"} controlId={"floatingTextarea"} className={"mb-3"}>
                                <Form.Control as="textarea" placeholder={"Írd az értékelést ide"} value={comment} onChange={(e) => setComment(e.target.value)}></Form.Control>
                            </FloatingLabel>

                            <div className={"mb-3"}>
                                <Button disabled={loadingCreateReview} type={"submit"}>Beküldés</Button>
                                {loadingCreateReview && <LoadingBox></LoadingBox>}
                            </div>
                        </form>
                    ):(
                        <MessageBox>Az értekeléshez <Link to={`/signin?redirect=/kolcsonzo/${product.slug}`}>jelentkezz be</Link>.</MessageBox>
                    )}
                </div>
            </div>
            </Container>)
    );
}

export default ProductScreen;