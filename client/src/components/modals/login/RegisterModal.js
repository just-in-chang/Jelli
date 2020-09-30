import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { handleRegister } from "../../../crud_api";
import "../../../styles/Login.css";

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

export { RegisterModal };
