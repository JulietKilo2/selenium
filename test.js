const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const run = async () => {
  // 1. chromedriver 경로 설정
  // chromedriver가 있는 경로를 입력
  const service = new chrome.ServiceBuilder("./chromedriver").build();
  chrome.setDefaultService(service);

  // 2. chrome 브라우저 빌드
  const driver = await new webdriver.Builder().forBrowser("chrome").build();

  // 3. google 사이트 열기
  await driver.get("http://localhost:8080/");

  // 4. 3초 후에 브라우저 종료
  setTimeout(async () => {
    await driver.quit();
    process.exit(0);
  }, 3000);
};
run();
