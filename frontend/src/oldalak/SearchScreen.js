import React, {useEffect, useReducer, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {getError} from "../utils";
import axios from "axios";
import {toast} from "react-toastify";
import {Helmet} from "react-helmet-async";
import {Button, Col, Container, Row} from "react-bootstrap";
import Rating from "../komponensek/Rating";
import LoadingBox from "../komponensek/LoadingBox";
import MessageBox from "../komponensek/MessageBox";
import Product from "../komponensek/Product";
import {LinkContainer} from "react-router-bootstrap";
import SearchBox from "../komponensek/SearchBox";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                countProducts: action.payload.countProducts,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

const arak = [
    {
        name: '1€ - 10€',
        value: '1-10',
    },
    {
        name: '11€ - 25€',
        value: '11-25',
    },
    {
        name: '26€ - 50€',
        value: '26-50',
    },
    {
        name: '51€ - 1000€',
        value: '51-1000',
    },
];

export const ratings = [
    {
        name: '4stars & up',
        value: 4,
    },
    {
        name: '3stars & up',
        value: 3,
    },
    {
        name: '2stars & up',
        value: 2,
    },
    {
        name: '1stars & up',
        value: 1,
    },
];

function SearchScreen(){
    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const category = sp.get('category') || 'all';
    const brand = sp.get('brand') || 'all';
    const query = sp.get('query') || 'all';
    const ar = sp.get('ar') || 'all';
    const rating = sp.get('rating') || 'all';
    const order = sp.get('order') || 'newest';
    const page = sp.get('page') || 1;

    const [{ loading, error, products, pages, countProducts }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    "/api/products/search",
                    {
                        params: { query: query,
                                category: category,
                                ar: ar,
                                rating: rating,
                                order: order,
                                page: page,
                            brand: brand,
                        },
                    }
                );
                dispatch({ type: "FETCH_SUCCESS", payload: data });
                console.log(data);
            } catch (err) {
                dispatch({
                    type: "FETCH_FAIL",
                    payload: getError(err),
                });
            }
        };
        fetchData();
    }, [category, error, order, page, ar, query, rating,brand]);

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`/api/products/categories`);
                setCategories(data);
            } catch (err) {
                toast.error(getError(err));
            }
        };
        fetchCategories();
    }, [dispatch],categories);

    const [brands, setBrands] = useState([]);
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const { data } = await axios.get(`/api/products/brands`);
                setBrands(data);
            } catch (err) {
                toast.error(getError(err));
            }
        };
        fetchBrands();
    }, [dispatch],brands);

    const getFilterUrl = (filter) => {
        const filterPage = filter.page || page;
        const filterCategory = filter.category || category;
        const filterBrand = filter.brand || brand;
        const filterQuery = filter.query || query;
        const filterRating = filter.rating || rating;
        const filterAr = filter.ar || ar;
        const sortOrder = filter.order || order;
        return {
            pathname: "/search",
            search: `?category=${filterCategory}&query=${filterQuery}&brand=${filterBrand}&ar=${filterAr}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`,
        };
    };
    return(
        <div>
            <Helmet>
                <title>Sífelszerelés</title>
            </Helmet>
            <Container className={"search-width"}>
                <h1>Termékek kölcsönzése</h1>
            <Row className={"mt-3"}>
                <Col md={3}>
                    <SearchBox></SearchBox>
                    <h3>Kategória</h3>
                    <div>
                        <ul>
                            <li>
                                <Link
                                    className={"all" === category ? "text-bold text-black text-nodecor" : "text-black text-nodecor text-normal"}
                                    to={getFilterUrl({ category: "all" })}
                                >
                                    Összes
                                </Link>
                            </li>
                            {categories.map((c) => (
                                <li key={c}>
                                    <Link
                                        className={c === category ? "text-bold text-black text-nodecor" : "text-black text-nodecor text-normal"}
                                        to={getFilterUrl({ category: c })}
                                    >
                                        {c}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Márka</h3>
                        <div>
                            <ul>
                                <li>
                                    <Link
                                        className={"all" === brand ? "text-bold text-black text-nodecor" : "text-black text-nodecor text-normal"}
                                        to={getFilterUrl({ brand: "all" })}
                                    >
                                        Összes
                                    </Link>
                                </li>
                                {brands.map((b) => (
                                    <li key={b}>
                                        <Link
                                            className={b === brand ? "text-bold text-black text-nodecor" : "text-black text-nodecor text-normal"}
                                            to={getFilterUrl({ brand: b })}
                                        >
                                            {b}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div></div>
                        <div>
                        <h3>Ár/nap</h3>
                        <ul>
                            <li>
                                <Link
                                    className={"all" === ar ? "text-bold text-black text-nodecor" : "text-black text-nodecor text-normal"}
                                    to={getFilterUrl({ ar: "all" })}
                                >
                                    Összes
                                </Link>
                            </li>
                            {arak.map((p) => (
                                <li key={p.value}>
                                    <Link
                                        to={getFilterUrl({ ar: p.value })}
                                        className={p.value === ar ? "text-bold text-black text-nodecor" : "text-black text-nodecor text-normal"}
                                    >
                                        {p.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Vásárlói értékelés</h3>
                        <ul className={'list-unstyled'}>
                            {ratings.map((r) => (
                                <li key={r.name}>
                                    <Link
                                        to={getFilterUrl({ rating: r.value })}
                                        className={`${r.value}` === `${rating}` ? "text-bold text-black text-nodecor" : "text-black text-nodecor text-normal"}
                                    >
                                        <Rating caption={" vagy több"} rating={r.value}></Rating>
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    to={getFilterUrl({ rating: "all" })}
                                    className={rating === "all" ? "text-bold text-black text-nodecor" : "text-black text-nodecor text-normal"}
                                >
                                    <Rating caption={" vagy több"} rating={0}></Rating>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </Col>
                <Col md={9}>
                    {loading ? (
                        <LoadingBox></LoadingBox>
                    ) : error ? (
                        <MessageBox variant="danger">{error}</MessageBox>
                    ) : (
                        <>
                            <Row className="justify-content-between mb-3">
                                <Col md={6}>
                                    <div>
                                        {countProducts === 0 ? "Nincs" : countProducts} találat
                                        {query !== "all" && " : " + query}
                                        {category !== "all" && " : " + category}
                                        {brand !== "all" && " : " + brand}
                                        {ar !== "all" && " : Ár " + ar}
                                        {rating !== "all" && " : Értékelés " + rating + " vagy több"}
                                        {query !== "all" ||
                                        category !== "all" ||
                                        rating !== "all" ||
                                        ar !== "all" ? (
                                            <Button
                                                variant="light"
                                                onClick={() => navigate("/search")}
                                            >
                                                <i className="fas fa-times-circle"></i>
                                            </Button>
                                        ) : null}
                                    </div>
                                </Col>
                                <Col className="text-end">
                                    Rendezés{" "}
                                    <select
                                        value={order}
                                        onChange={(e) => {
                                            navigate(getFilterUrl({ order: e.target.value }));
                                        }}
                                    >
                                        <option value="newest">Legújabb szerint</option>
                                        <option value="lowest">Ár: legolcsóbb elöl</option>
                                        <option value="highest">Ár: legdrágább elöl</option>
                                        <option value="toprated">Vásárlói értékelés szerint</option>
                                    </select>
                                </Col>
                            </Row>
                            {products.length === 0 && (
                                <MessageBox>No Product Found</MessageBox>
                            )}

                            <Row>
                                {products.map((product) => (
                                    <Col md={3} className="mb-3" key={product._id}>
                                        <Product product={product}></Product>
                                    </Col>
                                ))}
                            </Row>
                            <div className={"mb-3"}>
                                {[...Array(pages).keys()].map((x) => (
                                    <LinkContainer
                                        key={x + 1}
                                        className="mx-1"
                                        to={getFilterUrl({ page: x + 1 })}
                                    >
                                        <Button
                                            className={Number(page) === x + 1 ? "text-bold" : ""}
                                            variant="light"
                                        >
                                            {x + 1}
                                        </Button>
                                    </LinkContainer>
                                ))}
                            </div>
                        </>
                    )}
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default SearchScreen;