import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { calculatePositions, newCard } from "../../../crud_api";
import "../../../styles/Board.css";

function NewCardModal(props) {
    const [error, setError] = useState("");
    const handleSubmit = (e) => {
        let color = e.target.color.value.charAt(0).toLowerCase();
        let description = e.target.description.value;
        let title = e.target.title.value;

        e.stopPropagation();
        e.preventDefault();

        if (title.length > 0) {
            newCard(
                title,
                color,
                description,
                props.categoryId,
                props.position,
                props.newCard,
                calculatePositions
            );
            return props.onHide();
        } else setError("Please insert title!");
    };

    return (
        <Modal {...props}>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>New Card</Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="testformcolor">
                        <Form.Label>Title</Form.Label>
                        <Form.Control as="textarea" rows="1" name="title" />
                    </Form.Group>
                    <Form.Group controlId="testformcolor">
                        <Form.Label>Color</Form.Label>
                        <Form.Control as="select" name="color">
                            <option>Red</option>
                            <option>Orange</option>
                            <option>Green</option>
                            <option>Blue</option>
                            <option>Indigo</option>
                            <option>Violet</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="testform">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows="5"
                            name="description"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <div className="errorMessage">{error}</div>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

export { NewCardModal };
