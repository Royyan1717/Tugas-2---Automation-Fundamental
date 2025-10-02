describe("OrangeHRM E2E Flow", () => {
  const adminUser = "Admin";
  const adminPass = "admin123";

  const empFirst = "Cemong";
  const empLast = "Gembul";
  const empName = "Cemong Gembul";
  const empUsername = "Cemong.test";
  const empPassword = "Test123!";

  beforeEach(() => {
    cy.visit("/auth/login");
  });

  // 1. Tambah Karyawan Baru
  it("Should add new employee (positive case)", () => {
    cy.get("input[name='username']").type(adminUser);
    cy.get("input[name='password']").type(adminPass);
    cy.get("button[type='submit']").click();

    // go to PIM > Add Employee
    cy.contains("PIM").click();
    cy.contains("Add Employee").click();

    cy.get("input[name='firstName']").type(empFirst);
    cy.get("input[name='lastName']").type(empLast);

    cy.get("button[type='submit']").click();

    // go to Admin > Add User
    cy.contains("Admin").click();
    cy.contains("Add User").click();

    cy.get("input[placeholder='Type for hints...']").type(empFirst);
    cy.get(".oxd-autocomplete-option").first().click();

    cy.get("input[name='employeename']").type(empName);
    cy.get("input[name='username']").type(empUsername);
    cy.get("input[type='password']").eq(0).type(empPassword);
    cy.get("input[type='password']").eq(1).type(empPassword);
    cy.get("button[type='submit']").click();

    cy.contains("Successfully Saved", { timeout: 5000 }).should("be.visible");

    // Assertion: employee added
    cy.contains(empFirst).should("exist");
  });

  it("Should not add employee with missing firstname (negative case)", () => {
    cy.get("input[name='username']").type(adminUser);
    cy.get("input[name='password']").type(adminPass);
    cy.get("button[type='submit']").click();

    cy.contains("PIM").click();
    cy.contains("Add Employee").click();

    cy.get("input[name='lastName']").type(empLast);
    cy.get("button[type='submit']").click();

    // Assertion: error validation muncul
    cy.contains("Required").should("exist");
  });

  // 2. Tambah jatah cuti
  it("Should assign leave entitlement (positive case)", () => {
    // Login
    cy.get("input[name='username']").type(adminUser);
    cy.get("input[name='password']").type(adminPass);
    cy.get("button[type='submit']").click();

    // Navigasi ke menu Add Entitlements
    cy.contains("a", "Leave").click();
    cy.contains("a", "Entitlements").click();
    cy.contains("a", "Add Entitlements").click();

    // Input employee name
    cy.get("input[placeholder='Type for hints...']")
      .type(empFirst);

    // Tunggu opsi autocomplete muncul lalu pilih
    cy.get(".oxd-autocomplete-option")
      .should("be.visible")
      .first()
      .click();

    // Input jumlah jatah cuti
    cy.get("input[type='number']")
      .clear()
      .type("10");

    // Submit form
    cy.get("button[type='submit']").click();

    // Assertion dengan timeout
    cy.contains("Successfully Saved", { timeout: 5000 })
      .should("be.visible");
  });


  it("Should not assign leave entitlement with empty value (negative case)", () => {
    cy.get("input[name='username']").type(adminUser);
    cy.get("input[name='password']").type(adminPass);
    cy.get("button[type='submit']").click();

    cy.contains("Leave").click();
    cy.contains("Entitlements").click();
    cy.contains("Add Entitlements").click();

    cy.get("button[type='submit']").click();

    cy.contains("Required").should("exist");
  });

  // 3. Karyawan request cuti
  it("Employee request leave and admin approve", () => {
    // Login as employee
    cy.get("input[name='username']").type(empUsername);
    cy.get("input[name='password']").type(empPassword);
    cy.get("button[type='submit']").click();

    cy.contains("Leave").click();
    cy.contains("Apply").click();
    cy.get("input[placeholder='yyyy-mm-dd']").first().type("2025-10-10");
    cy.get("input[placeholder='yyyy-mm-dd']").last().type("2025-10-12");
    cy.get("button[type='submit']").click();

    // Assertion
    cy.contains("Successfully Saved").should("exist");

    // Logout
    cy.get(".oxd-userdropdown").click();
    cy.contains("Logout").click();

    // Login as admin
    cy.get("input[name='username']").type(adminUser);
    cy.get("input[name='password']").type(adminPass);
    cy.get("button[type='submit']").click();

    cy.contains("Leave").click();
    cy.contains("Leave List").click();
    cy.get("button[type='submit']").click(); // search leave
    cy.contains(empFirst).click();

    // Approve
    cy.contains("Approve").click();
    cy.contains("Approved").should("exist");

    // Logout and re-login as employee
    cy.get(".oxd-userdropdown").click();
    cy.contains("Logout").click();

    cy.get("input[name='username']").type(empUsername);
    cy.get("input[name='password']").type(empPassword);
    cy.get("button[type='submit']").click();

    cy.contains("Leave").click();
    cy.contains("My Leave").click();

    cy.contains("Approved").should("exist");
  });
});
