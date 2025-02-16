const hre = require("hardhat");

async function main() {
  console.log("🚀 배포 시작...");

  // ✅ RedDiceToken 배포
  const RedDiceToken = await hre.ethers.getContractFactory("RedDiceToken");
  const redDice = await RedDiceToken.deploy(); // ✅ 올바른 배포 호출
  await redDice.waitForDeployment(); // ✅ `deployed()` 대신 `waitForDeployment()` 사용
  console.log(`✅ Red Dice Token 배포 완료! 주소: ${redDice.target}`);

  // ✅ BlueDiceToken 배포
  const BlueDiceToken = await hre.ethers.getContractFactory("BlueDiceToken");
  const blueDice = await BlueDiceToken.deploy(); // ✅ 올바른 배포 호출
  await blueDice.waitForDeployment(); // ✅ `deployed()` 대신 `waitForDeployment()` 사용
  console.log(`✅ Blue Dice Token 배포 완료! 주소: ${blueDice.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 배포 오류:", error);
    process.exit(1);
  });
