const { remote } = require("webdriverio");
const path = require("path");
const fs = require("fs");

// Cấu hình cơ bản
const apkPath = path.join(__dirname, "ApiDemos-debug.apk");
const capabilities = {
  platformName: "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Android Emulator",
  "appium:app": apkPath,
  "appium:appPackage": "io.appium.android.apis",
  "appium:appActivity": ".ApiDemos",
};
const wdOpts = {
  hostname: "localhost",
  port: 4723,
  logLevel: "info",
  capabilities,
};

// Tiện ích chụp ảnh
function ensureScreenshotDir() {
  const screenshotDir = path.join(__dirname, "screenshots");
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);
  return screenshotDir;
}

async function takeScreenshot(driver, filename) {
  const screenshotDir = ensureScreenshotDir();
  const screenshotPath = path.join(screenshotDir, filename);
  await driver.saveScreenshot(screenshotPath);
  console.log(`📸 Đã chụp ảnh: ${screenshotPath}`);
  return screenshotPath;
}

// Hàm chính chạy toàn bộ kịch bản kiểm thử
async function testBouncingBalls() {
  const driver = await remote(wdOpts);

  try {
    // Mở ứng dụng và điều hướng đến Bouncing Balls
    console.log("🚀 Mở ứng dụng API Demo");
    await driver.pause(2000);

    console.log("🔍 Điều hướng đến Animation > Bouncing Balls");
    await driver.$("~Animation").click();
    await driver.pause(1000);
    await driver.$("~Bouncing Balls").click();
    await driver.pause(3000); // Chờ animation load

    // Lấy kích thước màn hình
    const { width, height } = await driver.getWindowSize();
    console.log(`📱 Kích thước màn hình: ${width}x${height}`);

    // KỊCH BẢN 1: Tap vào 4 góc màn hình
    console.log("\n📌 KỊCH BẢN 1: Tap vào 4 góc màn hình");
    const corners = [
      {
        x: Math.floor(width * 0.2),
        y: Math.floor(height * 0.2),
        name: "goc-tren-trai",
      },
      {
        x: Math.floor(width * 0.8),
        y: Math.floor(height * 0.2),
        name: "goc-tren-phai",
      },
      {
        x: Math.floor(width * 0.2),
        y: Math.floor(height * 0.8),
        name: "goc-duoi-trai",
      },
      {
        x: Math.floor(width * 0.8),
        y: Math.floor(height * 0.8),
        name: "goc-duoi-phai",
      },
    ];

    for (const corner of corners) {
      console.log(`👆 Tap vào ${corner.name}: (${corner.x}, ${corner.y})`);

      await driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: corner.x, y: corner.y },
            { type: "pointerDown", button: 0 },
            { type: "pause", duration: 100 },
            { type: "pointerUp", button: 0 },
          ],
        },
      ]);

      // Chờ bóng rơi và chụp ảnh
      // await driver.pause(2000);
      await takeScreenshot(driver, `balls_${corner.name}.png`);
    }

    // KỊCH BẢN 2: Kéo đường thẳng
    console.log("\n📌 KỊCH BẢN 2: Kéo đường thẳng");

    // Chạm và kéo từ trái sang phải (ngang)
    console.log("➡️ Kéo đường thẳng ngang từ trái qua phải");
    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          // Chạm vào điểm đầu
          {
            type: "pointerMove",
            duration: 0,
            x: Math.floor(width * 0.2),
            y: Math.floor(height * 0.5),
          },
          { type: "pointerDown", button: 0 },
          // Kéo đến điểm cuối
          {
            type: "pointerMove",
            duration: 1000,
            x: Math.floor(width * 0.8),
            y: Math.floor(height * 0.5),
          },
          // Nhấc ngón tay
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);

    await driver.pause(2000);
    await takeScreenshot(driver, "balls_duong_ngang.png");

    // Chạm và kéo từ trên xuống dưới (dọc)
    console.log("⬇️ Kéo đường thẳng dọc từ trên xuống dưới");
    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          // Chạm vào điểm đầu
          {
            type: "pointerMove",
            duration: 0,
            x: Math.floor(width * 0.5),
            y: Math.floor(height * 0.2),
          },
          { type: "pointerDown", button: 0 },
          // Kéo đến điểm cuối
          {
            type: "pointerMove",
            duration: 1000,
            x: Math.floor(width * 0.5),
            y: Math.floor(height * 0.8),
          },
          // Nhấc ngón tay
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);

    // await driver.pause(2000);
    await takeScreenshot(driver, "balls_duong_doc.png");

    // Chạm và kéo đường chéo
    console.log("↘️ Kéo đường chéo từ góc trên trái đến góc dưới phải");
    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          // Chạm vào điểm đầu
          {
            type: "pointerMove",
            duration: 0,
            x: Math.floor(width * 0.2),
            y: Math.floor(height * 0.2),
          },
          { type: "pointerDown", button: 0 },
          // Kéo đến điểm cuối
          {
            type: "pointerMove",
            duration: 1000,
            x: Math.floor(width * 0.8),
            y: Math.floor(height * 0.8),
          },
          // Nhấc ngón tay
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);

    await driver.pause(2000);
    await takeScreenshot(driver, "balls_duong_cheo.png");

    // KỊCH BẢN 3: Vẽ hình tròn
    console.log("\n📌 KỊCH BẢN 3: Vẽ hình tròn");

    // Tính toán các điểm trên đường tròn
    const centerX = Math.floor(width * 0.5);
    const centerY = Math.floor(height * 0.5);
    const radius = Math.floor(Math.min(width, height) * 0.3);
    const points = 16; // Số lượng điểm để tạo hình tròn
    const circlePoints = [];

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const x = Math.floor(centerX + radius * Math.cos(angle));
      const y = Math.floor(centerY + radius * Math.sin(angle));
      circlePoints.push({ x, y });
    }

    // Tạo chuỗi hành động để vẽ hình tròn
    const circleActions = [
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          // Chạm vào điểm đầu tiên
          {
            type: "pointerMove",
            duration: 0,
            x: circlePoints[0].x,
            y: circlePoints[0].y,
          },
          { type: "pointerDown", button: 0 },
        ],
      },
    ];

    // Thêm các điểm còn lại vào chuỗi hành động
    for (let i = 1; i < circlePoints.length; i++) {
      circleActions[0].actions.push({
        type: "pointerMove",
        duration: 50,
        x: circlePoints[i].x,
        y: circlePoints[i].y,
      });
    }

    // Thêm hành động nhấc ngón tay
    circleActions[0].actions.push({ type: "pointerUp", button: 0 });

    console.log("⭕ Vẽ hình tròn quanh tâm màn hình");
    await driver.performActions(circleActions);

    // await driver.pause(2000);
    await takeScreenshot(driver, "balls_hinh_tron.png");

    // KỊCH BẢN 4: Vẽ hình chữ Z
    console.log("\n📌 KỊCH BẢN 4: Vẽ hình chữ Z");
    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          // Điểm đầu tiên (góc trên bên trái)
          {
            type: "pointerMove",
            duration: 0,
            x: Math.floor(width * 0.2),
            y: Math.floor(height * 0.3),
          },
          { type: "pointerDown", button: 0 },
          // Kéo sang phải
          {
            type: "pointerMove",
            duration: 300,
            x: Math.floor(width * 0.8),
            y: Math.floor(height * 0.3),
          },
          // Đường chéo xuống góc dưới bên trái
          {
            type: "pointerMove",
            duration: 300,
            x: Math.floor(width * 0.2),
            y: Math.floor(height * 0.7),
          },
          // Kéo sang phải
          {
            type: "pointerMove",
            duration: 300,
            x: Math.floor(width * 0.8),
            y: Math.floor(height * 0.7),
          },
          // Nhấc ngón tay
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);

    await driver.pause(2000);
    await takeScreenshot(driver, "balls_chu_Z.png");

    // KỊCH BẢN 5: Vẽ hình vuông
    console.log("\n📌 KỊCH BẢN 5: Vẽ hình vuông");
    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          // Điểm đầu tiên (góc trên bên trái)
          {
            type: "pointerMove",
            duration: 0,
            x: Math.floor(width * 0.3),
            y: Math.floor(height * 0.3),
          },
          { type: "pointerDown", button: 0 },
          // Kéo sang phải
          {
            type: "pointerMove",
            duration: 300,
            x: Math.floor(width * 0.7),
            y: Math.floor(height * 0.3),
          },
          // Kéo xuống dưới
          {
            type: "pointerMove",
            duration: 300,
            x: Math.floor(width * 0.7),
            y: Math.floor(height * 0.7),
          },
          // Kéo sang trái
          {
            type: "pointerMove",
            duration: 300,
            x: Math.floor(width * 0.3),
            y: Math.floor(height * 0.7),
          },
          // Kéo lên trên để hoàn thành hình vuông
          {
            type: "pointerMove",
            duration: 300,
            x: Math.floor(width * 0.3),
            y: Math.floor(height * 0.3),
          },
          // Nhấc ngón tay
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);

    // await driver.pause(2000);
    await takeScreenshot(driver, "balls_hinh_vuong.png");

    // KỊCH BẢN 6: Tap nhanh nhiều lần liên tiếp
    console.log("\n📌 KỊCH BẢN 6: Tap nhanh nhiều lần liên tiếp");

    // Reset ứng dụng trước khi thực hiện kịch bản mới
    await driver.back();
    await driver.pause(1000);
    await driver.$("~Bouncing Balls").click();
    await driver.pause(3000);

    // Tap nhiều lần ở các vị trí ngẫu nhiên
    console.log("👇 Tap nhanh nhiều lần để tạo nhiều bóng");
    const tapActions = [];

    for (let i = 0; i < 10; i++) {
      const randomX = Math.floor(width * 0.2 + Math.random() * width * 0.6);
      const randomY = Math.floor(height * 0.2 + Math.random() * height * 0.6);

      tapActions.push({
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: randomX, y: randomY },
          { type: "pointerDown", button: 0 },
          { type: "pause", duration: 50 },
          { type: "pointerUp", button: 0 },
        ],
      });

      // Thực hiện từng tap và chờ một khoảng thời gian ngắn
      await driver.performActions([tapActions[i]]);
      await driver.pause(300);
    }

    await driver.pause(3000);
    await takeScreenshot(driver, "balls_nhieu_bong.png");

    // KỊCH BẢN 7: Vẽ hình zigzag
    console.log("\n📌 KỊCH BẢN 7: Vẽ hình zigzag");

    // Reset ứng dụng trước khi thực hiện kịch bản mới
    await driver.back();
    await driver.pause(1000);
    await driver.$("~Bouncing Balls").click();
    await driver.pause(3000);

    // Tính toán các điểm để vẽ zigzag
    const zigzagPoints = [];
    const steps = 6;
    const startX = Math.floor(width * 0.2);
    const endX = Math.floor(width * 0.8);
    const topY = Math.floor(height * 0.3);
    const bottomY = Math.floor(height * 0.7);
    const stepX = (endX - startX) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = startX + i * stepX;
      const y = i % 2 === 0 ? topY : bottomY;
      zigzagPoints.push({ x, y });
    }

    // Tạo chuỗi hành động để vẽ zigzag
    const zigzagActions = [
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          // Chạm vào điểm đầu tiên
          {
            type: "pointerMove",
            duration: 0,
            x: zigzagPoints[0].x,
            y: zigzagPoints[0].y,
          },
          { type: "pointerDown", button: 0 },
        ],
      },
    ];

    // Thêm các điểm còn lại vào chuỗi hành động
    for (let i = 1; i < zigzagPoints.length; i++) {
      zigzagActions[0].actions.push({
        type: "pointerMove",
        duration: 300,
        x: zigzagPoints[i].x,
        y: zigzagPoints[i].y,
      });
    }

    // Thêm hành động nhấc ngón tay
    zigzagActions[0].actions.push({ type: "pointerUp", button: 0 });

    console.log("〰️ Vẽ hình zigzag");
    await driver.performActions(zigzagActions);

    await driver.pause(3000);
    await takeScreenshot(driver, "balls_zigzag.png");

    console.log("\n🎉 Hoàn thành tất cả các kịch bản kiểm thử Bouncing Balls!");
  } catch (err) {
    console.error("❌ Lỗi trong quá trình kiểm thử:", err);
    console.error(err.stack);
  } finally {
    await driver.deleteSession();
  }
}

// Chạy kịch bản kiểm thử
testBouncingBalls().catch(console.error);
