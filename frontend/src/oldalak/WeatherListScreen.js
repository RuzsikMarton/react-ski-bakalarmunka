import {Link, useLocation, useNavigate} from "react-router-dom";
import {useContext, useEffect, useReducer} from "react";
import {Store} from "../Store";
import axios from "axios";
import {getError} from "../utils";
import {Button, Col, Row} from "react-bootstrap";
import LoadingBox from "../komponensek/LoadingBox";
import MessageBox from "../komponensek/MessageBox";
import {toast} from "react-toastify";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                weathers: action.payload.weathers,
                page: action.payload.page,
                pages: action.payload.pages,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
            return {
                ...state,
                loadingCreate: false,
            };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true,
            };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false, successDelete: false };

        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };

        default:
            return state;
    }
};

export default function WeatherListScreen(){
    const [{loading, error, weathers, pages, loadingCreate, loadingDelete, successDelete}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const navigate = useNavigate();
    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const page = sp.get('page') || 1;

    const {state} = useContext(Store);
    const {userInfo} = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`/api/weather/admin?page=${page}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                });
            }
        };
        fetchData();

    },[page, userInfo]);

    const createHandler = async () => {
        if (window.confirm('Biztos létre akarsz hozni új dátumot?')){
            try {
                dispatch({type: 'CREATE_REQUEST'});
                const {data} = await axios.post(
                    '/api/weather',
                    {},
                    {
                        headers: {Authorization: `Bearer ${userInfo.token}`},
                    }
                );
                toast.success('Dátum sikeresen létrehozva');
                dispatch({type: 'CREATE_SUCCESS'});
                navigate(`/admin/weathers/${data.weather._id}`);
            }catch (err){
                toast.error(getError(error));
                dispatch({
                    type: 'CREATE_FAIL',
                });
            }
        }
    }

    return(
        <div>
            <Row className={"my-3"}>
                <Col><h1>Weather</h1></Col>
                <Col className={"col text-end"}>
                    <div>
                        <Button type={"button"} onClick={createHandler}>Create new</Button>
                    </div>
                </Col>
            </Row>

            {loading ? (<LoadingBox></LoadingBox>) :
                error ? (<MessageBox variant={"danger"}>{error}</MessageBox>)
            :(
                <>
                    <table className={"table"}>
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>id</th>
                            <th>snow</th>
                            <th>temperature</th>
                        </tr>
                        </thead>
                        <tbody>
                        {weathers.map((weather) => (
                        <tr key={weather.dateW}>
                            <td>{weather.dateW}</td>
                            <td>{weather._id}</td>
                            <td>{weather.snow} cm</td>
                            <td>{weather.temperature} fok</td>
                            <td>
                                <Button type={"button"} variant={"light"} onClick={() => navigate(`/admin/weathers/${weather._id}`)}>Szerkesztés</Button>&nbsp;
                            </td>
                        </tr>)) }
                        </tbody>
                    </table>
                    <div>
                        {[...Array(pages).keys()].map((x) => (
                            <Link className={x+1 === Number(page) ? 'btn text-bold' : 'btn'}
                                  key={x+1} to={`/admin/weathers?page=${x+1}`}>{x+1}</Link>
                        ))}
                    </div>
                </>
                    )}
        </div>
    )
}