import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";
import { HeaderBar } from "../components/HeaderBar";
import { LoginModal } from "../components/modals/login/LoginModal";
import { RegisterModal } from "../components/modals/login/RegisterModal";
import "../styles/Login.css";

function Login(props) {
    const cookies = props.cookies;
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const handleCloseRegister = () => setShowRegister(false);
    const handleShowRegister = () => setShowRegister(true);

    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);

    useEffect(() => {
        if (cookies.get("user") != null) setRedirect(true);
    }, [cookies]);

    return (
        <div className="background">
            <div className="boardBg">
                {redirect ? (
                    <Redirect to="/user" />
                ) : (
                    <HeaderBar cookies={cookies} />
                )}
                <RegisterModal
                    show={showRegister}
                    onHide={handleCloseRegister}
                    cookies={cookies}
                    redir={setRedirect}
                />
                <LoginModal
                    show={showLogin}
                    onHide={handleCloseLogin}
                    cookies={cookies}
                    redir={setRedirect}
                />
                <div className="buttonBox">
                    <Button
                        className="indigo rlButton"
                        onClick={handleShowRegister}
                    >
                        Register
                    </Button>
                    <Button
                        className="orange rlButton"
                        onClick={handleShowLogin}
                    >
                        Login
                    </Button>
                </div>
            </div>
        </div>
    );
}

export { Login };
