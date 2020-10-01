import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { calculatePositions, changeCard, deleteCard } from "../../../crud_api";
import "../../../styles/Board.css";

function CardModal(props) {
    const handleSubmit = (e) => {
        let title = e.target.title.value;
        let color = e.target.color.value.charAt(0).toLowerCase();
        let description = e.target.description.value;

        e.stopPropagation();
        e.preventDefault();

        props.newTitle(props.id, title);
        props.newColor(props.id, color);
        props.newDescription(props.id, description);
        changeCard(
            props.id,
            title,
            color,
            description,
            props.categoryId,
            calculatePositions
        );
        return props.onHide();
    };

    const deleteThisCard = () => {
        props.removeId(props.id);
        props.onHide();
        deleteCard(props.id, calculatePositions);
    };

    return (
        <Modal {...props}>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    Edit Card: {props.title}
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="testformcolor">
                        <Form.Label>Title</Form.Label>
                        <Form.Control as="textarea" rows="1" name="title">
                            {props.title}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="testformcolor">
                        <Form.Label>Color</Form.Label>

                        <Form.Control
                            as="select"
                            defaultValue={props.color}
                            name="color"
                        >
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
                        <Form.Control as="textarea" rows="5" name="description">
                            {props.description}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    <Button variant="danger" onClick={deleteThisCard}>
                        Delete
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

export { CardModal };
