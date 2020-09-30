import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { deleteBoard } from "../../../crud_api";
import "../../../styles/Board.css";

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

export { ConfirmDeleteModal };
