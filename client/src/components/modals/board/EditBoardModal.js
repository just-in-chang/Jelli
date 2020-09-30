import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { editBoard } from "../../../crud_api";
import "../../../styles/Board.css";

function EditBoardModal(props) {
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        let title = e.target.title.value;
        let star = e.target.star.checked;

        e.stopPropagation();
        e.preventDefault();

        if (title.length > 0) {
            editBoard(props.id, title, star, props.userId);
            props.changeTitle(title);
            props.cookies.set("star", star, { path: "/" });
            props.changeStar(star ? "true" : "false");
            return props.onHide();
        }
        return setError("Please insert title!");
    };

    return (
        <Modal {...props}>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    Edit {props.title} Board
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control as="textarea" rows="1" name="title">
                            {props.title}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Star</Form.Label>
                        <Form.Control
                            name="star"
                            type="checkbox"
                            defaultChecked={props.star == "true" ? true : false}
                        />
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

export { EditBoardModal };
