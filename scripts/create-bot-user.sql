-- init-db/01-init.sql
CREATE EXTENSION IF NOT EXISTS vector;

-- file: scripts/create-bot-user.sql

DO
$do$
BEGIN
   -- 1. Tạo User nếu chưa có
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'bot_user') THEN
CREATE ROLE bot_user LOGIN PASSWORD 'SecureBotPass123!';
END IF;
END
$do$;

-- 2. Cấp quyền kết nối
GRANT CONNECT ON DATABASE "book" TO bot_user; -- Đảm bảo đúng tên DB trong .env

-- 3. Cấp quyền Schema
GRANT USAGE ON SCHEMA public TO bot_user;

-- 4. CẤP QUYỀN ĐỌC CHO TẤT CẢ CÁC BẢNG ĐANG CÓ (Khắc phục lỗi sai tên bảng)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO bot_user;

-- 5. CẤP QUYỀN MẶC ĐỊNH CHO CÁC BẢNG SẼ TẠO TRONG TƯƠNG LAI (Khắc phục lỗi TypeORM drop bảng)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO bot_user;

-- 6. Riêng bảng Chat cần quyền Ghi (Ghi đè quyền Select ở trên)
-- Hãy chắc chắn tên bảng chat đúng như trong Entity NestJS
GRANT INSERT, UPDATE, SELECT ON TABLE "conversations", "chat_messages" TO bot_user;

-- 7. Cấp quyền Sequence (để insert ID tự tăng)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO bot_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO bot_user;

-- 8. Chặn quyền xóa (An toàn)
REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM bot_user;