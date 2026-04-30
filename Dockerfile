# # ── 阶段一：构建 ──────────────────────────────────────────────────────────────
# FROM node:22-alpine AS builder

# # 安装 pnpm
# RUN corepack enable && corepack prepare pnpm@latest --activate

# WORKDIR /app

# # 先只复制依赖声明文件，利用 Docker 层缓存
# COPY package.json pnpm-lock.yaml ./
# RUN pnpm install --frozen-lockfile

# # 再复制源码并构建
# COPY . .
# RUN pnpm build

# # ── 阶段二：运行 ──────────────────────────────────────────────────────────────
# FROM nginx:1.27-alpine AS runner

# # 复制自定义 nginx 配置
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # 从构建阶段拷贝静态产物
# COPY --from=builder /app/dist /usr/share/nginx/html

# # 非 root 用户运行（安全加固）
# RUN chown -R nginx:nginx /usr/share/nginx/html \
#     && chmod -R 755 /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
# 直接从 Nginx 开始
FROM nginx:1.27-alpine AS runner

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 关键改动：直接把本地已经生成的 dist 文件夹拷贝进去
# 这里的 ./dist 指的是你本地项目根目录下的产物文件夹
COPY ./dist /usr/share/nginx/html

# 非 root 用户运行（安全加固）
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]