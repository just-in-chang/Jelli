import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";
import "../styles/Board.css";
import { HeaderBar } from "../components/HeaderBar";
import { getBoardName, getCategories, calculatePositions2 } from "../crud_api";
import { ConfirmDeleteModal } from "../components/modals/board/ConfirmDeleteModal";
import { Category } from "../components/Category";
import { NewCategoryModal } from "../components/modals/category/NewCategoryModal";
import { EditBoardModal } from "../components/modals/board/EditBoardModal";

function Board(props) {
    let cookies = props.cookies;

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [b, setB] = useState("");
    const [newCategoryModalShow, setNewCategoryModalShow] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [backUser, setBackUser] = useState(false);
    const [editBoardShow, setEditBoardShow] = useState(false);
    const [starred, setStarred] = useState(cookies.get("star"));

    const newCategoryMethod = (name, id) => {
        let ph = [...categories];
        ph.push({ name: name, id: id });
        setCategories(ph);
    };

    useEffect(() => {
        if (cookies.get("board") == undefined) setBackUser(true);
        if (loading) {
            getCategories(cookies.get("board"), setCategories, setLoading);
            getBoardName(cookies.get("board"), setB);
        }
    });

    useEffect(() => {
        calculatePositions2();
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
                {categories != null &&
                    categories.map((category) => (
                        <Category
                            id={category.id}
                            title={category.name}
                            cookies={cookies}
                        />
                    ))}
            </div>
        </div>
    );
}

export { Board };
