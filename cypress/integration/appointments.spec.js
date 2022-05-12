describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");

    cy.visit("/");

    cy.contains("Monday");
  })

  it ("should book an interview", () => {
    cy.get("[alt=Add]")
      .first()
      .click();

    cy.get("[data-testid=student-name-input]")
      .type("Lydia Miller-Jones", { delay: 100 });
    cy.get("[alt='Sylvia Palmer']")
      .click();
    cy.contains("button", "Save")
      .click();

    cy.contains("[data-testid=appointment]", "Lydia Miller-Jones").contains("Sylvia Palmer");
  });

  it ("should edit an interview", () => {
    cy.get("[alt=Edit]")
      .first().as("editBtn");
    cy.get("@editBtn").click({ force: true });

    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Lydia Miller-Jones", { delay: 100 });
    cy.get("[alt='Tori Malcolm']")
      .click();
    cy.contains("button", "Save")
      .click();

    cy.contains("[data-testid=appointment]", "Lydia Miller-Jones").contains("Tori Malcolm");
  });

  it ("should cancel an interview", () => {
    cy.get("[alt=Delete]")
      .first().as("deleteBtn");
    cy.get("@deleteBtn").click({ force: true });

    cy.contains("button", "Confirm")
      .click();

    cy.contains("Deleting");
    cy.contains("Deleting").should("not.exist");

    cy.contains("[data-testid=appointment]", "Archie Cohen").should("not.exist");
  });
});