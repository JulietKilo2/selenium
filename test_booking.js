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
const email = process.env.CH_HELPER_EMAIL;
const pw = process.env.CH_HELPER_PW;

const run = async () => {
  // 1. chromedriver 경로 설정
  // chromedriver가 있는 경로를 입력
  const service = new chrome.ServiceBuilder("./chromedriver").build();
  chrome.setDefaultService(service);

  // 2. chrome 브라우저 빌드
  const driver = await new webdriver.Builder().forBrowser("chrome").build();

  // 3. localHost
  await driver.get(localHost);
  logger(`Opening up the page ${localHost}`);

  // 4. deals page
  try {
    logger("redirect to deals page");
    await driver.get(localHost + "/deals");
    logger("success");
  } catch (error) {
    logger(`error: ${error}`);
    // await driver.quit();
    // process.exit(0);
  }

  // 5. click on deal item
  try {
    logger("Click on deals item");
    await driver.wait(until.elementLocated(By.css("#dealsItem-1"))).click();
    logger("success");
  } catch (error) {
    logger(`error: ${error}`);
    // await driver.quit();
    // process.exit(0);
  }

  // 6. click on refund policy
  try {
    logger("Click on refundsPolicy");
    await driver
      .wait(until.elementLocated(By.css("#dealsDetail-refundpolicy-0")))
      .click();
  } catch (error) {
    logger(`error: ${error}`);
    // await driver.quit();
    // process.exit(0);
  }

  // sign-in page
  // 7. email & pw

  // 7.1 manual login
  try {
    logger("Logging in");
    await driver.wait(until.elementLocated(By.name("email"))).sendKeys(email);
    await driver
      .wait(until.elementLocated(By.name("password")))
      .sendKeys(pw, Key.ENTER);
  } catch (error) {
    logger(`error: ${error}`);
    await driver.quit();
    process.exit(0);
  }

  // 7.2 google login
  //! google does not let automated tools to access the log in modal/page.
  //! find a workaround.
  // try {
  //   logger("logging in via google");
  //   await driver.wait(until.elementLocated(By.id("signin-apple"))).click();
  // const google = await driver.wait(
  //   until.elementLocated(By.css("#signin-google"))
  // );

  // await driver
  //   .findElement({ id: "google" })
  //   .then((element) => element.click())
  //   .catch((err) => console.log("nope", err));
  // } catch (error) {
  //   logger(`error: ${error}`);
  //   console.log({ error });
  // }

  // 8. click on refund policy again (after logging in)
  try {
    logger("Click on refundsPolicy (2nd time)");
    await driver
      .wait(until.elementLocated(By.css("#dealsDetail-refundpolicy-0")))
      .click();
  } catch (error) {
    logger(`error: ${error}`);
    // await driver.quit();
    // process.exit(0);
  }

  // booking page, make a reservation.
  // 9. pick a date and continue
  try {
    logger("Click on date input");
    await driver
      .wait(until.elementLocated(By.css("#date")))
      .sendKeys(Date(), Key.ENTER);
    logger("Click on continue button");
    await driver
      .wait(until.elementLocated(By.css("#booking-continue-btn")))
      .click();
  } catch (error) {
    logger(`error: ${error}`);
  }

  // 10. fill out / change other inputs and submit
  try {
    logger("submit the form");
    await driver
      .wait(until.elementLocated(By.css("#booking-userInfo-continue-btn")))
      .click();
    logger("booking test complete");
  } catch (error) {
    logger(`error: ${error}`);
  }

  // finishing up
  fs.writeFile("test_logs.txt", testLog, (err) => {
    console.log(testLog);
    if (err) {
      console.error(err);
    }
    // file written successfully
  });

  // await setTimeout(async () => {
  //   await driver.quit();
  //   process.exit(0);
  // }, 2000);
};

run();
