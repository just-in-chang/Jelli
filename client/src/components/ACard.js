import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { toColor } from "../crud_api";
import "../styles/Board.css";
import { CardModal } from "./modals/card/CardModal";

function ACard(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const dragStart = (e) => {
        e.dataTransfer.setData("cardId", props.id);
        e.dataTransfer.setData("color", props.c);
        e.dataTransfer.setData("title", props.title);
        e.dataTransfer.setData("description", props.description);
        console.log(e.clientX);
        setTimeout(() => props.removeId(props.id), 0);
    };

    return (
        <Row className="rowmargin" draggable={true} onDragStart={dragStart}>
            <CardModal
                show={show}
                id={props.id}
                categoryId={props.categoryId}
                onHide={handleClose}
                title={props.title}
                description={props.description}
                newColor={props.changeColor}
                newDescription={props.changeDescription}
                newTitle={props.changeTitle}
                removeId={props.removeId}
            />
            <Button
                className={toColor(props.c) + "Card fitCategory"}
                onClick={handleShow}
                id={props.id}
            >
                {props.title}
            </Button>
        </Row>
    );
}

export { ACard };
