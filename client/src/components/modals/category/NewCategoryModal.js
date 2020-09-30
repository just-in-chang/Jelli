import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { calculatePositions, newCategory } from "../../../crud_api";
import "../../../styles/Board.css";

function NewCategoryModal(props) {
    const [error, setError] = useState("");
    const handleSubmit = (e) => {
        let title = e.target.title.value;

        e.stopPropagation();
        e.preventDefault();

        if (title.length > 0) {
            newCategory(
                title,
                props.boardId,
                props.position,
                props.newCategory,
                calculatePositions
            );
            return props.onHide();
        } else setError("Please insert title!");
    };

    return (
        <Modal {...props}>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>New Category</Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="testformcolor">
                        <Form.Label>Title</Form.Label>
                        <Form.Control as="textarea" rows="1" name="title" />
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

export { NewCategoryModal };
