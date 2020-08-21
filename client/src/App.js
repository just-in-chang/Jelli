import React from "react";
import Button from 'react-bootstrap/Button';
import NavBar from 'react-bootstrap/NavBar';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {
    let list = [];
    for (let i = 0; i < 10; i++) list.push("hi");
    const [modalShow, setModalShow] = React.useState(false);

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
                                <Button className="task red" onClick={() => setModalShow(true)}>test</Button>
                                <showModal show={setModalShow} onHide={() => setModalShow(false)}></showModal>
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

function showModal (props) {
    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Modal heading
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Centered Modal</h4>
            <p>
              Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
              dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
              consectetur ac, vestibulum at eros.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
}

export default App;