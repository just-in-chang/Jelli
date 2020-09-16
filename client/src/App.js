import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import "./App.css";
import { HeaderBar } from "./header";

function App(props) {
    let cookies = props.cookies;

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="background">
            <div className="boardBg">
                <HeaderBar cookies={cookies} />
                <CardModal show={show} onHide={handleClose} />
                <CreateCategory click={handleShow} />
                <CreateCategory click={handleShow} />
            </div>
        </div>
    );
}

function CardModal(props) {
    return (
        <Modal {...props}>
            <Modal.Header closeButton>cock</Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="testformcolor">
                        <Col>
                            <Row>
                                <Form.Label>Color</Form.Label>
                            </Row>
                            <Row>
                                <Button className="mb-2">Color</Button>
                            </Row>
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="testform">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows="5" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function CreateCategory(props) {
    let buttons = [
        { title: "cock", color: "red" },
        { title: "and ball", color: "orange" },
        { title: "torture", color: "green" },
    ];
    let list = [];
    for (let i = 0; i < buttons.length; i++) {
        let cName = "task " + buttons[i].color;
        list.push(
            <Row className="rowmargin">
                <Button className={cName + "Card"} onClick={props.click}>
                    {buttons[i].title}
                </Button>
            </Row>
        );
    }

    return (
        <Card className="container">
            <Card.Header>
                Cock
                <Button variant="secondary" className="addcard float-right">
                    +
                </Button>
            </Card.Header>
            <Card.Body className="text-center">
                <Container fluid>{list}</Container>
            </Card.Body>
        </Card>
    );
}

export { App };
