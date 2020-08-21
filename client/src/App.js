import React from "react";
import Button from 'react-bootstrap/Button';
import NavBar from 'react-bootstrap/NavBar';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {
    let list = [];
    for (let i = 0; i < 10; i++) list.push("hi");

    return (
        <div className="background">
            <div>
                <NavBar variant="light" className="navbar">
                    <NavBar.Brand href="#">
                        <img src="jelli.png" width="30" height="26" className="d-inline-block align-top" alt="Jelli logo"/>
                        {' '}Jelli
                    </NavBar.Brand>
                </NavBar>
                <Card className="container">
                    <Card.Body>
                        <Button className="card red">test</Button>
                        <Button className="card orange">test</Button>
                        <Button className="card green">test</Button>
                    </Card.Body>
                </Card>
                
                
            </div>
            {list}
            listhi penis
        </div>
    );
}

// function Card(props) {
//     let s = props.title;
//     s += "cock";
    
//     return <div className="card">{s}</div>
// }

export default App;