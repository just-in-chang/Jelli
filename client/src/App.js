import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { Redirect } from "react-router-dom";
import "./App.css";
import {
    changeCard,
    deleteBoard,
    deleteCard,
    deleteCategory,
    getBoardName,
    getCards,
    getCategories,
    newCard,
    newCategory,
    editCategory,
    editBoard,
    updateCardPosition,
    updateCategoryPosition,
} from "./crud_api";
import { HeaderBar } from "./header";

function App(props) {
    let cookies = props.cookies;

    const [categories, setCategories] = useState([]);
    const [b, setB] = useState("");
    const [newCategoryModalShow, setNewCategoryModalShow] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [backUser, setBackUser] = useState(false);
    const [editBoardShow, setEditBoardShow] = useState(false);
    const [starred, setStarred] = useState(cookies.get("star"));

    const addCategory = (n, i, p) => {
        let categoryArray = [];
        for (let j = 0; j < n.length; j++) {
            categoryArray.splice(
                p[j],
                0,
                <CreateCategory
                    title={n[j]}
                    id={i[j]}
                    cookies={props.cookies}
                />
            );
        }
        setCategories(categoryArray);
    };

    const newCategoryMethod = (title, id) => {
        let ph = [...categories];
        ph.push(
            <CreateCategory title={title} id={id} cookies={props.cookies} />
        );
        setCategories(ph);
    };

    useEffect(() => {
        getCategories(cookies.get("board"), addCategory);
        getBoardName(cookies.get("board"), setB);
    }, [cookies]);

    useEffect(() => {
        calculatePositions();
    }, [categories]);

    return (
        <div className="background">
            {backUser ? <Redirect to="/user" /> : null}
            <EditBoardModal
                show={editBoardShow}
                title={b}
                changeTitle={setB}
                star={starred}
                changeStar={setStarred}
                id={cookies.get("board")}
                userId={cookies.get("user")}
                onHide={() => setEditBoardShow(false)}
                cookies={cookies}
            />
            <NewCategoryModal
                show={newCategoryModalShow}
                position={categories.length}
                boardId={cookies.get("board")}
                newCategory={newCategoryMethod}
                onHide={() => setNewCategoryModalShow(false)}
            />
            <ConfirmDeleteModal
                show={confirmDelete}
                boardId={cookies.get("board")}
                redir={setBackUser}
                onHide={() => setConfirmDelete(false)}
            />
            <div className="boardBg">
                <HeaderBar cookies={cookies} />
                <h1 className="justify-content-between">{b}</h1>
                <div className="buttonDiv">
                    <Button
                        className="addButton"
                        variant="secondary"
                        onClick={() => setNewCategoryModalShow(true)}
                    />
                    <Button
                        className="editButton"
                        variant="secondary"
                        onClick={() => setEditBoardShow(true)}
                    />
                    <Button
                        className="deleteButton"
                        variant="secondary"
                        onClick={() => setConfirmDelete(true)}
                    />
                </div>
                {categories}
            </div>
        </div>
    );
}

function ConfirmDeleteModal(props) {
    const handleSubmit = (e) => {
        deleteBoard(props.boardId);
        props.redir(true);
    };

    return (
        <Modal {...props}>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>Confirm Delete Board?</Modal.Header>
                <Modal.Footer>
                    <Button variant="danger" type="submit">
                        Submit
                    </Button>
                    <Button variant="secondary" onClick={() => props.onHide()}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

function CardModal(props) {
    const handleSubmit = (e) => {
        let color = e.target.color.value.charAt(0).toLowerCase();
        let description = e.target.description.value;

        e.stopPropagation();
        e.preventDefault();

        props.newColor(toColor(color));
        props.newDescription(description);
        changeCard(
            props.id,
            props.title,
            color,
            description,
            props.categoryId,
            calculatePositions
        );
        return props.onHide();
    };

    const deleteThisCard = () => {
        props.removed(true);
        props.onHide();
        deleteCard(props.id, calculatePositions);
    };

    return (
        <Modal {...props}>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    Edit Card: {props.title}
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="testformcolor">
                        <Form.Label>Title</Form.Label>
                        <Form.Control as="textarea" rows="1" name="title">
                            {props.title}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="testformcolor">
                        <Form.Label>Color</Form.Label>

                        <Form.Control
                            as="select"
                            defaultValue={props.color}
                            name="color"
                        >
                            <option>Red</option>
                            <option>Orange</option>
                            <option>Green</option>
                            <option>Blue</option>
                            <option>Indigo</option>
                            <option>Violet</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="testform">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows="5" name="description">
                            {props.description}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    <Button variant="danger" onClick={deleteThisCard}>
                        Delete
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

function NewCardModal(props) {
    const [error, setError] = useState("");
    const handleSubmit = (e) => {
        let color = e.target.color.value.charAt(0).toLowerCase();
        let description = e.target.description.value;
        let title = e.target.title.value;

        e.stopPropagation();
        e.preventDefault();

        if (title.length > 0) {
            newCard(
                title,
                color,
                description,
                props.categoryId,
                props.position,
                props.newCard,
                calculatePositions
            );
            return props.onHide();
        } else setError("Please insert title!");
    };

    return (
        <Modal {...props}>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>New Card</Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="testformcolor">
                        <Form.Label>Title</Form.Label>
                        <Form.Control as="textarea" rows="1" name="title" />
                    </Form.Group>
                    <Form.Group controlId="testformcolor">
                        <Form.Label>Color</Form.Label>
                        <Form.Control as="select" name="color">
                            <option>Red</option>
                            <option>Orange</option>
                            <option>Green</option>
                            <option>Blue</option>
                            <option>Indigo</option>
                            <option>Violet</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="testform">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows="5"
                            name="description"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <div className="errorMessage">{error}</div>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

function NewCategoryModal(props) {
    const [error, setError] = useState("");
    const handleSubmit = (e) => {
        let title = e.target.title.value;

        e.stopPropagation();
        e.preventDefault();

        if (title.length > 0) {
            newCategory(
                title,
                props.boardId,
                props.position,
                props.newCategory,
                calculatePositions
            );
            return props.onHide();
        } else setError("Please insert title!");
    };

    return (
        <Modal {...props}>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>New Category</Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="testformcolor">
                        <Form.Label>Title</Form.Label>
                        <Form.Control as="textarea" rows="1" name="title" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <div className="errorMessage">{error}</div>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

function EditCategoryModal(props) {
    const [error, setError] = useState("");
    const handleSubmit = (e) => {
        let title = e.target.title.value;

        e.stopPropagation();
        e.preventDefault();

        if (title.length > 0) {
            editCategory(props.id, title, props.boardId, calculatePositions);
            props.changeTitle(title);
            return props.onHide();
        } else setError("Please insert title!");
    };

    return (
        <Modal {...props}>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    Edit {props.title} Category
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="testformcolor">
                        <Form.Label>Title</Form.Label>
                        <Form.Control as="textarea" rows="1" name="title">
                            {props.title}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <div className="errorMessage">{error}</div>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

function EditBoardModal(props) {
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        let title = e.target.title.value;
        let star = e.target.star.checked;

        e.stopPropagation();
        e.preventDefault();

        if (title.length > 0) {
            editBoard(props.id, title, star, props.userId);
            props.changeTitle(title);
            props.cookies.set("star", star, { path: "/" });
            props.changeStar(star ? "true" : "false");
            return props.onHide();
        }
        return setError("Please insert title!");
    };

    return (
        <Modal {...props}>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    Edit {props.title} Board
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control as="textarea" rows="1" name="title">
                            {props.title}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Star</Form.Label>
                        <Form.Control
                            name="star"
                            type="checkbox"
                            defaultChecked={props.star == "true" ? true : false}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <p className="error">{error}</p>
                    <Button variant="primary" type="submit" className="submit">
                        Submit
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

function CreateCategory(props) {
    let [showCategory, setShowCategory] = useState(true);
    let [cards, setCards] = useState([]);
    let [showNewCardModal, setShowNewCardModal] = useState(false);
    let [showEditCategory, setEditCategory] = useState(false);
    let [categoryTitle, setCategoryTitle] = useState(props.title);

    const addCard = (names, ids, colors, descriptions, positions) => {
        let cardArray = [];
        for (let i = 0; i < names.length; i++) {
            cardArray.splice(
                positions[i],
                0,
                <ACard
                    categoryId={props.id}
                    c={colors[i]}
                    title={names[i]}
                    id={ids[i]}
                    description={descriptions[i]}
                />
            );
        }
        setCards(cardArray);
    };

    const newCard = (title, color, description, id) => {
        let ph = [...cards];
        ph.push(
            <ACard
                categoryId={props.id}
                c={color}
                title={title}
                id={id}
                description={description}
            />
        );
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
        const cardId = e.dataTransfer.getData("cardId");
        if (!cardId) return;
        console.log(e.target);
        e.preventDefault();
    };

    useEffect(() => getCards(props.id, addCard), [props.cookies]);

    useEffect(() => {
        calculatePositions();
    }, [cards]);

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
                    <Container fluid>{cards}</Container>
                </Card.Body>
            </Card>
        </div>
    ) : null;
}

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

    return !removed ? (
        <Row
            className="rowmargin"
            draggable={true}
            onDragStart={dragStart}
            onDragEnd={dragEnd}
        >
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

const calculatePositions = () => {
    let categories = document.querySelectorAll(".container");
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i];
        let categoryId = category.getAttribute("id");
        let buttons = category.querySelectorAll(".fitCategory");
        for (let j = 0; j < buttons.length; j++) {
            let buttonId = buttons[j].getAttribute("id");
            updateCardPosition(buttonId, j);
        }
        updateCategoryPosition(categoryId, i);
    }
};

const toColor = (char) => {
    switch (char) {
        case "r":
            return "Red";
        case "o":
            return "Orange";
        case "y":
            return "Yellow";
        case "g":
            return "Green";
        case "b":
            return "Blue";
        case "i":
            return "Indigo";
        case "v":
            return "Violet";
    }
};

export { App };
