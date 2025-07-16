-- This file would contain SQL commands to create your database schema
-- For example, if using PostgreSQL:

-- CREATE TABLE users (
--     id VARCHAR(255) PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     role VARCHAR(50) DEFAULT 'user'
-- );

-- CREATE TABLE products (
--     id VARCHAR(255) PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     description TEXT,
--     price DECIMAL(10, 2) NOT NULL,
--     image VARCHAR(255),
--     category VARCHAR(100),
--     stock INT NOT NULL
-- );

-- CREATE TABLE orders (
--     id VARCHAR(255) PRIMARY KEY,
--     user_id VARCHAR(255) REFERENCES users(id),
--     total DECIMAL(10, 2) NOT NULL,
--     status VARCHAR(50) DEFAULT 'pending',
--     payment_method VARCHAR(100),
--     installments VARCHAR(10),
--     address TEXT,
--     coupon_code VARCHAR(100),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE order_products (
--     order_id VARCHAR(255) REFERENCES orders(id),
--     product_id VARCHAR(255) REFERENCES products(id),
--     quantity INT NOT NULL,
--     price DECIMAL(10, 2) NOT NULL,
--     PRIMARY KEY (order_id, product_id)
-- );

-- CREATE TABLE coupons (
--     id VARCHAR(255) PRIMARY KEY,
--     code VARCHAR(100) UNIQUE NOT NULL,
--     discount DECIMAL(5, 2) NOT NULL,
--     type VARCHAR(50) NOT NULL, -- 'percentage' or 'fixed'
--     expires_at TIMESTAMP,
--     is_active BOOLEAN DEFAULT TRUE
-- );

-- CREATE TABLE webhooks (
--     id VARCHAR(255) PRIMARY KEY,
--     event VARCHAR(100) NOT NULL,
--     url VARCHAR(255) NOT NULL,
--     is_active BOOLEAN DEFAULT TRUE,
--     secret VARCHAR(255)
-- );

-- This script is for demonstration. The current project uses a mock in-memory database (lib/db.ts).
