let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const HOST_URL_BASE = "http://127.0.0.1:8000/";
const USERS_URL = HOST_URL_BASE + "users/";
const BOARDS_URL = HOST_URL_BASE + "boards/";
const CATEGORIES_URL = HOST_URL_BASE + "categories/";
const CARDS_URL = HOST_URL_BASE + "cards/";

/**
 * Returns JSON with data of user
 * @param {*} username Usesrname of user
 */
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

/**
 * Creates a new user
 * @param {*} username New user's username
 * @param {*} password New user's password
 */
const newUser = (username, password) => {
    if (getUser(username) != null) return "Username already taken!";
    let http = new XMLHttpRequest();
    let doc = { username: username, password: password, boards: [] };
    http.open("POST", USERS_URL, false);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(doc));
    return JSON.parse(http.responseText);
};

/**
 * Changes user's password
 * @param {*} username User's username
 * @param {*} password User's old password
 * @param {*} newPassword User's new password
 */
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

/**
 * Returns JSON with data of board
 * @param {*} id Id of the board
 */
const getBoard = (id) => {
    let http = new XMLHttpRequest();
    let url = BOARDS_URL + id + "/";
    http.open("GET", url, false);
    http.send(null);
    return http.responseText;
};

/**
 * Creates a new board
 * @param {*} username Board's owner's username
 * @param {*} board Name of the new board
 */
const newBoard = (username, board) => {
    let http = new XMLHttpRequest();
    let user = getUser(username);
    let userId = user.id;
    let doc = {
        name: board,
        owner: userId,
        position: user.boards.length,
        star: false,
        categories: [],
    };
    http.open("POST", BOARDS_URL, false);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(doc));
    return http.responseText;
};

/**
 * Changes info of board; use `null` if data not changed
 * @param {*} id Id of board to change
 * @param {*} name New name of board
 * @param {*} position New position of board
 * @param {*} star `true` if the board starred
 */
const editBoard = (id, name, position, star) => {
    let http = new XMLHttpRequest();
    let board = getBoard(id);
    let url = BOARDS_URL + id + "/";
    if (name != null) board.name = name;
    if (position != null) board.position = position;
    if (star != null) board.star = star;
    http.open("PUT", url, false);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(board));
    return http.responseText;
};

/**
 * Deletes a board
 * @param {*} id Id of board to delete
 */
const deleteBoard = (id) => {
    let http = new XMLHttpRequest();
    let url = BOARDS_URL + id + "/";
    http.open("DELETE", url, false);
    http.send(null);
    return http.responseText;
};

/**
 * Returns JSON with data of category
 * @param {*} id Id of the board
 */
const getCategory = (id) => {
    let http = new XMLHttpRequest();
    let url = CATEGORIES_URL + id + "/";
    http.open("GET", url, false);
    http.send(null);
    return http.responseText;
};

/**
 * Returns JSON with data of card
 * @param {*} id Id of the board
 */
const getCard = (id) => {
    let http = new XMLHttpRequest();
    let url = CARDS_URL + id + "/";
    http.open("GET", url, false);
    http.send(null);
    return http.responseText;
};

console.log(deleteBoard(3));

module.exports = {
    getUser,
    newUser,
    changePassword,
    getBoard,
    newBoard,
    editBoard,
    deleteBoard,
};
