import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Cookies from "universal-cookie";
import { Board } from "./pages/Board";
import { Login } from "./pages/Login";
import { User } from "./pages/User";

const cookies = new Cookies();

function App() {
    return (
        <Router>
            <Route
                exact
                path="/"
                component={() => <Login cookies={cookies} />}
            />
            <Route
                path="/board"
                component={() => <Board cookies={cookies} />}
            />
            <Route path="/user" component={() => <User cookies={cookies} />} />
        </Router>
    );
}

export { App };
