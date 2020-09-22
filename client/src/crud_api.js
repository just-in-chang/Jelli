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

const getCategories = (boardId, addCategory) => {
    const optionsGET = {
        method: "GET",
    };
    let url = BOARDS_URL + boardId + "/";
    fetch(url, optionsGET)
        .then((r) => {
            return r.json();
        })
        .then((r) => {
            let categoryList = r.categories;
            let names = [];
            let ids = [];
            for (let i = 0; i < categoryList.length; i++) {
                names.push(categoryList[i].name);
                ids.push(categoryList[i].id);
            }
            addCategory(names, ids);
        });
};

const getCards = (categoryId, addCard) => {
    const optionsGET = {
        method: "GET",
    };
    let url = CATEGORIES_URL + categoryId + "/";
    fetch(url, optionsGET)
        .then((r) => {
            return r.json();
        })
        .then((r) => {
            let cardList = r.cards;
            let names = [];
            let ids = [];
            let colors = [];
            let descriptions = [];
            if (cardList != undefined)
                for (let i = 0; i < cardList.length; i++) {
                    names.push(cardList[i].title);
                    ids.push(cardList[i].id);
                    colors.push(cardList[i].color);
                    descriptions.push(cardList[i].description);
                }
            addCard(names, ids, colors, descriptions);
        });
};

const getBoardName = (id, setB) => {
    const optionsGET = {
        method: "GET",
    };
    let url = BOARDS_URL + id + "/";
    fetch(url, optionsGET)
        .then((r) => {
            return r.json();
        })
        .then((r) => {
            return setB(r.name);
        });
};

const changeCard = (id, title, color, description, category) => {
    const optionsPUT = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            description: description,
            color: color,
            category: category,
        }),
    };
    let url = CARDS_URL + id + "/";
    fetch(url, optionsPUT).then((r) => {
        return r.json();
    });
};

const deleteCard = (id) => {
    const optionsDELETE = {
        method: "DELETE",
    };
    let url = CARDS_URL + id + "/";
    return fetch(url, optionsDELETE);
};

const newCard = (title, color, description, category, position, method) => {
    const optionsPOST = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            description: description,
            color: color,
            category: category,
            position: position,
        }),
    };
    let url = CARDS_URL;
    fetch(url, optionsPOST)
        .then((r) => {
            return r.json();
        })
        .then((r) => {
            return method(title, color, description, r.id);
        });
};

const deleteCategory = (id) => {
    const optionsDELETE = {
        method: "DELETE",
    };
    let url = CATEGORIES_URL + id + "/";
    return fetch(url, optionsDELETE);
};

const newCategory = (title, board, position, method) => {
    const optionsPOST = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: title,
            board: board,
            position: position,
            cards: [],
        }),
    };
    console.log(optionsPOST.body);
    let url = CATEGORIES_URL;
    fetch(url, optionsPOST)
        .then((r) => {
            return r.json();
        })
        .then((r) => {
            return method(title, r.id);
        });
};

const deleteBoard = (id) => {
    const optionsDELETE = {
        method: "DELETE",
    };
    let url = BOARDS_URL + id + "/";
    return fetch(url, optionsDELETE);
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

module.exports = {
    handleRegister,
    handleLogin,
    addBoards,
    newBoard,
    getCategories,
    getCards,
    getBoardName,
    changeCard,
    deleteCard,
    newCard,
    deleteCategory,
    newCategory,
    deleteBoard,

    changePassword,
    getBoard,
    editBoard,
    getCategory,
    editCategory,
    getCard,
    editCard,
};
