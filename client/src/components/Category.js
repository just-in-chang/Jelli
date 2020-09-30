import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import {
    calculatePositions,
    changeCardCategory,
    deleteCategory,
    getCards
} from "../crud_api";
import "../styles/Board.css";
import { ACard } from "./ACard";
import { NewCardModal } from "./modals/card/NewCardModal";
import { EditCategoryModal } from "./modals/category/EditCategoryModal";

function Category(props) {
    const [loading, setLoading] = useState(true);
    const [showCategory, setShowCategory] = useState(true);
    const [showNewCardModal, setShowNewCardModal] = useState(false);
    const [showEditCategory, setEditCategory] = useState(false);
    const [categoryTitle, setCategoryTitle] = useState(props.title);

    let [cards, setCards] = useState([]);

    const removeId = (id) => {
        let cardsPh = [...cards];
        for (let i = 0; i < cardsPh.length; i++) {
            if (cardsPh[i].id == id) {
                cardsPh.splice(i, 1);
                setCards(cardsPh);
                break;
            }
        }
    };

    const newCard = (title, color, description, id) => {
        let ph = [...cards];
        ph.push({
            id: parseInt(id),
            title: title,
            description: description,
            color: color,
            category: props.id,
        });
        setCards(ph);
    };

    const dragStart = (e) => {
        const target = e.target;
        e.dataTransfer.setData("categoryId", props.id);
        setTimeout(() => {
            target.style.opacity = 0.25;
        }, 0);
    };

    const dragEnd = (e) => {
        const target = e.target;
        setTimeout(() => {
            target.style.opacity = 1;
        });
    };

    const drop = (e) => {
        let droppedOnto;
        const cardId = e.dataTransfer.getData("cardId");

        if (e.target.getAttribute("class").includes("fitCategory"))
            droppedOnto = e.target.parentElement.parentElement.parentElement;
        else if (e.target.getAttribute("class").includes("categoryBody"))
            droppedOnto = e.target;
        else if (e.target.getAttribute("class").includes("container-fluid"))
            droppedOnto = e.target.parentElement;

        if (!cardId || !droppedOnto) return;

        let cardsPh = [...cards];
        cardsPh.push({
            id: parseInt(cardId),
            title: e.dataTransfer.getData("title"),
            description: e.dataTransfer.getData("description"),
            color: e.dataTransfer.getData("color"),
            category: props.id,
            position: 0,
        });
        console.log(cardId, props.id);
        changeCardCategory(cardId, props.id);
        setCards(cardsPh);
        calculatePositions();
        e.preventDefault();
    };

    useEffect(() => {
        if (loading) {
            getCards(props.id, setCards, setLoading);
        }
    });

    return showCategory ? (
        <div>
            <EditCategoryModal
                show={showEditCategory}
                onHide={() => setEditCategory(false)}
                title={categoryTitle}
                id={props.id}
                boardId={props.cookies.get("board")}
                changeTitle={setCategoryTitle}
            />
            <NewCardModal
                show={showNewCardModal}
                onHide={() => setShowNewCardModal(false)}
                newCard={newCard}
                categoryId={props.id}
                position={cards.length}
            />
            <Card
                className="container"
                id={props.id}
                draggable={true}
                onDragStart={dragStart}
                onDragEnd={dragEnd}
                onDrop={drop}
                onDragOver={(e) => e.preventDefault()}
            >
                <Card.Header className="categoryHeader">
                    <div>{categoryTitle}</div>
                </Card.Header>
                <Card.Header className="categoryHeader2">
                    <Button
                        variant="secondary"
                        className="addButton float-right"
                        onClick={() => setShowNewCardModal(true)}
                    />
                    <Button
                        variant="secondary"
                        className="deleteButton float-right"
                        onClick={() => {
                            setShowCategory(false);
                            deleteCategory(props.id, calculatePositions);
                        }}
                    />
                    <Button
                        variant="secondary"
                        className="editButton float-right"
                        onClick={() => {
                            setEditCategory(true);
                        }}
                    />
                </Card.Header>
                <Card.Body className="text-center categoryBody">
                    <Container fluid>
                        {cards != null &&
                            cards.map((card) => (
                                <ACard
                                    categoryId={props.id}
                                    c={card.color}
                                    title={card.title}
                                    id={card.id}
                                    description={card.description}
                                    removeId={removeId}
                                />
                            ))}
                    </Container>
                </Card.Body>
            </Card>
        </div>
    ) : null;
}

export { Category };

