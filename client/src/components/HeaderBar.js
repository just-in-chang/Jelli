import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Button from "react-bootstrap/Button";
import NavBar from "react-bootstrap/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/HeaderBar.css";

function HeaderBar(props) {
    return (
        <NavBar variant="light" className="navbar justify-content-between">
            <NavBar.Brand href="/" inline>
                <img
                    src="jelli.png"
                    href="/"
                    width="30"
                    height="26"
                    className="d-inline-block align-top"
                    alt="Jelli logo"
                />
                Jelli
            </NavBar.Brand>
            <Button
                inline
                onClick={() => {
                    props.cookies.remove("user");
                    props.cookies.remove("board");
                    props.cookies.remove("star");
                }}
                href="/"
            >
                Sign Out
            </Button>
        </NavBar>
    );
}

export { HeaderBar };
