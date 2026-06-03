# 公众号读者提问表单

读者填写后，自动推送到飞书群通知。

---

## 部署步骤

### 1. 创建飞书群机器人（2分钟）

1. 打开你想接收通知的飞书群
2. 点击群右上角 `···` → **群机器人**
3. 点击 **添加机器人** → 选择 **自定义机器人**
4. 填名字：`清醒的代价-读者提问`，点击**添加**
5. 复制 **Webhook 地址**（格式如 `https://open.feishu.cn/open-apis/bot/v2/hook/xxxx`）
6. 把这个地址保存好，第 3 步要用

### 2. 注册 Vercel（2分钟）

1. 打开 [vercel.com](https://vercel.com)
2. 点击 **Sign Up**，用 GitHub 账号注册/登录（如果没有 GitHub，先注册一个 [github.com](https://github.com)）
3. 注册完成后回到 Vercel 首页

### 3. 部署项目（3分钟）

**方式 A：一键部署（推荐）**

点击下方按钮，按提示操作：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

> 注：你需要先把本项目代码推送到自己的 GitHub 仓库，或者我可以帮你生成一个可以直接导入的链接。

**方式 B：手动上传**

1. 在 Vercel 首页点击 **Add New Project**
2. 选择 **Import Git Repository**，导入你的仓库
3. 在 **Environment Variables** 区域添加：
   - Name: `FEISHU_WEBHOOK_URL`
   - Value: 你第 1 步复制的 Webhook 地址
4. 点击 **Deploy**

部署完成后，Vercel 会给你一个域名（如 `https://your-project.vercel.app`），记下来。

### 4. 配置公众号菜单（2分钟）

1. 登录 [微信公众平台](https://mp.weixin.qq.com)
2. 左侧菜单 → **内容与互动** → **自定义菜单**
3. 添加一个菜单，名称如「告诉我你的困境」
4. 菜单内容选择 **跳转网页**
5. 网页链接填入第 3 步拿到的 Vercel 域名
6. 保存并发布

---

## 完成

现在读者点击公众号菜单，就会打开表单。填写提交后，你的飞书群会立刻收到通知。

---

## 本地开发（可选）

```bash
# 安装依赖
npm install

# 创建环境变量文件
cp .env.example .env.local
# 编辑 .env.local，填入 FEISHU_WEBHOOK_URL

# 启动开发服务器
npm run dev
```
