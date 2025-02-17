const hre = require("hardhat");

async function main() {
    console.log("🚀 배포 시작...");

    // ✅ RedDiceToken 배포
    const RedDice = await hre.ethers.getContractFactory("RedDiceToken");  // 🔴 Red Dice
    const redDice = await RedDice.deploy();  // <-- 🔥 deploy() 호출
    await redDice.waitForDeployment(); // <-- 🔥 변경된 부분
    console.log(`✅ Red Dice Token 배포 완료! 주소: ${await redDice.getAddress()}`);

    // ✅ BlueDiceToken 배포
    const BlueDice = await hre.ethers.getContractFactory("BlueDiceToken"); // 🔵 Blue Dice
    const blueDice = await BlueDice.deploy();  // <-- 🔥 deploy() 호출
    await blueDice.waitForDeployment(); // <-- 🔥 변경된 부분
    console.log(`✅ Blue Dice Token 배포 완료! 주소: ${await blueDice.getAddress()}`);
}

// 실행
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error("❌ 배포 오류:", error);
        process.exit(1);
    });
