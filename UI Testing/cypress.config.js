const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com/web/index.php",
    defaultCommandTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 800
  }
});
