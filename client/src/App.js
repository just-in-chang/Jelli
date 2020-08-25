import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import NavBar from "react-bootstrap/NavBar";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  let list = [];
  for (let i = 0; i < 10; i++) list.push("hi");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="background">
      <div>
        <NavBar variant="light" className="navbar">
          <NavBar.Brand href="#">
            <img
              src="jelli.png"
              width="30"
              height="26"
              className="d-inline-block align-top"
              alt="Jelli logo"
            />
            {"  "}Jelli
          </NavBar.Brand>
        </NavBar>
        <CardModal show={show} onHide={handleClose} />
        <CreateCategory click={handleShow} />
        <CreateCategory click={handleShow} />
      </div>
      {list}
      listhi penis
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
        <Button className={cName} onClick={props.click}>
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

export default App;
