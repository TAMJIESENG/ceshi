# 数据库设计文档

## 数据库表结构

### 1. 用户表 (users)
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    real_name VARCHAR(50),
    phone VARCHAR(20),
    avatar VARCHAR(255),
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('active', 'disabled') DEFAULT 'active',
    balance DECIMAL(10,2) DEFAULT 0.00,
    level VARCHAR(20) DEFAULT '普通',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    register_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. 卡密表 (cards)
```sql
CREATE TABLE cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    card_number VARCHAR(50) UNIQUE NOT NULL,
    card_type ENUM('monthly', 'quarterly', 'yearly') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    status ENUM('unused', 'used', 'expired') DEFAULT 'unused',
    user_id INT NULL,
    create_user_id INT NOT NULL,
    batch_id VARCHAR(50),
    expire_time TIMESTAMP NULL,
    use_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (create_user_id) REFERENCES users(id)
);
```

### 3. 订单表 (orders)
```sql
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    card_type ENUM('monthly', 'quarterly', 'yearly') NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'completed', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 4. 订单卡密关联表 (order_cards)
```sql
CREATE TABLE order_cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    card_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (card_id) REFERENCES cards(id)
);
```

### 5. 用户余额记录表 (balance_records)
```sql
CREATE TABLE balance_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('recharge', 'consume', 'refund') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    balance_before DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    order_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

### 6. 系统日志表 (system_logs)
```sql
CREATE TABLE system_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    level ENUM('info', 'warning', 'error') DEFAULT 'info',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 7. 系统配置表 (system_settings)
```sql
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 索引设计

```sql
-- 用户表索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);

-- 卡密表索引
CREATE INDEX idx_cards_number ON cards(card_number);
CREATE INDEX idx_cards_status ON cards(status);
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_type ON cards(card_type);
CREATE INDEX idx_cards_batch ON cards(batch_id);

-- 订单表索引
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- 系统日志索引
CREATE INDEX idx_logs_user_id ON system_logs(user_id);
CREATE INDEX idx_logs_action ON system_logs(action);
CREATE INDEX idx_logs_created_at ON system_logs(created_at);
```

## 初始化数据

```sql
-- 插入默认管理员账户
INSERT INTO users (username, email, password_hash, role, status, email_verified) 
VALUES ('admin', 'admin@example.com', '$2b$10$...', 'admin', 'active', TRUE);

-- 插入系统默认配置
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_name', '卡密系统', '网站名称'),
('monthly_price', '29.90', '月卡价格'),
('quarterly_price', '79.90', '季卡价格'),
('yearly_price', '299.90', '年卡价格'),
('allow_register', '1', '是否允许注册'),
('email_verify_required', '0', '是否需要邮箱验证');
```