# Zenit

<p align="center">
  <strong>极简的协作面板：Issues、看板、时间线一体化</strong>
</p>

<p align="center">
  <a href="#快速开始">快速开始</a> •
  <a href="#功能特性">功能特性</a> •
  <a href="#自部署">自部署</a> •
  <a href="#技术栈">技术栈</a>
</p>

<p align="center">
  English | <a href="#zenit-1">中文</a>
</p>

---

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm
- Docker & Docker Compose (for self-hosting)

### Development

```bash
# Clone the repository
git clone https://github.com/yourusername/zenit.git
cd zenit

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Self-Hosting with Docker

```bash
# Copy environment template
cp env.example .env

# Edit .env and set secure passwords
nano .env

# Start all services
docker-compose up -d

# Access the app at http://localhost:3000
```

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

---

## Features

- **🎯 Issue Tracking** - From collection to delivery, full traceability
- **📊 Kanban & Timeline** - Drag to adjust, timeline auto-aligns
- **🏢 Project Spaces** - Natural isolation, no workspace chaos
- **🎨 Clean UI** - Built with shadcn/ui, supports dark mode
- **🚀 Self-Hosted Ready** - One-command deployment with Docker

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: PostgreSQL (ready for future backend integration)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Project Structure

```
zenit/
├── app/                    # Next.js App Router
│   ├── (app)/             # Group routes with layout
│   ├── components/        # React components
│   ├── login/             # Login page
│   └── page.tsx           # Landing page
├── components/            # UI components (shadcn)
├── lib/                   # Utilities
├── public/                # Static assets
├── Dockerfile             # Production build
├── docker-compose.yml     # Full stack orchestration
└── README.md
```

---

## License

This project is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](./LICENSE).

> **Note for SaaS**: If you run this software as a network service, you must provide the source code to your users.

---

<a id="zenit-1"></a>

# Zenit（中文版）

<p align="center">
  <strong>极简的协作面板：Issues、看板、时间线一体化</strong>
</p>

---

## 快速开始

### 环境要求

- Node.js 20+
- pnpm
- Docker & Docker Compose（用于自部署）

### 开发模式

```bash
# 克隆仓库
git clone https://github.com/yourusername/zenit.git
cd zenit

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

### Docker 自部署

```bash
# 复制环境变量模板
cp env.example .env

# 编辑配置，设置安全密码
nano .env

# 一键启动所有服务
docker-compose up -d

# 访问 http://localhost:3000
```

详细部署说明请查看 [DEPLOY.md](./DEPLOY.md)。

---

## 功能特性

- **🎯 Issue 追踪** - 从收集到交付，全程可追溯
- **📊 看板与时间线** - 拖拽调整，时间线自动对齐
- **🏢 项目空间** - 天然隔离，告别混乱的工作区
- **🎨 简洁 UI** - 基于 shadcn/ui，支持深色模式
- **🚀 自部署就绪** - Docker 一键部署

---

## 技术栈

- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **样式**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI 组件**: [shadcn/ui](https://ui.shadcn.com/)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **数据库**: PostgreSQL（预留后端集成）
- **图标**: [Lucide React](https://lucide.dev/)

---

## 项目结构

```
zenit/
├── app/                    # Next.js 应用路由
│   ├── (app)/             # 路由分组
│   ├── components/        # React 组件
│   ├── login/             # 登录页面
│   └── page.tsx           # 首页
├── components/            # UI 组件 (shadcn)
├── lib/                   # 工具函数
├── public/                # 静态资源
├── Dockerfile             # 生产构建
├── docker-compose.yml     # 全栈编排
└── README.md
```

---

## 许可证

本项目采用 [GNU Affero General Public License v3.0 (AGPL-3.0)](./LICENSE) 许可证。

> **SaaS 注意事项**: 如果你将此软件作为网络服务运行，必须向用户提供源代码。

