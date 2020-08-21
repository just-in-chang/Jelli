let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const HOST_URL_BASE = "http://127.0.0.1:8000/";
const USERS_URL = HOST_URL_BASE + "users/";
const BOARDS_URL = HOST_URL_BASE + "boards/";
const CATEGORIES_URL = HOST_URL_BASE + "categories/";
const CARDS_URL = HOST_URL_BASE + "cards/";

const getUser = (username) => {
    let http = new XMLHttpRequest();
    http.open("GET", USERS_URL, false);
    http.send(null);
    let users = JSON.parse(http.responseText);
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username) return users[i];
    }
    return null;
};

const newUser = (username, password) => {
    if (getUser(username) != null) return "Username already taken!";
    let http = new XMLHttpRequest();
    let doc = { username: username, password: password, boards: [] };
    http.open("POST", USERS_URL, false);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(doc));
    return JSON.parse(http.responseText);
};

const changePassword = (username, password, newPassword) => {
    let http = new XMLHttpRequest();
    let doc = getUser(username);
    let boards = [];
    for (let i = 0; i < doc.boards.length; i++) {
        boards.push(doc.boards[i].id);
        delete doc.boards[i].id;
    }
    let url = USERS_URL + doc.id + "/";
    if (doc.password == password) {
        doc.password = newPassword;
        doc.boards = [];
        http.open("PUT", url, false);
        http.setRequestHeader("Content-Type", "application/json");
        http.send(JSON.stringify(doc));
        return http.responseText;
    }
    return "Password Incorrect.";
};

console.log(newUser("g", "f"));
