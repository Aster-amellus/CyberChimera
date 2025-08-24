# 🧬 Cyber Chimera - 协作像素艺术NFT平台

## 项目摘要

Cyber Chimera 是一个去中心化的NFT创作平台，融合了社区协作与个人创意。用户可以通过贡献基因共同创造独特的像素艺术生物（Chimera），也可以使用内置的像素画编辑器创作个人NFT作品。

### 🎯 核心亮点

- **双模式创作体系**：既支持社区协作创造集体作品，也支持个人独立创作
- **实时基因演化**：每次基因贡献都会实时更新Chimera的外观，社区共同见证生命的演变
- **专业像素画编辑器**：内置64x64像素画编辑器，支持多种绘图工具和颜色选择
- **链上永久存储**：所有NFT数据永久存储在以太坊区块链上
- **透明贡献系统**：所有贡献记录公开透明，可追溯每个基因的贡献者

### 💡 使用场景

1. **社区活动**：组织社区成员共同创造独特的吉祥物NFT
2. **艺术创作**：艺术家使用像素画编辑器创作独特的数字艺术品
3. **教育演示**：展示区块链协作和智能合约的实际应用
4. **收藏投资**：收集限量版协作NFT或独特的像素艺术作品
5. **品牌营销**：品牌方组织粉丝共创品牌形象NFT

### ✨ 功能概述

#### 协作创造模式
- 6种基因类型（体型、颜色、眼睛、嘴巴、图案、配饰）
- 每种基因8个选项，共计262,144种可能组合
- 实时DNA可视化展示
- 贡献者专属铸造权

#### 个人创作模式  
- 64x64像素画布
- 画笔、橡皮擦、油漆桶工具
- 18种预设颜色 + 自定义调色板
- 撤销/重做支持
- 本地保存和云端铸造

#### 数据分析面板
- 贡献统计图表
- 基因分布热力图
- 实时活动时间线
- 贡献者排行榜

## 🚀 快速开始

### 环境要求
- Node.js v18+ 
- npm 或 yarn
- MetaMask 钱包插件
- Sepolia 测试网 ETH（从 [Sepolia Faucet](https://sepoliafaucet.com/) 获取）

### 安装步骤

1. 克隆并安装依赖：
```bash
git clone https://github.com/yourusername/CyberChimera.git
cd CyberChimera
npm install
```

2. 配置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件，填入你的配置
```

3. 部署智能合约：
```bash
npm run compile
npm run deploy
```

4. 启动前端：
```bash
cd frontend
npm install
npm run dev
```

5. 访问 http://localhost:3000

## 🎮 使用指南

### 参与协作创造
1. 连接 MetaMask 钱包
2. 在贡献面板选择基因类型和数值
3. 点击"贡献基因"提交（需要 gas 费）
4. 等待管理员"诞生"Chimera
5. 铸造你的纪念版 NFT

### 创作个人作品
1. 进入"创作"页面
2. 选择"新建设计"打开编辑器
3. 使用绘图工具创作你的角色
4. 保存设计或直接铸造为 NFT

### 管理员操作
1. 等待社区贡献基因
2. 在管理面板点击"诞生 Chimera"
3. 运行元数据生成脚本
4. 设置 NFT 元数据 URI

## 🏗️ 项目结构

```
CyberChimera/
├── contracts/          # 智能合约
│   └── ChimeraFactory.sol
├── frontend/          # Next.js 前端
│   ├── app/          # 页面路由
│   ├── components/   # React 组件
│   │   ├── PixelArtEditor.tsx    # 像素画编辑器
│   │   ├── CustomMintPanel.tsx   # 自定义铸造面板
│   │   ├── ChimeraViewer.tsx     # Chimera 查看器
│   │   └── ChimeraStats.tsx      # 统计面板
│   ├── hooks/        # 自定义 Hooks
│   └── utils/        # 工具函数
├── scripts/          # 部署脚本
├── test/            # 合约测试
└── docs/           # 文档

```

## 🔧 技术栈

- **智能合约**: Solidity, Hardhat, OpenZeppelin
- **前端框架**: Next.js 14, React, TypeScript
- **Web3 集成**: wagmi, viem, RainbowKit  
- **样式**: Tailwind CSS
- **区块链**: Ethereum (Sepolia 测试网)
- **存储**: IPFS (通过 Pinata)

## 📝 智能合约接口

### 公开函数
- `contribute(geneType, value)` - 贡献基因
- `mint()` - 铸造 NFT（仅贡献者）
- `getGene(geneType)` - 获取当前基因值

### 管理员函数
- `birth()` - 诞生 Chimera（锁定 DNA）
- `setBaseURI(uri)` - 设置 NFT 元数据 URI

## 🧬 基因系统

### 基因类型（每种8个选项）

1. **体型**: 普通、水生、毛绒、机械、水晶、暗影、电子、植物
2. **颜色**: 火焰橙、霓虹绿、赛博蓝、皇家紫、樱花粉、阳光黄、薄荷青、深紫色
3. **眼睛**: 默认、激光、呆萌、爱心、星星、独眼、三眼、X眼
4. **嘴巴**: 微笑、獠牙、吐舌、亲亲、胡子、悲伤、吸血鬼、机器人
5. **图案**: 无、条纹、圆点、锯齿、格子、波浪、星星、爱心
6. **配饰**: 无、帽子、皇冠、蝴蝶结、眼镜、耳机、光环、恶魔角

## 🧪 测试

运行所有测试：
```bash
npm test
```

带 gas 报告的测试：
```bash
REPORT_GAS=true npm test
```

## 🚀 生产部署

1. 部署到主网：
```bash
npm run deploy --network mainnet
```

2. 构建前端：
```bash
npm run build
```

3. 部署到 Vercel/Netlify/IPFS

## ⚠️ 注意事项

- 妥善保管私钥，切勿泄露
- 主网部署前充分测试
- Birth 操作不可逆
- 每个贡献者只能铸造一个 NFT
- 自定义 NFT 与协作 NFT 相互独立

## 🤝 贡献指南

欢迎提交 Pull Request！请确保：
- 代码通过所有测试
- 遵循现有代码风格
- 更新相关文档

## 📄 许可证

MIT License

## 🔗 相关链接

- [在线演示](https://cyberchimera.vercel.app)
- [合约浏览器](https://sepolia.etherscan.io/)
- [Discord 社区](https://discord.gg/cyberchimera)
- [Twitter](https://twitter.com/cyberchimera)

## 👥 团队

- 开发者：[@yourusername](https://github.com/yourusername)
- 设计师：[@designer](https://github.com/designer)
- 社区经理：[@community](https://github.com/community)

---

*Cyber Chimera - 让创意在区块链上永生*