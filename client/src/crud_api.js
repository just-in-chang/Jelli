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
                    if (r[i].star)
                        stars.splice(r[i].position, 0, {
                            name: r[i].name,
                            id: r[i].id,
                        });
                    else
                        boards.splice(r[i].position, 0, {
                            name: r[i].name,
                            id: r[i].id,
                        });
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
                    return r.json();
                })
                .then((r) => {
                    cookies.set("board", r.id, { path: "/" });
                    if (star) starM(board, r.id);
                    else boardsM(board, r.id);
                });
        });
};

const getCategories = (boardId, setCategories, setLoading) => {
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
            if (categoryList != undefined) {
                categoryList.sort((a, b) => {
                    let x = a["position"];
                    let y = b["position"];
                    return x < y ? -1 : x > y ? 1 : 0;
                });
                setCategories(categoryList);
            }
            setLoading(false);
        });
};

const getCards = (categoryId, setCards, setLoading) => {
    const optionsGET = {
        method: "GET",
    };
    let url = CATEGORIES_URL + categoryId + "/";
    fetch(url, optionsGET)
        .then((r) => {
            return r.json();
        })
        .then((r) => {
            let cards = r.cards;
            if (cards != undefined) {
                cards.sort((a, b) => {
                    let x = a["position"];
                    let y = b["position"];
                    return x < y ? -1 : x > y ? 1 : 0;
                });
                setCards(r.cards);
            }
            setLoading(false);
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

const updateBoardPosition = (id, position) => {
    const optionsGET = {
        method: "GET",
    };
    const optionsPUT = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let url = BOARDS_URL + id + "/";
    fetch(url, optionsGET)
        .then((r) => {
            return r.json();
        })
        .then((r) => {
            r.position = position;
            r.categories = [];
            optionsPUT.body = JSON.stringify(r);
            fetch(url, optionsPUT);
        });
};

const changeCardCategory = (id, newCategoryId) => {
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
            r.category = newCategoryId;
            optionsPUT.body = JSON.stringify(r);
            return fetch(url, optionsPUT);
        });
};

const calculatePositions = () => {
    let categories = document.querySelectorAll(".container");
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i];
        let categoryId = category.getAttribute("id");
        let buttons = category.querySelectorAll(".fitCategory");
        for (let j = 0; j < buttons.length; j++) {
            let buttonId = buttons[j].getAttribute("id");
            updateCardPosition(buttonId, j);
        }
        updateCategoryPosition(categoryId, i);
    }
};

const toColor = (char) => {
    switch (char) {
        case "r":
            return "Red";
        case "o":
            return "Orange";
        case "y":
            return "Yellow";
        case "g":
            return "Green";
        case "b":
            return "Blue";
        case "i":
            return "Indigo";
        case "v":
            return "Violet";
    }
};

const calculatePositions2 = () => {
    let boards = document.querySelectorAll(".backgroundU");
    for (let i = 0; i < boards.length; i++) {
        let boardGroup = boards[i];
        let board = boardGroup.querySelectorAll(".green");
        for (let j = 0; j < board.length; j++) {
            let boardId = board[j].getAttribute("id");
            updateBoardPosition(boardId, j);
        }
    }
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
    changeCardCategory,
    calculatePositions,
    toColor,
    calculatePositions2,
};
