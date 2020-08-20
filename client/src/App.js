import React from "react";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {
    let list = [];
    for (let i = 0; i < 10; i++) list.push(<Card title="hi"></Card>);

    return (
        <div className="background">
            <Button className="urmom">ur mom</Button>
            <Button className="urmom">Primary</Button>
            {list}
            listhi penis
        </div>
    );
}

function Meme(props) {
    return <div>{props.naasdme}</div>;
}

function Card(props) {
    let s = props.title;
    s += "cock";
    
    return <div className="card">{s}</div>
}

export default App;