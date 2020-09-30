import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/esm/Button";
import { Redirect } from "react-router-dom";
import { HeaderBar } from "../components/HeaderBar";
import { addBoards, updateBoardPosition } from "../crud_api";
import "../styles/User.css";
import { AddBoardModal } from "../components/modals/board/AddBoardModal";

function User(props) {
    const [star, setStar] = useState([]);
    const [boards, setBoards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    let cookies = props.cookies;

    let addStar = (n) => {
        let stars = [];
        for (let i = 0; i < n.length; i++)
            stars.push(
                <Button
                    className="green"
                    id={n[i].id}
                    onClick={() => {
                        cookies.set("board", n[i].id, { path: "/" });
                        cookies.set("star", true, { path: "/" });
                        setRedirect(true);
                    }}
                >
                    <h3>{n[i].name}</h3>
                </Button>
            );
        setStar(stars);
    };

    let addBoard = (n) => {
        let b = [];
        for (let i = 0; i < n.length; i++)
            b.push(
                <Button
                    className="green"
                    id={n[i].id}
                    onClick={() => {
                        cookies.set("board", n[i].id, { path: "/" });
                        cookies.set("star", false, { path: "/" });
                        setRedirect(true);
                    }}
                >
                    <h3>{n[i].name}</h3>
                </Button>
            );
        setBoards(b);
    };

    let newStar = (n, id) => {
        setStar(
            star.concat(
                <Button
                    className="green"
                    id={id}
                    onClick={() => {
                        setRedirect(true);
                    }}
                >
                    <h3>{n}</h3>
                </Button>
            )
        );
    };

    let newBoard = (n, id) => {
        setBoards(
            boards.concat(
                <Button
                    className="green"
                    id={id}
                    onClick={() => {
                        setRedirect(true);
                    }}
                >
                    <h3>{n}</h3>
                </Button>
            )
        );
    };

    useEffect(() => addBoards(cookies.get("user"), addStar, addBoard), [
        cookies,
    ]);

    useEffect(() => calculatePositions(), [star, boards]);

    return (
        <div className="background">
            <div className="boardBg">
                {redirect ? (
                    <Redirect to={"/board"} />
                ) : (
                    <HeaderBar cookies={cookies} />
                )}
                <AddBoardModal
                    show={showModal}
                    onHide={handleCloseModal}
                    cookies={cookies}
                    star={newStar}
                    board={newBoard}
                />

                <div className="bkgd">
                    <h1>Boards</h1>
                    <div className="addBoard">
                        <Button
                            variant="secondary"
                            className="addButton"
                            onClick={handleShowModal}
                        />
                    </div>
                    <h2>Starred</h2>
                    <Container className="backgroundU">{star}</Container>
                    <h2>Other Boards</h2>
                    <Container className="backgroundU">{boards}</Container>
                </div>
            </div>
        </div>
    );
}

const calculatePositions = () => {
    let boards = document.querySelectorAll(".backgroundU");
    for (let i = 0; i < boards.length; i++) {
        let boardGroup = boards[i];
        let board = boardGroup.querySelectorAll(".green");
        for (let j = 0; j < board.length; j++) {
            let boardId = board[j].getAttribute("id");
            updateBoardPosition(boardId, j);
        }
    }
};

export { User };
