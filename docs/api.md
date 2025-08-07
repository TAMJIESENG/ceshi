# API 接口文档

## 基础信息

- 基础URL: `/api`
- 认证方式: Bearer Token
- 返回格式: JSON

## 通用响应格式

```json
{
    "success": true,
    "message": "操作成功",
    "data": {},
    "code": 200
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 认证相关接口

### 用户注册
**POST** `/auth/register`

**请求参数:**
```json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```

**响应:**
```json
{
    "success": true,
    "message": "注册成功",
    "data": {
        "user_id": 1
    }
}
```

### 用户登录
**POST** `/auth/login`

**请求参数:**
```json
{
    "username": "string",
    "password": "string"
}
```

**响应:**
```json
{
    "success": true,
    "message": "登录成功",
    "data": {
        "token": "jwt_token",
        "user": {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com",
            "role": "user"
        }
    }
}
```

### 获取用户信息
**GET** `/auth/me`

**请求头:**
```
Authorization: Bearer {token}
```

**响应:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "role": "user",
        "balance": "123.45",
        "level": "VIP"
    }
}
```

### 修改密码
**POST** `/auth/change-password`

**请求参数:**
```json
{
    "old_password": "string",
    "new_password": "string"
}
```

## 用户管理接口

### 更新用户资料
**PUT** `/users/profile`

**请求参数:**
```json
{
    "email": "string",
    "phone": "string",
    "real_name": "string",
    "bio": "string"
}
```

### 获取用户统计
**GET** `/users/stats`

**响应:**
```json
{
    "success": true,
    "data": {
        "total_cards": 15,
        "used_cards": 8,
        "expired_cards": 2,
        "balance": "123.45"
    }
}
```

## 卡密管理接口

### 获取卡密列表
**GET** `/cards`

**查询参数:**
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)
- `status`: 状态筛选 (unused/used/expired)
- `type`: 类型筛选 (monthly/quarterly/yearly)

**响应:**
```json
{
    "success": true,
    "data": {
        "cards": [
            {
                "id": 1,
                "card_number": "CARD001234567890",
                "card_type": "monthly",
                "value": "29.90",
                "status": "unused",
                "created_at": "2024-01-01T10:00:00Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "per_page": 10,
            "total": 100,
            "total_pages": 10
        }
    }
}
```

### 查询单个卡密
**GET** `/cards/{card_number}`

**响应:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "card_number": "CARD001234567890",
        "card_type": "monthly",
        "value": "29.90",
        "status": "unused",
        "expire_time": "2024-02-01T10:00:00Z",
        "created_at": "2024-01-01T10:00:00Z"
    }
}
```

### 使用卡密
**POST** `/cards/{card_number}/use`

**响应:**
```json
{
    "success": true,
    "message": "卡密使用成功",
    "data": {
        "card_number": "CARD001234567890",
        "use_time": "2024-01-15T10:30:00Z"
    }
}
```

## 订单管理接口

### 创建订单
**POST** `/orders`

**请求参数:**
```json
{
    "card_type": "monthly",
    "quantity": 1,
    "payment_method": "balance"
}
```

**响应:**
```json
{
    "success": true,
    "message": "订单创建成功",
    "data": {
        "order_id": 1,
        "order_number": "ORD202401150001",
        "total_amount": "29.90",
        "status": "pending"
    }
}
```

### 获取订单列表
**GET** `/orders`

**查询参数:**
- `page`: 页码
- `limit`: 每页数量
- `status`: 状态筛选

**响应:**
```json
{
    "success": true,
    "data": {
        "orders": [
            {
                "id": 1,
                "order_number": "ORD202401150001",
                "card_type": "monthly",
                "quantity": 1,
                "total_amount": "29.90",
                "status": "completed",
                "created_at": "2024-01-15T10:00:00Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "per_page": 10,
            "total": 50,
            "total_pages": 5
        }
    }
}
```

### 支付订单
**POST** `/orders/{order_id}/pay`

**请求参数:**
```json
{
    "payment_method": "balance"
}
```

## 管理员接口

### 获取系统统计
**GET** `/admin/stats`

**权限要求:** admin

**响应:**
```json
{
    "success": true,
    "data": {
        "total_users": 1234,
        "total_cards": 5678,
        "total_orders": 890,
        "total_revenue": "123456.78",
        "today_orders": 45,
        "today_revenue": "1234.56"
    }
}
```

### 用户管理
**GET** `/admin/users`

**查询参数:**
- `page`: 页码
- `limit`: 每页数量
- `role`: 角色筛选
- `status`: 状态筛选

**POST** `/admin/users`

**请求参数:**
```json
{
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "user"
}
```

**PUT** `/admin/users/{user_id}/status`

**请求参数:**
```json
{
    "status": "active"
}
```

### 批量生成卡密
**POST** `/admin/cards/generate`

**请求参数:**
```json
{
    "card_type": "monthly",
    "quantity": 100,
    "value": "29.90",
    "batch_id": "BATCH_001"
}
```

**响应:**
```json
{
    "success": true,
    "message": "卡密生成成功",
    "data": {
        "batch_id": "BATCH_001",
        "generated_count": 100,
        "cards": [
            "CARD001234567890",
            "CARD001234567891"
        ]
    }
}
```

### 删除卡密
**DELETE** `/admin/cards/{card_id}`

### 系统日志
**GET** `/admin/logs`

**查询参数:**
- `page`: 页码
- `limit`: 每页数量
- `level`: 日志级别
- `action`: 操作类型
- `start_date`: 开始日期
- `end_date`: 结束日期

## 系统配置接口

### 获取系统配置
**GET** `/settings`

**响应:**
```json
{
    "success": true,
    "data": {
        "site_name": "卡密系统",
        "monthly_price": "29.90",
        "quarterly_price": "79.90",
        "yearly_price": "299.90",
        "allow_register": true
    }
}
```

### 更新系统配置
**PUT** `/admin/settings`

**权限要求:** admin

**请求参数:**
```json
{
    "monthly_price": "29.90",
    "quarterly_price": "79.90",
    "yearly_price": "299.90"
}
```

## 实时通知接口

### WebSocket 连接
**WebSocket** `/ws`

**连接参数:**
- `token`: JWT token

**消息格式:**
```json
{
    "type": "notification",
    "data": {
        "title": "订单状态更新",
        "message": "您的订单已完成",
        "timestamp": "2024-01-15T10:30:00Z"
    }
}
```