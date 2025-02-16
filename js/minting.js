const contractAddress = "0x30c96c62a165769B1F6061a37cafBaE80D491513";
const PINATA_JWT = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiNTk2Y2MyYS01NDY2LTQyNGItYjRlMC03OTVkMTIzNGI5ODAiLCJlbWFpbCI6Im9tajk5MDhAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjhmNDJiOGI4ZjE3MDFkOGM2ZGVhIiwic2NvcGVkS2V5U2VjcmV0IjoiNWM3MjE5ZDJmN2U5MzA3MTFlYTA0NjQyNDM3OTBhZTU5MThmZTU4NDY4MGUxNGNmMmI5OWJkZmNiMGI5YTllMCIsImV4cCI6MTc3MDM1MzkwM30.qCRw21knqdTqWg6rTb3_ujnnOyl-Wz0FpOLoV7BN2B0"; // Pinata JWT (환경 변수 사용 권장)
const redDiceTokenAddress = "0x7C41d6F3b713023cB4DB6e1b0252d363A5f20190"; // ✅ Red Dice 배포 주소
const blueDiceTokenAddress = "0x5B57746983FFC7b8c9F2dDe55d32551C0D5f3c12"; // ✅ Blue Dice 배포 주소


const contractABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "string", "name": "nftTokenURI", "type": "string" },
      { "internalType": "string", "name": "tokenName", "type": "string" }
    ],
    "name": "mintNFT",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "getNFTInfo",
    "outputs": [
      { "internalType": "string", "name": "tokenURI", "type": "string" },
      { "internalType": "string", "name": "tokenName", "type": "string" },
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "burnNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "getOwnedNFTs",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const diceTokenABI = [
  {
      "inputs": [
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "mintRedDice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "mintBlueDice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "getOwner",  // ✅ 추가된 getOwner 함수
      "outputs": [
          { "internalType": "address", "name": "", "type": "address" }
      ],
      "stateMutability": "view",
      "type": "function"
  }
];


let web3;
let redDiceToken;
let blueDiceToken;

let nftContract;
let currentAccount = null;

async function connectWallet() {
  if (!window.ethereum) {
      alert("❌ MetaMask가 설치되지 않았습니다.");
      return null;
  }

  try {
      console.log("📌 MetaMask 로그인 요청...");
      web3 = new Web3(window.ethereum);

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

      if (!accounts || accounts.length === 0) {
          alert("❌ MetaMask 계정이 연결되지 않았습니다.");
          return null;
      }

      currentAccount = accounts[0];

      nftContract = new web3.eth.Contract(contractABI, contractAddress);

      // ✅ Red Dice & Blue Dice 토큰 컨트랙트 인스턴스 생성
      redDiceToken = new web3.eth.Contract(diceTokenABI, redDiceTokenAddress);
      blueDiceToken = new web3.eth.Contract(diceTokenABI, blueDiceTokenAddress);

      console.log(`✅ MetaMask 연결 완료! 선택된 계정: ${currentAccount}`);
      console.log("🔴 Red Dice Contract:", redDiceToken);
      console.log("🔵 Blue Dice Contract:", blueDiceToken);

      return currentAccount;
  } catch (error) {
      console.error("❌ MetaMask 연결 오류:", error);
      return null;
  }
}


if (window.ethereum) {
  window.ethereum.on("accountsChanged", async function (newAccounts) {
    if (!newAccounts || newAccounts.length === 0) {
      alert("❌ MetaMask에서 로그아웃되었습니다.");
      return;
    }

    console.log("🔄 MetaMask 계정 변경 감지:", newAccounts[0]);
    currentAccount = newAccounts[0];

    // UI 업데이트
    document.getElementById("currentAccount").innerText = `현재 계정: ${currentAccount}`;
  });
}

async function uploadToIPFSWithMetadata(file, name, description) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    console.log("📌 [Debug] IPFS 이미지 업로드 시작...");

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: { "Authorization": PINATA_JWT },
      body: formData
    });

    console.log("✅ [Debug] IPFS 응답 수신 완료!");

    const data = await response.json();
    console.log("📌 [Debug] IPFS 응답 데이터:", data);

    if (!data || !data.IpfsHash) {
      throw new Error("❌ IPFS 업로드 실패: 응답에서 IpfsHash가 없음");
    }

    const imageUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;

    const metadata = {
      name: name || "NFT 이름",
      description: description || "NFT 설명",
      image: imageUrl
    };

    console.log("📌 [Debug] 생성된 메타데이터:", metadata);

    const metadataResponse = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Authorization": PINATA_JWT,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(metadata)
    });

    const metadataData = await metadataResponse.json();
    console.log("📌 [Debug] 메타데이터 IPFS 응답 데이터:", metadataData);

    if (!metadataData || !metadataData.IpfsHash) {
      throw new Error("❌ 메타데이터 IPFS 업로드 실패: 응답에서 IpfsHash가 없음");
    }

    return `https://gateway.pinata.cloud/ipfs/${metadataData.IpfsHash}`;
  } catch (error) {
    console.error("❌ [Debug] IPFS 업로드 오류:", error);
    alert("IPFS 업로드 실패! 콘솔 로그를 확인하세요.");
    return null;
  }
}

async function mintSkin(skinType) {
  if (!currentAccount) await connectWallet();

  let recipientAddress, skinAmount, tokenContract, mintFunction;
  let button, tokenSymbol, tokenImage, tokenAddress;

  if (skinType === 1) { // 🔴 Red Dice
      recipientAddress = document.getElementById("redDiceAddress").value.trim();
      skinAmount = parseInt(document.getElementById("redDiceAmount").value.trim());
      button = document.getElementById("buyRedDice");
      tokenContract = redDiceToken;
      mintFunction = "mintRedDice"; 
      tokenSymbol = "RED"; 
      tokenAddress = redDiceTokenAddress; 
      tokenImage = "https://gateway.pinata.cloud/ipfs/bafkreie3xkmzca5lms6432dizefa6ejonp34t47gpzjodgsemmrfu4a2aa"; // 🔴 Red Dice 이미지
  } else if (skinType === 2) { // 🔵 Blue Dice
      recipientAddress = document.getElementById("blueDiceAddress").value.trim();
      skinAmount = parseInt(document.getElementById("blueDiceAmount").value.trim());
      button = document.getElementById("buyBlueDice");
      tokenContract = blueDiceToken;
      mintFunction = "mintBlueDice"; 
      tokenSymbol = "BLUE"; 
      tokenAddress = blueDiceTokenAddress; 
      tokenImage = "https://gateway.pinata.cloud/ipfs/bafybeigufd64xcwgnizcoaar3lqis3zh474pkrmz6fzrix6wcl667dei3e"; // 🔵 Blue Dice 이미지
  } else {
      console.error("❌ 잘못된 skinType 값:", skinType);
      return;
  }

  console.log(`🎲 ERC-20 ${tokenSymbol} 발행 요청:
      - 받는 주소: ${recipientAddress}
      - 발행 수량: ${skinAmount}
      - 컨트랙트 주소: ${tokenAddress}
      - 심볼: ${tokenSymbol}
      - 이미지: ${tokenImage}
  `);

  try {
      console.log(`🚀 ERC-20 ${tokenSymbol} ${skinAmount}개 민팅 시작...`);

      button.disabled = true;
      button.innerText = "⏳ 발행 중...";

      // ✅ ✅ ✅ `getOwner()` 함수 호출 (owner() → getOwner())
      const contractOwner = await tokenContract.methods.getOwner().call();
      console.log(`📌 [DEBUG] 컨트랙트 Owner: ${contractOwner}`);

      const gasEstimate = await tokenContract.methods[mintFunction](recipientAddress, skinAmount).estimateGas({
          from: currentAccount,
      });

      console.log(`⛽ [DEBUG] 예상 Gas 사용량: ${gasEstimate}`);

      const tx = await tokenContract.methods[mintFunction](recipientAddress, skinAmount).send({
          from: currentAccount,
          gas: gasEstimate + 50000,
          gasPrice: await web3.eth.getGasPrice()
      });

      console.log(`✅ ERC-20 ${tokenSymbol} 발행 성공! Tx: ${tx.transactionHash}`);
      alert(`✅ ${skinAmount}개의 ${tokenSymbol}이(가) ${recipientAddress} 주소로 발행되었습니다!`);

      // ✅ MetaMask에 자동 추가
      await addTokenToMetaMask(tokenAddress, tokenSymbol, tokenImage);

  } catch (error) {
      console.error(`❌ ERC-20 ${tokenSymbol} 발행 오류:`, error);
      alert(`❌ ${tokenSymbol} 발행 실패! MetaMask 로그를 확인하세요.`);
  } finally {
      button.disabled = false;
      button.innerText = "🌟 발행하기";
  }
}

async function mintSkin(skinType) {
  if (!currentAccount) await connectWallet();

  let recipientAddress, skinAmount, tokenContract, mintFunction;
  let button, tokenSymbol, tokenImage, tokenAddress;

  if (skinType === 1) { // 🔴 Red Dice
      recipientAddress = document.getElementById("redDiceAddress").value.trim();
      skinAmount = parseInt(document.getElementById("redDiceAmount").value.trim());
      button = document.getElementById("buyRedDice");
      tokenContract = redDiceToken;
      mintFunction = "mintRedDice"; 
      tokenSymbol = "RED"; 
      tokenAddress = redDiceTokenAddress; 
      tokenImage = "https://gateway.pinata.cloud/ipfs/bafkreie3xkmzca5lms6432dizefa6ejonp34t47gpzjodgsemmrfu4a2aa";
  } else if (skinType === 2) { // 🔵 Blue Dice
      recipientAddress = document.getElementById("blueDiceAddress").value.trim();
      skinAmount = parseInt(document.getElementById("blueDiceAmount").value.trim());
      button = document.getElementById("buyBlueDice");
      tokenContract = blueDiceToken;
      mintFunction = "mintBlueDice"; 
      tokenSymbol = "BLUE"; 
      tokenAddress = blueDiceTokenAddress; 
      tokenImage = "https://gateway.pinata.cloud/ipfs/bafybeigufd64xcwgnizcoaar3lqis3zh474pkrmz6fzrix6wcl667dei3e";
  } else {
      console.error("❌ 잘못된 skinType 값:", skinType);
      return;
  }

  console.log(`🎲 ERC-20 ${tokenSymbol} 발행 요청:
      - 받는 주소: ${recipientAddress}
      - 발행 수량: ${skinAmount}
      - 컨트랙트 주소: ${tokenAddress}
      - 심볼: ${tokenSymbol}
      - 이미지: ${tokenImage}
  `);

  try {
      console.log(`🚀 ERC-20 ${tokenSymbol} ${skinAmount}개 민팅 시작...`);

      button.disabled = true;
      button.innerText = "⏳ 발행 중...";

      // ✅ ✅ ✅ `getOwner()` 함수 호출 (owner() → getOwner())
      const contractOwner = await tokenContract.methods.getOwner().call();
      console.log(`📌 [DEBUG] 컨트랙트 Owner: ${contractOwner}`);

      const gasEstimate = await tokenContract.methods[mintFunction](recipientAddress, skinAmount).estimateGas({
          from: currentAccount,
      });

      console.log(`⛽ [DEBUG] 예상 Gas 사용량: ${gasEstimate}`);

      const tx = await tokenContract.methods[mintFunction](recipientAddress, skinAmount).send({
          from: currentAccount,
          gas: gasEstimate + 50000,
          gasPrice: await web3.eth.getGasPrice()
      });

      console.log(`✅ ERC-20 ${tokenSymbol} 발행 성공! Tx: ${tx.transactionHash}`);
      alert(`✅ ${skinAmount}개의 ${tokenSymbol}이(가) ${recipientAddress} 주소로 발행되었습니다!`);

      // ✅ MetaMask에 자동 추가
      await addTokenToMetaMask(tokenAddress, tokenSymbol, tokenImage);

  } catch (error) {
      console.error(`❌ ERC-20 ${tokenSymbol} 발행 오류:`, error);
      alert(`❌ ${tokenSymbol} 발행 실패! MetaMask 로그를 확인하세요.`);
  } finally {
      button.disabled = false;
      button.innerText = "🌟 발행하기";
  }
}


// ✅ ERC-20 스킨 발행 버튼 클릭 이벤트 추가
document.addEventListener("DOMContentLoaded", function () {
  const buyRedDiceButton = document.getElementById("buyRedDice");
  if (buyRedDiceButton) {
      buyRedDiceButton.addEventListener("click", async () => {
          console.log("✅ Red Dice 발행 버튼 클릭됨!");
          await mintSkin(1); // 🔴 Red Dice (ERC-20)
      });
  } else {
      console.warn("⚠️ [Debug] Red Dice 발행 버튼을 찾을 수 없음!");
  }

  const buyBlueDiceButton = document.getElementById("buyBlueDice");
  if (buyBlueDiceButton) {
      buyBlueDiceButton.addEventListener("click", async () => {
          console.log("✅ Blue Dice 발행 버튼 클릭됨!");
          await mintSkin(2); // 🔵 Blue Dice (ERC-20)
      });
  } else {
      console.warn("⚠️ [Debug] Blue Dice 발행 버튼을 찾을 수 없음!");
  }
});

async function addTokenToMetaMask(tokenAddress, tokenSymbol, tokenImage) {
  console.log(`✅ [DEBUG] addTokenToMetaMask() 실행됨:
      - tokenAddress: ${tokenAddress}
      - tokenSymbol: ${tokenSymbol}
      - tokenImage: ${tokenImage}
  `);

  try {
      if (!tokenAddress || !tokenSymbol || !tokenImage) {
          throw new Error(`토큰 정보가 유효하지 않습니다! tokenAddress=${tokenAddress}, tokenSymbol=${tokenSymbol}, tokenImage=${tokenImage}`);
      }

      const wasAdded = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
              type: "ERC20",
              options: {
                  address: tokenAddress,
                  symbol: tokenSymbol,
                  decimals: 18,
                  image: tokenImage,
              },
          },
      });

      if (wasAdded) {
          console.log(`✅ MetaMask에 ${tokenSymbol} 추가 완료!`);
      } else {
          console.log(`⚠️ MetaMask에 ${tokenSymbol} 추가 거부됨!`);
      }
  } catch (error) {
      console.error(`❌ MetaMask에 ${tokenSymbol} 추가 오류:`, error);
  }
}


document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ [Debug] 문서 로드 완료!");

  // ✅ NFT 이미지 업로드 버튼 클릭 이벤트 추가
  const uploadButton = document.getElementById("uploadButton");
  if (uploadButton) {
      uploadButton.addEventListener("click", async () => {
          console.log("✅ [Debug] 업로드 버튼 클릭됨!");

          const fileInput = document.getElementById("upload");
          if (!fileInput || fileInput.files.length === 0) {
              alert("⚠️ 파일을 선택하세요.");
              console.log("❌ [Debug] 파일이 선택되지 않음.");
              return;
          }

          console.log("📌 [Debug] 업로드할 파일:", fileInput.files[0]);

          const name = document.getElementById("nftName").value.trim();
          const description = document.getElementById("description").value.trim();

          document.getElementById("result").innerText = "이미지 및 메타데이터 업로드 중...";

          const metadataURI = await uploadToIPFSWithMetadata(fileInput.files[0], name, description);

          if (metadataURI) {
              console.log("✅ [Debug] 업로드 완료! 메타데이터 URI:", metadataURI);
              document.getElementById("result").innerText = `✅ 업로드 완료! IPFS 링크: ${metadataURI}`;
          } else {
              console.log("❌ [Debug] 업로드 실패!");
              document.getElementById("result").innerText = "❌ 업로드 실패!";
          }
      });
  } else {
      console.warn("⚠️ [Debug] 업로드 버튼을 찾을 수 없음!");
  }

  // ✅ NFT 민팅 버튼 클릭 이벤트 추가
  const mintButton = document.getElementById("mintButton");
  if (mintButton) {
      mintButton.addEventListener("click", async () => {
          console.log("✅ NFT 민팅 버튼 클릭됨!");
          await mintNFT();
      });
  } else {
      console.warn("⚠️ [Debug] NFT 민팅 버튼을 찾을 수 없음!");
  }

  // ✅ ERC-20 스킨(주사위) 발행 버튼 클릭 이벤트 추가 (중복 방지)
  const buyRedDiceButton = document.getElementById("buyRedDice");
  if (buyRedDiceButton) {
      buyRedDiceButton.replaceWith(buyRedDiceButton.cloneNode(true)); // 기존 이벤트 제거
      document.getElementById("buyRedDice").addEventListener("click", async () => {
          console.log("✅ Red Dice 발행 버튼 클릭됨!");
          await mintSkin(1); // Red Dice 발행
          await addTokenToMetaMask(); // 🔥 MetaMask에 SKIN 추가
      });
  } else {
      console.warn("⚠️ [Debug] Red Dice 발행 버튼을 찾을 수 없음!");
  }

  const buyBlueDiceButton = document.getElementById("buyBlueDice");
  if (buyBlueDiceButton) {
      buyBlueDiceButton.replaceWith(buyBlueDiceButton.cloneNode(true)); // 기존 이벤트 제거
      document.getElementById("buyBlueDice").addEventListener("click", async () => {
          console.log("✅ Blue Dice 발행 버튼 클릭됨!");
          await mintSkin(2); // Blue Dice 발행
          await addTokenToMetaMask(); // 🔥 MetaMask에 SKIN 추가
      });
  } else {
      console.warn("⚠️ [Debug] Blue Dice 발행 버튼을 찾을 수 없음!");
  }

  // ✅ ERC-20 잔액 조회 버튼 이벤트 추가 (중복 방지)
});

