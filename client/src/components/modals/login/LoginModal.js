import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { handleLogin } from "../../../crud_api";
import "../../../styles/Login.css";

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

export { LoginModal };
