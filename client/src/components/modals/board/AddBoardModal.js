import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { newBoard } from "../../../crud_api";
import "../../../styles/User.css";

function AddBoardModal(props) {
    const [error, setError] = useState("");

    const successStar = (u, id) => {
        props.star(u, id);
        props.onHide();
    };

    const successBoard = (u, id) => {
        props.board(u, id);
        props.onHide();
    };

    const handleSubmit = (e) => {
        let title = e.target.title.value;
        let star = e.target.star.checked;

        e.stopPropagation();
        e.preventDefault();

        newBoard(
            props.cookies.get("user"),
            title,
            star,
            setError,
            successStar,
            successBoard,
            props.cookies
        );
    };

    return (
        <Modal {...props}>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>New Board</Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Board Title</Form.Label>
                        <Form.Control name="title" type="text" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Star</Form.Label>
                        <Form.Control name="star" type="checkbox" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <p className="error">{error}</p>
                    <Button variant="primary" type="submit" className="submit">
                        Submit
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

export { AddBoardModal };
