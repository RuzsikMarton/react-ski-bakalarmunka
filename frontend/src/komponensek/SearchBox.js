import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

function SearchBox(){
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/search/?query=${query}` : '/search');
    }
    return (
        <Form className={"d-flex me-auto"} onSubmit={submitHandler}>
            <InputGroup>
                <FormControl type={"text"} id={"q"} name={"q"} onChange={(e)=>setQuery(e.target.value)} placeholder={"termekek keresese..."} aria-label={"Search Products"} aria-describedby={"button-search"}>
                </FormControl>
                <Button type={"submit"} id={"button-search"}><i className={"fas fa-search"}></i></Button>
            </InputGroup>
        </Form>
    )
}

export default SearchBox;