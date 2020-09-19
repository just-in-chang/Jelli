import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import "./App.css";
import { getCategories, getCards, getBoardName, changeCard } from "./crud_api";
import { HeaderBar } from "./header";

function App(props) {
    let cookies = props.cookies;

    const [categories, setCategories] = useState([]);
    const [b, setB] = useState("");

    const addCategory = (n, i) => {
        let categoryArray = [];
        for (let j = 0; j < n.length; j++) {
            categoryArray.push(
                <CreateCategory
                    title={n[j]}
                    id={i[j]}
                    cookies={props.cookies}
                />
            );
        }
        setCategories(categoryArray);
    };

    useEffect(() => {
        getCategories(cookies.get("board"), addCategory);
        getBoardName(cookies.get("board"), setB);
    }, [cookies]);

    return (
        <div className="background">
            <div className="boardBg">
                <HeaderBar cookies={cookies} />
                <h1 className="justify-content-between">
                    {b}
                    <Button className="add">+</Button>
                </h1>
                {categories}
            </div>
        </div>
    );
}

function CardModal(props) {
    const handleSubmit = (e) => {
        let color = e.target.color.value.charAt(0).toLowerCase();
        let description = e.target.description.value;

        e.stopPropagation();
        e.preventDefault();

        props.newColor(toColor(color));
        props.newDescription(description);
        changeCard(props.id, props.title, color, description, props.categoryId);
        return props.onHide();
    };

    return (
        <Modal {...props}>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>{props.title}</Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="testformcolor">
                        <Col>
                            <Row>
                                <Form.Label>Color</Form.Label>
                            </Row>
                            <Row>
                                <Form.Control
                                    as="select"
                                    defaultValue={props.color}
                                    name="color"
                                >
                                    <option>Red</option>
                                    <option>Orange</option>
                                    <option>Yellow</option>
                                    <option>Green</option>
                                    <option>Blue</option>
                                    <option>Indigo</option>
                                    <option>Violet</option>
                                </Form.Control>
                            </Row>
                        </Col>
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
                </Modal.Footer>
            </form>
        </Modal>
    );
}

function CreateCategory(props) {
    let [cards, setCards] = useState([]);

    const addCard = (names, ids, colors, descriptions) => {
        let cardArray = [];
        for (let i = 0; i < names.length; i++) {
            cardArray.push(
                <Row className="rowmargin">
                    <ACard
                        categoryId={props.id}
                        c={colors[i]}
                        title={names[i]}
                        id={ids[i]}
                        description={descriptions[i]}
                    />
                </Row>
            );
        }
        setCards(cardArray);
    };

    useEffect(() => getCards(props.id, addCard), [props.cookies]);

    return (
        <Card className="container">
            <Card.Header>
                {props.title}
                <Button variant="secondary" className="addcard float-right">
                    +
                </Button>
            </Card.Header>
            <Card.Body className="text-center">
                <Container fluid>{cards}</Container>
            </Card.Body>
        </Card>
    );
}

function ACard(props) {
    const [show, setShow] = useState(false);

    const [color, setColor] = useState(toColor(props.c).toString());
    const [description, setDescription] = useState(props.description);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            <CardModal
                show={show}
                id={props.id}
                categoryId={props.categoryId}
                onHide={handleClose}
                title={props.title}
                description={description}
                newColor={setColor}
                newDescription={setDescription}
            />
            <Button className={color + "Card noBorder"} onClick={handleShow}>
                {props.title}
            </Button>
        </div>
    );
}

const toColor = (char) => {
    switch (char) {
        case "r":
            return "Red";
        case "o":
            return "Orange";
        case "y":
            return "Yellow";
        case "g":
            return "Green";
        case "b":
            return "Blue";
        case "i":
            return "Indigo";
        case "v":
            return "Violet";
    }
};

export { App };
