describe("OrangeHRM E2E Flow", () => {
  const adminUser = "Admin";
  const adminPass = "admin123";

  const empFirst = "Cemong";
  const empLast = "Gembul";
  const empUsername = "Cemong.test123";
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
    cy.contains("Add").click();

    // Pilih User Role
    cy.get("div.oxd-select-wrapper").eq(0).click();        // klik dropdown User Role
    cy.get(".oxd-select-dropdown")
      .contains("ESS")                                   // ganti sesuai role yg mau dipilih
      .click();

    // Pilih Status
    cy.get("div.oxd-select-wrapper").eq(1).click();        // klik dropdown Status
    cy.get(".oxd-select-dropdown")
      .contains("Enabled")                                 // ganti ke "Disabled" kalau mau test case lain
      .click();

    cy.get("input[placeholder='Type for hints...']").type(empFirst);
    cy.get(".oxd-autocomplete-option")
      .contains(empFirst) // cari opsi yang teksnya sesuai
      .click();

    cy.get("input.oxd-input").eq(1).type(empUsername);
    cy.get("input[type='password']").eq(0).type(empPassword);
    cy.get("input[type='password']").eq(1).type(empPassword);
    cy.get("button[type='submit']").click();

    // cy.contains("Successfully Saved", { timeout: 5000 }).should("be.visible");

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
    // Klik submenu Entitlements di topbar
    cy.contains("span.oxd-topbar-body-nav-tab-item", "Entitlements").click();

    // Klik Add Entitlements dari dropdown
    cy.contains("a", "Add Entitlements").click();

    // Input employee name
    cy.get("input[placeholder='Type for hints...']").type(empFirst);

    // Tunggu opsi autocomplete muncul lalu pilih
    cy.get(".oxd-autocomplete-option")
      .contains(empFirst) // cari opsi yang teksnya sesuai
      .click();
    
    // Pilih Leave Type
    cy.get("div.oxd-select-text").eq(0).click();    // buka dropdown Leave Type
    cy.contains(".oxd-select-option", "Vacation")   // pilih opsi Vacation
      .click();


    // Isi Entitlement
    cy.get("input.oxd-input").last().clear().type("10");

    // Input jumlah jatah cuti
    // cy.get("input[type='number']")
    //   .clear()
    //   .type("10");

    // Submit form
    cy.get("button[type='submit']").click();

    // Klik tombol Confirm
    cy.contains("button", "Confirm").click();


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
  // === Login as Employee ===
  cy.get("input[name='username']").type(empUsername);
  cy.get("input[name='password']").type(empPassword);
  cy.get("button[type='submit']").click();

  cy.contains("Leave").click();
  cy.contains("Apply").click();

  // Pilih Leave Type
  cy.get("div.oxd-select-wrapper").eq(0).click();
  cy.contains(".oxd-select-option", "Vacation").click();

  // Isi From Date
  cy.get("input[placeholder='yyyy-dd-mm']").eq(0).clear().type("2025-01-15");

  // Isi To Date
  cy.get("input[placeholder='yyyy-dd-mm']").eq(1).clear().type("2025-01-17");

  // Pilih Partial Days -> All Days
cy.get("div.oxd-select-wrapper").eq(1).click();   // buka dropdown
cy.wait(500); // beri jeda biar opsi render
cy.contains("All Days").click({ force: true });  // pilih opsi

  // Isi Comments
  cy.get("textarea").eq(0).type("Mengajukan cuti penuh untuk liburan.");

  // Klik Apply
  cy.contains("button", "Apply").click();

  // Assertion sukses
  cy.contains("Successfully Saved", { timeout: 5000 }).should("exist");

  // Logout employee
  cy.get(".oxd-userdropdown").click();
  cy.contains("Logout").click();

  // === Login as Admin ===
  cy.get("input[name='username']").type(adminUser);
  cy.get("input[name='password']").type(adminPass);
  cy.get("button[type='submit']").click();

  cy.contains("Leave").click();
  cy.contains("Leave List").click();

  // Cari leave employee
  cy.get("button[type='submit']").click(); // klik Search
  cy.contains(empFirst).click(); // buka leave employee

  // Approve leave
  cy.contains("Approve").click();
  cy.contains("Approved", { timeout: 5000 }).should("exist");

  // Logout admin
  cy.get(".oxd-userdropdown").click();
  cy.contains("Logout").click();

  // === Re-login as Employee ===
  cy.get("input[name='username']").type(empUsername);
  cy.get("input[name='password']").type(empPassword);
  cy.get("button[type='submit']").click();

  cy.contains("Leave").click();
  cy.contains("My Leave").click();

  // Pastikan status approved muncul
  cy.contains("Approved").should("exist");
});

});
