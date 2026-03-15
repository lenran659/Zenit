# 自部署指南

## 快速开始

### 1. 克隆代码

```bash
git clone https://github.com/yourusername/zenit.git
cd zenit
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp env.example .env

# 编辑 .env 文件，修改密码等配置
nano .env
```

### 3. 启动服务

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 4. 访问应用

- 前端：http://localhost:3000
- 数据库：localhost:5432

## 常用命令

```bash
# 停止服务
docker-compose down

# 停止并删除数据卷（清空数据库）
docker-compose down -v

# 重新构建
docker-compose up -d --build

# 查看运行状态
docker-compose ps

# 进入数据库容器
docker-compose exec postgres psql -U zenit -d zenit_db
```

## 数据持久化

数据库数据保存在 Docker volume 中：
- 卷名：`zenit-postgres-data`
- 位置：`/var/lib/postgresql/data`

## 生产环境建议

1. **修改默认密码**：务必修改 `.env` 中的 `POSTGRES_PASSWORD`
2. **使用反向代理**：建议配合 Nginx/Caddy 使用 HTTPS
3. **定期备份**：配置数据库自动备份脚本
4. **限制端口暴露**：生产环境建议只暴露 80/443，数据库不暴露到公网

## 添加后端 API（可选）

如果你需要后端服务：

1. 创建 `backend/` 目录并添加你的后端代码
2. 取消注释 `docker-compose.yml` 中的 backend 服务
3. 创建 `backend/Dockerfile`
4. 重新启动：`docker-compose up -d`

## 故障排查

### 端口被占用

如果 3000 或 5432 端口被占用，修改 `.env` 中的端口配置：
```env
FRONTEND_PORT=3001
POSTGRES_PORT=5433
```

### 数据库连接失败

检查数据库健康状态：
```bash
docker-compose exec postgres pg_isready -U zenit
```

### 前端无法访问后端

确保 `NEXT_PUBLIC_API_URL` 设置为浏览器可访问的地址（不是容器内部地址）。
