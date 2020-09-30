import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { toColor } from "../crud_api";
import "../styles/Board.css";
import { CardModal } from "./modals/card/CardModal";

function ACard(props) {
    const [show, setShow] = useState(false);
    const [removed, setRemoved] = useState(false);
    const [color, setColor] = useState(toColor(props.c).toString());
    const [description, setDescription] = useState(props.description);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const dragStart = (e) => {
        const target = e.target;
        e.dataTransfer.setData("cardId", props.id);
        e.dataTransfer.setData("color", color.charAt(0).toLowerCase());
        e.dataTransfer.setData("title", props.title);
        e.dataTransfer.setData("description", description);
        setTimeout(() => {
            target.style.opacity = 0.25;
            props.removeId(props.id);
            // let cardsPh = [...props.cards];
            // for (let i = 0; i < cardsPh.length; i++) {
            //     if (cardsPh[0].props.id == props.id) {
            //         cardsPh.splice(i, 1);
            //         props.setCards(cardsPh);
            //         console.log(cardsPh);
            //         break;
            //     }
            // }
        }, 0);
    };

    return !removed ? (
        <Row className="rowmargin" draggable={true} onDragStart={dragStart}>
            <CardModal
                show={show}
                id={props.id}
                removed={setRemoved}
                categoryId={props.categoryId}
                onHide={handleClose}
                title={props.title}
                description={description}
                newColor={setColor}
                newDescription={setDescription}
            />
            <Button
                className={color + "Card fitCategory"}
                onClick={handleShow}
                id={props.id}
            >
                {props.title}
            </Button>
        </Row>
    ) : null;
}

export { ACard };

