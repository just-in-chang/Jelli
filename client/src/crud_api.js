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
            let id = -1;
            for (let i = 0; i < r.length; i++) {
                if (r[i].username == username) return r[i].id;
            }
            return id;
        })
        .then((r) => {
            if (r > 0) {
                return error("This username has already been taken");
            } else {
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
            if (r != undefined)
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

const changeCard = (id, title, color, description, category, repos) => {
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
    fetch(url, optionsPUT)
        .then((r) => {
            return r.json();
        })
        .then((r) => repos());
};

const deleteCard = (id, repos) => {
    const optionsDELETE = {
        method: "DELETE",
    };
    let url = CARDS_URL + id + "/";
    return fetch(url, optionsDELETE).then((r) => repos());
};

const newCard = (
    title,
    color,
    description,
    category,
    position,
    method,
    repos
) => {
    if (description == undefined || description.length <= 0) description = "♥";
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
            repos();
            return method(title, color, description, r.id);
        });
};

const deleteCategory = (id, repos) => {
    const optionsDELETE = {
        method: "DELETE",
    };
    let url = CATEGORIES_URL + id + "/";
    return fetch(url, optionsDELETE).then((r) => repos());
};

const newCategory = (title, board, position, method, repos) => {
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
    let url = CATEGORIES_URL;
    fetch(url, optionsPOST)
        .then((r) => {
            return r.json();
        })
        .then((r) => {
            repos();
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

const editCategory = (id, title, boardId, repos) => {
    const optionsPUT = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: title,
            board: boardId,
            cards: [],
        }),
    };

    let url = CATEGORIES_URL + id + "/";
    fetch(url, optionsPUT)
        .then((r) => {
            return r.json();
        })
        .then((r) => repos());
};

const editBoard = (id, title, star, userId) => {
    const optionsPUT = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: title,
            owner: userId,
            star: star,
            categories: [],
        }),
    };

    let url = BOARDS_URL + id + "/";
    fetch(url, optionsPUT).then((r) => {
        return r.json();
    });
};

const updateCardPosition = (id, position) => {
    const optionsGET = {
        method: "GET",
    };
    const optionsPUT = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let url = CARDS_URL + id + "/";
    fetch(url, optionsGET)
        .then((r) => {
            return r.json();
        })
        .then((r) => {
            r.position = position;
            optionsPUT.body = JSON.stringify(r);
            fetch(url, optionsPUT);
        });
};

const updateCategoryPosition = (id, position) => {
    const optionsGET = {
        method: "GET",
    };
    const optionsPUT = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let url = CATEGORIES_URL + id + "/";
    fetch(url, optionsGET)
        .then((r) => {
            return r.json();
        })
        .then((r) => {
            r.position = position;
            r.cards = [];
            optionsPUT.body = JSON.stringify(r);
            fetch(url, optionsPUT);
        });
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
    editCategory,
    editBoard,
    updateCardPosition,
    updateCategoryPosition,
};
