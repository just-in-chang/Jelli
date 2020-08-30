import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import { HeaderBar } from "./App";
import { addBoards, newBoard } from "./crud_api";
import "./user.css";

function AddBoardModal(props) {
    const [error, setError] = useState("");

    const successStar = (u) => {
        let tempRow = [];
        for (let i = 0; i < u.length; i++) {
            tempRow.push(u[i]);
            if (i % 6 == 5) {
                props.star(tempRow);
                tempRow = [];
            }
        }
        if (tempRow.length != 0) props.star(tempRow);
        props.onHide();
    };

    const successBoard = (u) => {
        let tempRow = [];
        for (let i = 0; i < u.length; i++) {
            tempRow.push(u[i]);
            if (i % 6 == 5) {
                props.board(tempRow);
                tempRow = [];
            }
        }
        if (tempRow.length != 0) props.board(tempRow);
        props.onHide();
    };

    const handleSubmit = (e) => {
        let title = e.target.title.value;
        let star = e.target.star.checked;

        e.stopPropagation();
        e.preventDefault();

        newBoard(
            props.cookies.get("user"),
            title,
            star,
            setError,
            successStar,
            successBoard
        );
    };

    return (
        <Modal {...props}>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>New Board</Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Board Title</Form.Label>
                        <Form.Control name="title" type="text" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Star</Form.Label>
                        <Form.Control name="star" type="checkbox" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <p className="error">{error}</p>
                    <Button variant="primary" type="submit" className="submit">
                        Login
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

function User(props) {
    const [star, setStar] = useState([]);
    const [boards, setBoards] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    let addStar = (n) => {
        let stars = [];
        for (let i = 0; i < n.length; i++)
            stars.push(
                <Button className="green">
                    <h3>{n[i]}</h3>
                </Button>
            );
        setStar(
            star.concat(<Container className="backgroundU">{stars}</Container>)
        );
    };

    let addBoard = (n) => {
        let b = [];
        for (let i = 0; i < n.length; i++)
            b.push(
                <Button className="green">
                    <h3>{n[i]}</h3>
                </Button>
            );
        setBoards(
            boards.concat(<Container className="backgroundU">{b}</Container>)
        );
    };

    let newStar = (n) => {
        setStar(
            star.concat(
                <Button className="green">
                    <h3>{n}</h3>
                </Button>
            )
        );
    };

    let newBoard = (n) => {
        setBoards(
            boards.concat(
                <Button className="green">
                    <h3>{n}</h3>
                </Button>
            )
        );
    };

    let cookies = props.cookies;

    useEffect(() => addBoards(cookies.get("user"), addStar, addBoard), [
        cookies,
    ]);

    return (
        <div>
            <AddBoardModal
                show={showModal}
                onHide={handleCloseModal}
                cookies={cookies}
                star={newStar}
                board={newBoard}
            />
            <HeaderBar />

            <div className="bkgd">
                <h1>
                    Boards
                    <Button className="add" onClick={handleShowModal}>
                        +
                    </Button>
                </h1>
                <h2>Starred</h2>
                {star}
                <h2>Other Boards</h2>
                {boards}
            </div>
        </div>
    );
}

export { User };
