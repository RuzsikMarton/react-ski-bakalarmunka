import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useReducer, useState} from "react";
import {Store} from "../Store";
import axios from "axios";
import {getError} from "../utils";
import {Button, Container, Form} from "react-bootstrap";
import LoadingBox from "../komponensek/LoadingBox";
import MessageBox from "../komponensek/MessageBox";
import {toast} from "react-toastify";
import {DatePicker} from "antd";
import moment from "moment/moment";


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {...state, loading: false,};
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload};
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return {...state, loadingUpdate: false,};
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false,};
        default:
            return state;
    }
};
function disabledDate(current) {
    return (
        current && (current < moment('2023-12-01') || current > moment('2024-04-01'))
    )
}

export default function WeatherEditScreen(){
    const navigate = useNavigate();
    const params = useParams();
    const { id: weatherId } = params;
    const {state} = useContext(Store);
    const {userInfo} = state;

    const [{loading, error, loadingUpdate}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const [dateW,setDateW] = useState();
    const [snow,setSnow] = useState(0);
    const [temperature, setTemperature] = useState(0.0)
    const [conditions, setConditions] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({type: 'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/weather/${weatherId}`);
                setDateW(data.dateW);
                setSnow(data.snow);
                setTemperature(data.temperature);
                setConditions(data.conditions);
                dispatch({type: 'FETCH_SUCCESS'});
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                });
            }}
        fetchData();
    },[weatherId]);

    function selectDate(value){
        setDateW(value.format('YYYY-MM-DD'));
    }

    const submintHandler = async (e) => {
        e.preventDefault();
        try{
            dispatch({type: 'UPDATE_REQUEST'});
            await axios.put(`/api/weather/${weatherId}`,
                {
                    _id: weatherId,
                    dateW,
                    snow,
                    temperature,
                    conditions,
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({
                type: 'UPDATE_SUCCESS',
            });
            toast.success('Weather sikeresen frissítve');
            navigate('/admin/weathers');
        }catch (err) {
            toast.error(getError(err));
            dispatch({ type: 'UPDATE_FAIL' });
        }
    };

    return(
        <Container className={"small-container-edited"}>
            <h2>{weatherId}</h2>
            {loading ? (<LoadingBox></LoadingBox>)
                : error ? (<MessageBox variant={"danger"}>{error}</MessageBox>)
            :(
                <Form onSubmit={submintHandler}>
                    <Form.Group className={"mb-3"} controlId={"dateW"}>
                        <Form.Label>Date</Form.Label>
                        <DatePicker id="datepicker" size={'large'} format='DD/MM/YYYY' onChange={selectDate} required disabledDate={disabledDate} placeholder={"Válassz dátumot"} initialValues={dateW} placeholder={dateW}/>
                    </Form.Group>
                    <Form.Group className={"mb-3"} controlId={"snow"}>
                        <Form.Label>Snow</Form.Label>
                        <Form.Control value={snow} onChange={(e) => setSnow(e.target.value)} required></Form.Control>
                    </Form.Group>
                    <Form.Group className={"mb-3"} controlId={"dateW"}>
                        <Form.Label>Temperature</Form.Label>
                        <Form.Control value={temperature} onChange={(e) => setTemperature(e.target.value)} required></Form.Control>
                    </Form.Group>
                    <div className={"mb-3"}>
                        <Button disabled={loadingUpdate} type={"submit"}>Frissítes</Button>
                        {loadingUpdate && <LoadingBox></LoadingBox>}
                    </div>
                </Form>
                    )}
        </Container>
    )
}