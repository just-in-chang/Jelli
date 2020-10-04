describe("Login Page", () => {
    beforeEach(() => cy.visit("http://localhost:3000"));

    it("test login button and modal", () => {
        cy.get(".orange").should("have.class", "rlButton").click();
        let inputs = cy.get("input");
        inputs.should("have.length", 2);
        inputs.get('[name="username"]').type("test");
        inputs.get('[name="password"]').type("test");
        cy.get('[type="submit"]').click();
    });

    it("test register button and modal", () => {
        cy.get(".indigo").should("have.class", "rlButton").click();
        let inputs = cy.get("input");
        inputs.should("have.length", 3);
        inputs.get('[name="username"]').type("test");
        inputs.get('[name="password"]').type("test");
        inputs.get('[name="passwordConfirm"]').type("test");
        cy.get('[type="submit"]').click();
    });
});

describe("User Page", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000");
        cy.get(".orange").should("have.class", "rlButton").click();
        let inputs = cy.get("input");
        inputs.get('[name="username"]').type("test");
        inputs.get('[name="password"]').type("test");
        cy.get('[type="submit"]').click();
    });

    it("test add board", () => {
        cy.get(".addButton").click();
        let form = cy.get("form");
        form.get('[name="title"]').type("test");
        form.get('[name="star"]').click();
        form.get('[type="submit"]').click();
    });
});

describe("Board Page", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000");
        cy.get(".orange").should("have.class", "rlButton").click();
        let inputs = cy.get("input");
        inputs.get('[name="username"]').type("test");
        inputs.get('[name="password"]').type("test");
        cy.get('[type="submit"]').click();
        cy.get(".green").click();
    });

    it("test edit board", () => {
        cy.get(".editButton").click();
        let form = cy.get("form");
        form.get('[name="title"]').type("put");
        cy.get(".close").click();
    });

    it("test add category", () => {
        cy.get(".addButton").click();
        let form = cy.get("form");
        form.get('[name="title"]').type("test");
        form.get('[type="submit"]').click();
    });

    it("test edit category", () => {
        let container = cy.get(".container");
        container.find(".editButton").click();
        cy.get("form").get('[name="title"]').type("put");
        cy.get(".close").click();
    });

    it("test add card", () => {
        let container = cy.get(".container");
        container.find(".addButton").click();
        let form = cy.get("form");
        form.get('[name="title"]').type("test");
        form.get('[name="description"]').filter(":visible").type("test");
        form.get('[type="submit"]').click();
    });

    it("test edit button", () => {
        cy.get(".fitCategory").click();
        let form = cy.get("form");
        form.get('[name="title"]').type("put");
        form.get('[type="submit"]').click();
    });

    it("test button drag", () => {
        cy.get(".addButton").click();
        let form = cy.get("form");
        form.get('[name="title"]').type("test2");
        form.get('[type="submit"]').click();
        cy.get(".fitCategory").trigger("mousedown", { button: 0 });
        cy.wait(1000);
        cy.get(".categoryBody")
            .eq(1)
            .trigger("mousemove")
            .click({ force: true });
        cy.wait(1000);
    });

    it("test delete button", () => {
        cy.get(".fitCategory").click();
        let form = cy.get("form");
        form.get(".btn-danger").click();
    });

    it("test delete category", () => {
        let container = cy.get(".container").eq(0);
        container.find(".deleteButton").click();
    });

    it("test delete board", () => {
        cy.get(".deleteButton").click();
        cy.get('[type="submit"]').click();
    });
});
