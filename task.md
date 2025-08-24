### **项目技术规格书：去中心化数字奇美拉 (V1.1 - Demo-First)**

  * **文档版本:** 1.1
  * **更新日期:** 2025年8月24日
  * **目标:** 快速开发一个功能完备、Gas 成本低廉、核心玩法清晰的 DApp Demo。接受为达此目的而引入的中心化捷径。

-----

#### **1. 项目概述 (Project Overview)**

本项目旨在创建一个协作式 NFT 生成 DApp。用户通过链上交易贡献“基因片段”，共同塑造一个“数字奇美拉”。当奇美拉“诞生”后，其形态被永久锁定，所有贡献者均有资格铸造一枚代表该奇美ラの NFT 作为纪念。

V1.1 版本专注于核心逻辑的实现和 Demo 的流畅性，对 Gas 成本和开发复杂度进行了大幅优化。

-----

#### **2. 核心技术栈与规范 (Core Tech Stack & Specifications)**

##### **2.1. 技术栈 (Technology Stack)**

  * **智能合约:** Solidity `^0.8.20`, Hardhat, OpenZeppelin Contracts
  * **前端:** Next.js (React), TypeScript, Viem/Ethers.js, TailwindCSS
  * **钱包连接:** RainbowKit
  * **去中心化存储:** IPFS (通过 Pinata 进行 pinning)
  * **后端/脚本:** Node.js (仅用于管理员手动执行的脚本)

##### **2.2. 链上常量与枚举 (On-Chain Constants & Enums)**

这是**前后端必须严格遵守**的“基因法典”，是 `uint8` 与实际意义之间的唯一映射。

| `geneType` (uint8) | 基因类型 | `value` (uint8) | 基因值选项 (前端解释) |
| :--- | :--- | :--- | :--- |
| **0** | `bodyShape` | 0 | "Normal" |
| | | 1 | "Aquatic" |
| | | 2 | "Fuzzy" |
| **1** | `bodyColor` | 0 | "\#FF5733" (Fiery Orange) |
| | | 1 | "\#33FF57" (Neon Green) |
| | | 2 | "\#3357FF" (Cyber Blue) |
| **2** | `eyes` | 0 | "Default" |
| | | 1 | "Laser" |
| | | 2 | "Googly" |
| **3** | `mouth` | 0 | "Smile" |
| | | 1 | "Fangs" |
| | | 2 | "Derp" |

  * **前端实现:** 在前端代码库中创建一个 `constants.ts` 文件，以 `Object` 或 `enum` 的形式存储以上映射关系，便于代码维护和渲染。

##### **2.3. NFT 元数据规范 (NFT Metadata Specification)**

遵循 ERC-721 标准。由管理员脚本生成并上传至 IPFS 的 `metadata.json` 必须包含以下字段：

  * `name`: e.g., "Chimera \#1"
  * `description`: "A decentralized lifeform co-created by N contributors."
  * `image`: `ipfs://<IMAGE_CID>`
  * `attributes`: 包含所有最终基因 `trait_type` 和 `value` 的数组。

-----

#### **3. 模块化任务详解 (Detailed Modular Tasks)**

##### **模块 A: 智能合约 (`ChimeraFactory.sol`)**

**A1. 任务列表:**

  * `[TASK-SC-01]` **环境搭建:** `npx hardhat init`，安装 `@openzeppelin/contracts`。
  * `[TASK-SC-02]` **合约结构:** 创建 `ChimeraFactory.sol`，继承 `ERC721` 和 `Ownable`。
  * `[TASK-SC-03]` **状态变量:**
      * `mapping(uint8 => uint8) public dna;` // 存储最终基因
      * `mapping(address => bool) public isContributor;` // 贡献者白名单
      * `mapping(address => bool) public hasMinted;` // 防止重复铸造
      * `bool public isBorn;` // 诞生状态
      * `uint256 private _nextTokenId;` // NFT ID 计数器
      * `string private _baseTokenURI;` // 元数据基地址
  * `[TASK-SC-04]` **函数实现:** 按照下面的 ABI 规范，逐一实现所有函数逻辑。
  * `[TASK-SC-05]` **事件定义:** 定义 `GeneContributed` 和 `Born` 事件。
  * `[TASK-SC-06]` **单元测试:** 使用 Hardhat/Chai 编写测试脚本，覆盖 `contribute`, `birth`, `mint` 的所有逻辑分支。
  * `[TASK-SC-07]` **部署脚本:** 编写 `deploy.ts` 脚本，用于将合约部署到 Sepolia 测试网。

**A2. 最终应用二进制接口 (ABI) 规范:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChimeraFactory is ERC721, Ownable {

    // ----------- EVENTS -----------
    event GeneContributed(address indexed contributor, uint8 geneType, uint8 value);
    event Born(address indexed bornBy, uint256 timestamp);

    // ----------- STATE VARIABLES -----------
    // ... (如上所列)

    // ----------- CONSTRUCTOR -----------
    constructor() ERC721("Cyber Chimera", "DCHIM") {}

    // ----------- WRITE FUNCTIONS -----------

    /**
     * @notice Contribute a gene. Replaces previous value for the same geneType.
     * @param geneType The type of gene to contribute, as per the spec.
     * @param value The value index for the gene, as per the spec.
     */
    function contribute(uint8 geneType, uint8 value) external {
        require(!isBorn, "Chimera already born.");
        // Basic validation for demo purposes
        require(geneType < 4, "Invalid gene type"); 
        require(value < 3, "Invalid gene value");

        dna[geneType] = value;
        if (!isContributor[msg.sender]) {
            isContributor[msg.sender] = true;
        }
        emit GeneContributed(msg.sender, geneType, value);
    }

    /**
     * @notice Finalize the Chimera's DNA, making it immutable. Only owner can call.
     */
    function birth() external onlyOwner {
        require(!isBorn, "Chimera already born.");
        isBorn = true;
        emit Born(msg.sender, block.timestamp);
    }

    /**
     * @notice Allows a verified contributor to mint one NFT after birth.
     */
    function mint() external {
        require(isBorn, "Chimera not born yet.");
        require(isContributor[msg.sender], "Not a contributor.");
        require(!hasMinted[msg.sender], "Already minted.");

        hasMinted[msg.sender] = true;
        _safeMint(msg.sender, _nextTokenId);
        _nextTokenId++;
    }

    /**
     * @notice Set the base URI for all token metadata. Only owner can call.
     * @dev The URI should end with a forward slash '/'.
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    // ----------- READ FUNCTIONS -----------

    function getGene(uint8 geneType) external view returns (uint8) {
        return dna[geneType];
    }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
```

-----

##### **模块 B: 前端 & Web3 集成**

**B1. 任务列表:**

  * `[TASK-FE-01]` **项目初始化:** `create-next-app` (TypeScript + TailwindCSS)。
  * `[TASK-FE-02]` **Web3 配置:** 安装 `viem`, `wagmi`, `@rainbow-me/rainbowkit`。配置 `WagmiConfig` 和 `RainbowKitProvider`。
  * `[TASK-FE-03]` **常量定义:** 创建 `utils/constants.ts`，严格按照 `2.2` 节的规范定义基因映射 `Object`。
  * `[TASK-FE-04]` **合约Hooks:** 创建 `hooks/useChimeraContract.ts`，封装所有与合约的读写交互（`getGene`, `contribute`, `mint` 等）。
  * `[TASK-FE-05]` **主页布局:** 创建 `ConnectWallet` 按钮，主内容区，页脚。
  * `[TASK-FE-06]` **奇美拉渲染器 (`ChimeraViewer.tsx`):**
      * 接收 `dna` 对象 `{0: 1, 1: 2, ...}` 作为 prop。
      * 根据 `dna` 和 `constants.ts` 中的映射，使用 CSS 或 SVG 动态渲染出奇美拉的预览图。
  * `[TASK-FE-07]` **基因贡献面板 (`ContributionPanel.tsx`):**
      * 为每种 `geneType` 创建一个下拉菜单 (`<select>`)。
      * 选项根据 `constants.ts` 动态生成。
      * 提供一个 "Contribute Gene" 按钮，点击后调用 `useChimeraContract` 中的写入函数，并处理交易的 loading 和 success/error 状态。
  * `[TASK-FE-08]` **管理员面板 (`AdminPanel.tsx`):**
      * 一个简单的 UI，仅当连接的钱包是合约的 `owner` 时才显示。
      * 提供一个 "Birth" 按钮和一个用于输入 Base URI 的文本框及 "Set Base URI" 按钮。

-----

##### **模块 C: 元数据生成与 IPFS 上传 (管理员手动脚本)**

**C1. 任务列表:**

  * `[TASK-DS-01]` **环境准备:** 创建一个 `scripts` 目录。`npm install ethers @pinata/sdk canvas`。在 `.env` 中配置 `PINATA_API_KEY`, `PINATA_SECRET_KEY`, `PRIVATE_KEY`, `SEPOLIA_RPC_URL`。
  * `[TASK-DS-02]` **资源准备:** 创建 `scripts/assets` 目录，存放分层的 PNG 图像资源，例如 `bodyShape_0.png`, `eyes_1.png` 等。
  * `[TASK-DS-03]` **编写脚本 (`finalize.js`):**
    1.  **连接:** 连接到 Sepolia 测试网，并实例化合约。
    2.  **拉取DNA:** 调用 `getGene` 函数 4 次，获取完整的 `dna` 数据。
    3.  **生成图像:** 使用 `canvas` 库，根据 `dna` 数据，像图层一样将对应的 PNG 资源叠加绘制在一张画布上，并导出为 `final_chimera.png`。
    4.  **上传图像:** 使用 Pinata SDK 将 `final_chimera.png` 上传到 IPFS，记录返回的 `ImageCID`。
    5.  **生成元数据:** 创建一个 `metadata.json` 文件，填入名称、描述和 `image: "ipfs://ImageCID"`，并根据 `dna` 填充 `attributes` 数组。
    6.  **上传元数据:** 使用 Pinata SDK 将 `metadata.json` 上传到 IPFS，记录返回的 `MetadataCID`。
    7.  **打印结果:** 在控制台清晰地打印出最终的 Base URI: `ipfs://MetadataCID/`。
  * `[TASK-DS-04]` **设置URI:** 脚本作者复制打印出的 Base URI，通过前端的管理员面板或直接调用合约的 `setBaseURI` 函数完成最后一步。

-----

#### **4. 开发与部署流程 (Workflow)**

1.  **阶段一 (合约):** 完成所有 `[TASK-SC]` 任务。将合约部署到 Sepolia，获得唯一的合约地址。
2.  **阶段二 (前端):** 基于已部署的合约地址和 ABI，完成所有 `[TASK-FE]` 任务。此阶段可与阶段三并行。
3.  **阶段三 (脚本与资源):** 完成 `[TASK-DS-01]` 和 `[TASK-DS-02]`，准备好所有图像资源并搭建好脚本环境。
4.  **阶段四 (集成与测试):**
      * 使用前端页面，多个钱包地址进行基因贡献。
      * 合约所有者通过前端管理员面板调用 `birth()`。
      * 管理员在本地运行 `finalize.js` 脚本，生成并上传元数据，获得 Base URI。
      * 管理员通过前端面板设置 Base URI。
      * 贡献者们返回页面，调用 `mint()` 函数，检查钱包和 OpenSea Testnet 是否能看到最终的 NFT 及其元数据。
5.  **完成:** 准备好进行项目演示。