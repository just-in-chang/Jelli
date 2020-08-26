import React, { useState, useStateWithPromise } from "react";
import ReactDOM from "react-dom";
import { App, HeaderBar } from "./App";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import * as serviceWorker from "./serviceWorker";
import { getUser, newUser } from "./crud_api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function RegisterModal(props) {
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        let username = e.target.username.value;
        let password = e.target.password.value;
        let passwordConfirm = e.target.passwordConfirm.value;

        e.stopPropagation();
        e.preventDefault();

        if (
            username.length == 0 ||
            password.length == 0 ||
            passwordConfirm.length == 0
        )
            return setError("Please complete all fields");
        else if (password != passwordConfirm)
            return setError("Password does not match");
        else if ((await getUser(username)) != null)
            return setError("This username has already been taken");
    };

    return (
        <Modal {...props}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>Register</Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control name="username" type="text" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control name="passwordConfirm" type="password" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <p className="error">{error}</p>
                    <Button
                        variant="primary"
                        type="submit"
                        className="submit indigo"
                    >
                        Register
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

function LoginModal(props) {
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        console.log(e);
    };

    return (
        <Modal {...props}>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>Login</Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control name="username" type="text" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <p className="error">{error}</p>
                    <Button
                        variant="primary"
                        type="submit"
                        className="submit orange"
                    >
                        Register
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

function Login() {
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const handleRegisterSubmit = () => {
        handleCloseRegister();
    };
    const handleCloseRegister = () => setShowRegister(false);
    const handleShowRegister = () => setShowRegister(true);

    return (
        <div>
            <HeaderBar />
            <RegisterModal show={showRegister} onHide={handleCloseRegister} />
            <div className="background">
                <div className="rlButtons">
                    <Button
                        className="indigo task rlButton"
                        onClick={handleShowRegister}
                    >
                        Register
                    </Button>
                    <Button className="orange task rlButton">Login</Button>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(
    <Router>
        <Route exact path="/" component={Login} />
        <Route path="/board" component={App} />
    </Router>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
