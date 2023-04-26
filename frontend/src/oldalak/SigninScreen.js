import {Card, Form, Button, Container} from "react-bootstrap";
import {Helmet} from "react-helmet-async";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import {Store} from "../Store";
import {toast} from "react-toastify";
import {getError} from "../utils";


function SigninScreen(){
    const navigate = useNavigate();
    const {search} = useLocation();
    const redirectInURL = new URLSearchParams(search).get('redirect');
    const redirect = redirectInURL ? redirectInURL : '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { state , dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    console.log(redirect)
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/users/signin', {
                email,
                password,
            });
            ctxDispatch({type: 'USER_SIGNIN', payload: data})
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');
        }catch (err){
            toast.error(getError(err))
        }
    }

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    return(
        <Container className={"small-container"}>
            <Helmet>
                <title>Bejelenkezes</title>
            </Helmet>
            <Card className={"ps-3 pe-3"}>
            <h1 className={"my-3"}>Bejelentkezés</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className={"mb-3"} controlId={"email"}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type={"email"} required onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className={"mb-3"} controlId={"password"}>
                    <Form.Label>Jelszó</Form.Label>
                    <Form.Control type={"password"} required onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <div className={"mb-3 d-grid"}>
                <Button type="submit">Bejelentkezés</Button>
                </div>
                <div className={"mb-3"}>
                    Új felhasználó?{' '} <Link to={`/signup?redirect=${redirect}`}>Regisztrálj itt</Link>
                </div>
            </Form>
            </Card>

        </Container>
    );
}
export default SigninScreen;