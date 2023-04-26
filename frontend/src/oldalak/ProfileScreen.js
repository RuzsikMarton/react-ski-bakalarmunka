import React, {useContext, useReducer, useState} from "react";
import {Helmet} from "react-helmet-async";
import {Store} from "../Store";
import {Button, Form} from "react-bootstrap";
import {toast} from "react-toastify";
import {getError} from "../utils";
import axios from "axios";

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_REQUEST':
            return {...state, loadingUpdate: true};
        case 'UPDATE_SUCCESS':
            return {...state, loadingUpdate: false};
        case 'UPDATE_FAIL':
            return {...state, loadingUpdate: false};

        default:
            return state;
    }
}

function ProfileScreen(){
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;
    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

    const [{loadingUpdate}, dispatch] = useReducer(reducer , {
        loadingUpdate : false,
    });

    const submitHandler = async (e) =>{
        e.preventDefault();
        try {
            const {data} = await axios.put(
                '/api/users/profile',
                {
                    name,
                    email,
                    password,
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({
                type: 'UPDATE_SUCCESS',
            });
            ctxDispatch({type: 'USER_SIGNIN', payload: data});
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Felhasználó adatai frissítve')
        }catch (err){
            dispatch({
                type: 'FETCH_FAIL',
            });
            toast.error(getError(err));
        }
    }

    return (
        <div className={"container small-container"}>
            <Helmet>
                <title>Felhasznalo profil</title>
            </Helmet>
            <h1 className={"my-3"}>Felhasználó profil</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className={'mb-3'} controlId={"name"}>
                    <Form.Label>Név</Form.Label>
                    <Form.Control value={name} onChange={(e) => {setName(e.target.value)}} required></Form.Control>
                </Form.Group>
                <Form.Group className={'mb-3'} controlId={"email"}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type={"email"} value={email} onChange={(e) => {setEmail(e.target.value)}} required></Form.Control>
                </Form.Group>
                <Form.Group className={'mb-3'} controlId={"password"}>
                    <Form.Label>Új jelszó</Form.Label>
                    <Form.Control type={"password"} value={password} onChange={(e) => {setPassword(e.target.value)}}></Form.Control>
                </Form.Group>
                <Form.Group className={'mb-3'} controlId={"password"}>
                    <Form.Label>Jelszó megerősítése</Form.Label>
                    <Form.Control type={"password"} value={confirmpassword} onChange={(e) => {setConfirmPassword(e.target.value)}}></Form.Control>
                </Form.Group>
                <div className={"mb-3"}>
                    <Button type={"submit"}>Adatok frissítése</Button>
                </div>
            </Form>
        </div>
    )
}

export default ProfileScreen;