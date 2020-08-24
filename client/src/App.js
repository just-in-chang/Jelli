import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import NavBar from 'react-bootstrap/NavBar';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Overlay from 'react-bootstrap/Overlay';
import 'bootstrap/dist/css/bootstrap.min.css';
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
                        <img src="jelli.png" width="30" height="26" className="d-inline-block align-top" alt="Jelli logo"/>
                        {'  '}Jelli
                    </NavBar.Brand>
                </NavBar>
                <Card className="container" style={{width: 'fit-content'}}>
                    <Card.Header>Cock</Card.Header>
                    <Card.Body className="text-center">
                        <Container fluid>
                            <Row className="rowmargin">
                                <Button className="task red" onClick = {handleShow}>test</Button>
                                <CardModal show={show} onHide={handleClose}/>
                            </Row>
                            <Row className="rowmargin">
                                <Button className="task orange">test</Button>
                            </Row>
                            <Row className="rowmargin">
                                <Button className="task green">test</Button>
                            </Row>
                        </Container>
                        
                    </Card.Body>
                </Card>
            </div>
            {list}
            listhi penis
        </div>
    );
}

function CardModal (props) {
  const [oShow, oSetShow] = useState(false);
  const target = React.useRef(null);
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
                  <Button className="mb-2" >Color</Button>
                  {/* <Overlay target={target.current} show={oShow} placement="right">
                    <Card>
                      <Card.Header>test</Card.Header>
                      <Card.Body>more test</Card.Body>
                    </Card>
                  </Overlay> */}
                </Row>
              </Col>
            </Form.Group>
            <Form.Group controlId="testform">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows="5"/>
            </Form.Group>
          </Form>
        </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default App;