import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import { App, HeaderBar } from "./App";
import { User } from "./user.js";
import { handleLogin, handleRegister } from "./crud_api";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const cookies = new Cookies();

function RegisterModal(props) {
    const [error, setError] = useState("");

    const success = (u) => {
        props.cookies.set("user", u, { path: "/" });
        props.redir(true);
    };

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
        else return handleRegister(username, password, setError, success);
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

    const success = (u) => {
        props.cookies.set("user", u, { path: "/" });
        props.redir(true);
    };

    const handleSubmit = (e) => {
        let username = e.target.username.value;
        let password = e.target.password.value;

        e.stopPropagation();
        e.preventDefault();

        if (username.length == 0 || password.length == 0)
            setError("Please complete all fields");
        else handleLogin(username, password, setError, success);
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
                        Login
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

function Login() {
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const handleCloseRegister = () => setShowRegister(false);
    const handleShowRegister = () => setShowRegister(true);

    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);

    useEffect(() => {
        if (cookies.get("user") != null) setRedirect(true);
    }, [cookies]);

    return (
        <div>
            {redirect ? <Redirect to="/user" /> : <HeaderBar />}
            <RegisterModal
                show={showRegister}
                onHide={handleCloseRegister}
                cookies={cookies}
                redir={setRedirect}
            />
            <LoginModal
                show={showLogin}
                onHide={handleCloseLogin}
                cookies={cookies}
                redir={setRedirect}
            />
            <div className="background">
                <div className="rlButtons">
                    <Button
                        className="indigo task rlButton"
                        onClick={handleShowRegister}
                    >
                        Register
                    </Button>
                    <Button
                        className="orange task rlButton"
                        onClick={handleShowLogin}
                    >
                        Login
                    </Button>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(
    <Router>
        <Route exact path="/" component={() => <Login cookies={cookies} />} />
        <Route
            exact
            path="/user"
            component={() => <User cookies={cookies} />}
        />
        <Route path="/board" component={() => <App cookies={cookies} />} />
    </Router>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
