let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fetch = require("node-fetch");

const HOST_URL_BASE = "http://127.0.0.1:8000/";
const USERS_URL = HOST_URL_BASE + "users/";
const BOARDS_URL = HOST_URL_BASE + "boards/";
const CATEGORIES_URL = HOST_URL_BASE + "categories/";
const CARDS_URL = HOST_URL_BASE + "cards/";

const handleRegister = (username, password, error, success) => {
    const optionsGET = {
        method: "GET",
    };
    const optionsPOST = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
            boards: [],
        }),
    };

    fetch(USERS_URL, optionsGET)
        .then((r) => r.json())
        .then((r) => {
            let id = 0;
            for (let i = 0; i < r.length; i++) {
                id = r[i].id;
                if (r[i].username == username) return r[i].id;
            }
            return id;
        })
        .then((r) => {
            if (r > 0) return error("This username has already been taken");
            else {
                fetch(USERS_URL, optionsPOST);
                error("");
                return success(r);
            }
        });
};

const handleLogin = (username, password, error, success) => {
    const optionsGET = {
        method: "GET",
    };

    fetch(USERS_URL, optionsGET)
        .then((r) => r.json())
        .then((r) => {
            for (let i = 0; i < r.length; i++)
                if (r[i].username == username && r[i].password == password)
                    return r[i].id;
            return -1;
        })
        .then((r) => {
            if (r < 0) error("Username or password incorrect");
            else success(r);
        });
};

const addBoards = (id, star, board) => {
    const optionsGET = {
        method: "GET",
    };
    let url = USERS_URL + id + "/";
    fetch(url, optionsGET)
        .then((r) => r.json())
        .then((r) => {
            return r.boards;
        })
        .then((r) => {
            let stars = [];
            let boards = [];
            for (let i = 0; i < r.length; i++)
                if (r[i].star) stars.push({ name: r[i].name, id: r[i].id });
                else boards.push({ name: r[i].name, id: r[i].id });
            star(stars);
            board(boards);
        });
};

const newBoard = (id, board, star, error, starM, boardsM, cookies) => {
    const optionsGET = {
        method: "GET",
    };
    let url = USERS_URL + id + "/";
    fetch(url, optionsGET)
        .then((r) => r.json())
        .then((r) => {
            for (let i = 0; i < r.boards.length; i++)
                if (r.boards[i].name == board) return -1;
            return r.boards.length;
        })
        .then((r) => {
            if (r < 0) return error("Board name already taken");
            const optionsPOST = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: board,
                    owner: id,
                    position: r,
                    star: star,
                    categories: [],
                }),
            };

            fetch(BOARDS_URL, optionsPOST)
                .then((r) => {
                    if (star) {
                        starM(board);
                        return r.json();
                    } else {
                        boardsM(board);
                        return r.json();
                    }
                })
                .then((r) => cookies.set("board", r.id, { path: "/" }));
        });
};

const getUser = () => {};

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
 * @param {*} id Id of the category
 */
const getCategory = (id) => {
    let http = new XMLHttpRequest();
    let url = CATEGORIES_URL + id + "/";
    http.open("GET", url, false);
    http.send(null);
    return http.responseText;
};

/**
 * Creates a new category
 * @param {*} boardId Category's board's id
 * @param {*} category Name of the new category
 */
const newCategory = (boardId, category) => {
    let http = new XMLHttpRequest();
    let board = getBoard(boardId);
    let doc = {
        name: category,
        board: boardId,
        position: board.categories.length,
        cards: [],
    };
    http.open("POST", CATEGORIES_URL, false);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(doc));
    return http.responseText;
};

/**
 * Changes info of category; use `null` if data not changed
 * @param {*} id Id of category to change
 * @param {*} name New name of category
 * @param {*} position New position of category
 */
const editCategory = (id, name, position) => {
    let http = new XMLHttpRequest();
    let category = getCategory(id);
    let url = CATEGORIES_URL + id + "/";
    if (name != null) category.name = name;
    if (position != null) category.position = position;
    http.open("PUT", url, false);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(category));
    return http.responseText;
};

/**
 * Deletes a category
 * @param {*} id Id of category to delete
 */
const deleteCategory = (id) => {
    let http = new XMLHttpRequest();
    let url = CATEGORIES_URL + id + "/";
    http.open("DELETE", url, false);
    http.send(null);
    return http.responseText;
};

/**
 * Returns JSON with data of card
 * @param {*} id Id of the card
 */
const getCard = (id) => {
    let http = new XMLHttpRequest();
    let url = CARDS_URL + id + "/";
    http.open("GET", url, false);
    http.send(null);
    return http.responseText;
};

/**
 * Creates a new card
 * @param {*} categoryId Card's owner's username
 * @param {*} card Name of the new card
 */
const newCard = (categoryId, card) => {
    let http = new XMLHttpRequest();
    let category = getCategory(categoryId);
    let doc = {
        title: card,
        description: "",
        color: "white",
        category: categoryId,
        position: category.cards.length,
    };
    http.open("POST", CARDS_URL, false);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(doc));
    return http.responseText;
};

/**
 * Changes info of card; use `null` if data not changed
 * @param {*} id Id of card to change
 * @param {*} title New title of card
 * @param {*} description New description of card
 * @param {*} color New color of card
 * @param {*} position New position of card
 */
const editCard = (id, title, description, color, position) => {
    let http = new XMLHttpRequest();
    let card = getCard(id);
    let url = CARDS_URL + id + "/";
    if (title != null) card.title = title;
    if (description != null) card.description = description;
    if (color != null) card.color = color;
    if (position != null) card.position = position;
    http.open("PUT", url, false);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(card));
    return http.responseText;
};

/**
 * Deletes a card
 * @param {*} id Id of card to delete
 */
const deleteCard = (id) => {
    let http = new XMLHttpRequest();
    let url = CARDS_URL + id + "/";
    http.open("DELETE", url, false);
    http.send(null);
    return http.responseText;
};

module.exports = {
    handleRegister,
    handleLogin,
    addBoards,
    newBoard,

    changePassword,
    getBoard,
    editBoard,
    deleteBoard,
    getCategory,
    newCategory,
    editCategory,
    deleteCategory,
    getCard,
    newCard,
    editCard,
    deleteCard,
};
