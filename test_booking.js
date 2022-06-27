const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const { Builder, By, Key, until } = webdriver;
require("dotenv").config();

const logger = (log) => {
  testLog += `\n${log}`;
  return;
};

let testLog = `log starts at: ${Date()}`;
const localHost = "http://localhost:8080/";
const email = process.env.MY_EMAIL;
const pw = process.env.MY_PW;

const run = async () => {
  // 1. chromedriver 경로 설정
  // chromedriver가 있는 경로를 입력
  const service = new chrome.ServiceBuilder("./chromedriver").build();
  chrome.setDefaultService(service);

  // 2. chrome 브라우저 빌드
  const driver = await new webdriver.Builder().forBrowser("chrome").build();

  // 3. localHost 창 열기
  await driver.get(localHost);
  logger(`Opening up the page ${localHost}`);

  try {
    // 4. deals page
    logger("redirect to deals page");
    await driver.get(localHost + "/deals");
    logger("success");
    // 5. click on deal item
    logger("click on deals item");
    await driver.wait(until.elementLocated(By.css("#dealsItem-0"))).click();
    logger("success");
    // 6. click on refund policy
    logger("click on refundsPolicy");
    await driver
      .wait(until.elementLocated(By.css("#dealsDetail-refundpolicy-0")))
      .click();
    // 7. login (manual)
    logger("Logging in");
    await driver.wait(until.elementLocated(By.name("email"))).sendKeys(email);
    await driver
      .wait(until.elementLocated(By.name("password")))
      .sendKeys(pw, Key.ENTER);
    // 8. click on refund policy again (after logging in)
    logger("click on refundsPolicy (2nd time)");
    await driver
      .wait(until.elementLocated(By.css("#dealsDetail-refundpolicy-0")))
      .click();
    // 9. pick a date and continue
    logger("click on date input");
    await driver
      .wait(until.elementLocated(By.css("#date")))
      .sendKeys(Date(), Key.ENTER);
    logger("click on continue button");
    await driver
      .wait(until.elementLocated(By.css("#booking-continue-btn")))
      .click();
    // 10. fill out / change other inputs and submit
    logger("submit the form");
    await driver
      .wait(until.elementLocated(By.css("#booking-userInfo-continue-btn")))
      .click();
    logger("booking test complete");
  } catch (error) {
    logger(`error: ${error}`);

    await driver.quit();
    process.exit(0);
  }

  // booking page, make a reservation.

  // finishing up
  fs.writeFile("test_logs.txt", testLog, (err) => {
    console.log(testLog);
    if (err) {
      console.error(err);
    }
  });
};

run();
