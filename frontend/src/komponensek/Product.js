import {Link} from "react-router-dom";
import {Button, Card} from "react-bootstrap";
import Rating from "./Rating";

function Product(props){
    const {product} = props;

    return(
        <Card>
            <div className={"product-img"}>
            <Link to={`/kolcsonzo/${product.slug}`}>
                <img src={product.image} className={"product-img"} alt={product.name}/>
            </Link>
            </div>
            <Card.Body>
                <Link to={`/kolcsonzo/${product.slug}`} className={"product-title"}>
                    <Card.Title>{product.name}</Card.Title>
                </Link>
                <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                <Card.Text>{product.ar} €</Card.Text>

                {product.countInStock === '0' ? (
                    <Button variant="light" disabled>
                        Termék nem elerhető
                    </Button>
                ) : (
                    <Link to={`/kolcsonzo/${product.slug}`}>
                        <Button>Termék kölcsönzése</Button>
                    </Link>
                )}
            </Card.Body>
        </Card>);
}
export default Product;