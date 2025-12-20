# ☕ Tas7e7 - Modern Restaurant Management System

<div align="center">

![Café POS Banner](https://img.shields.io/badge/Café%20POS-Restaurant%20Management-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-brightgreen)
![Express](https://img.shields.io/badge/Express-4.18-lightgrey)
![License](https://img.shields.io/badge/License-MIT-yellow)

**A complete, modern Point of Sale (POS) system** for cafes and restaurants
<br>
*<em>Streamline operations, boost efficiency, and grow your business</em>*

![last-commit](https://img.shields.io/github/last-commit/MalseBot/cafe-pos?style=flat&logo=git&logoColor=white&color=0080ff)
![repo-size](https://img.shields.io/github/repo-size/MalseBot/cafe-pos?style=flat&color=0080ff)
![issues](https://img.shields.io/github/issues/MalseBot/cafe-pos?style=flat&color=0080ff)
![license](https://img.shields.io/github/license/MalseBot/cafe-pos?style=flat&color=0080ff)

<p><em>Built with the tools and technologies:</em></p>

![Node.js](https://img.shields.io/badge/Node.js-339933.svg?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000.svg?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248.svg?style=flat&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=javascript&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000.svg?style=flat&logo=jsonwebtokens&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37.svg?style=flat&logo=postman&logoColor=white)
![ES6](https://img.shields.io/badge/ES6+-F7DF1E.svg?style=flat&logo=javascript&logoColor=black)
![bcrypt](https://img.shields.io/badge/bcrypt-000000.svg?style=flat&logo=bcrypt&logoColor=white)
![cors](https://img.shields.io/badge/CORS-000000.svg?style=flat&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-ECD53F.svg?style=flat&logo=dotenv&logoColor=black)

</div>

<br>
<hr>

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 API Documentation](#-api-documentation)
- [🎯 Use Cases](#-use-cases)
- [🛠️ Tech Stack](#️-tech-stack)
- [📊 Screenshots & Demos](#-screenshots--demos)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

<hr>

## ✨ Features

<div align="center">

### 🏪 **For Restaurant Owners**
![Business](https://img.shields.io/badge/📊-Business_Analytics-blue)
![Inventory](https://img.shields.io/badge/📦-Smart_Inventory-green)
![Reports](https://img.shields.io/badge/📈-Real_Time_Reports-orange)

</div>

- **💰 Sales Analytics Dashboard** - Track daily/weekly/monthly performance
- **📦 Inventory Management** - Automatic stock alerts and ordering
- **👥 Staff Performance** - Monitor efficiency and sales targets
- **📊 Financial Reports** - Generate P&L statements with one click

<div align="center">

### 👨‍🍳 **For Kitchen Staff**
![Kitchen](https://img.shields.io/badge/👨‍🍳-Kitchen_Display_System-red)
![Timers](https://img.shields.io/badge/⏱️-Preparation_Timers-yellow)
![Alerts](https://img.shields.io/badge/🔔-Low_Stock_Alerts-orange)

</div>

- **📺 Real-time Order Display** - Instant order updates on kitchen screens
- **⏱️ Smart Preparation Timers** - Auto-calculate cooking times
- **📱 Mobile Notifications** - Alert waitstaff when orders are ready
- **🧾 Recipe Costing** - Track ingredient usage and costs

<div align="center">

### 💁 **For Front-of-House Staff**
![POS](https://img.shields.io/badge/💳-Fast_Checkout-green)
![Tables](https://img.shields.io/badge/🪑-Table_Management-blue)
![Split](https://img.shields.io/badge/🧾-Split_Billing-purple)

</div>

- **⚡ Lightning-fast Order Entry** - Quick keys and favorites
- **🔄 Table Management** - Drag-and-drop table status updates
- **💳 Multiple Payment Methods** - Cash, card, mobile payments
- **🎯 Customer Profiles** - Track preferences and order history

<hr>

## 🚀 Quick Start

### 📦 Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed
- **MongoDB** (local or Atlas)
- **Postman** for API testing
- **npm** package manager

### 🔧 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/MalseBot/cafe-pos.git
cd cafe-pos
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Seed the database:**
```bash
npm run seed
```

5. **Start the server:**
```bash
npm run dev
```

### 🔐 Demo Credentials

After seeding, use these test accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| 👑 **Admin** | `admin@cafe.com` | `admin123` | Full system access |
| 💰 **Manager** | `manager@cafe.com` | `manager123` | Reports & staff management |
| 💳 **Cashier** | `cashier@cafe.com` | `cashier123` | POS operations |
| 👨‍🍳 **Cook** | `cook@cafe.com` | `cook123` | Kitchen display only |

### 🧪 Quick Test

```bash
# Test server is running
curl http://localhost:5000/

# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cafe.com","password":"admin123"}'
```

<hr>

## 📁 Project Structure

```
cafe-pos/
├── 📂 config/           # Database & environment configuration
│   ├── db.js           # MongoDB connection
│   └── seedData.js     # Sample data population
├── 📂 controllers/      # Business logic handlers
│   ├── authController.js
│   ├── orderController.js
│   ├── menuController.js
│   ├── tableController.js
│   ├── kitchenController.js
│   └── adminController.js
├── 📂 middleware/       # Authentication & validation
│   ├── auth.js         # JWT protection
│   └── errorHandler.js # Error management
├── 📂 models/          # MongoDB schemas
│   ├── User.js         # Staff accounts
│   ├── Order.js        # Customer orders
│   ├── MenuItem.js     # Product catalog
│   └── Table.js        # Restaurant tables
├── 📂 routes/          # API endpoints
│   ├── authRoutes.js
│   ├── orderRoutes.js
│   ├── menuRoutes.js
│   ├── tableRoutes.js
│   ├── kitchenRoutes.js
│   └── adminRoutes.js
├── 📜 server.js        # Application entry point
├── 📜 package.json     # Dependencies & scripts
├── 📜 .env.example     # Environment template
└── 📜 README.md        # This file
```

<hr>

## 🔧 API Documentation

<div align="center">

### 🔑 **Authentication** (`/api/auth`)
![Login](https://img.shields.io/badge/POST-Login-blue)
![Register](https://img.shields.io/badge/POST-Register-green)
![Profile](https://img.shields.io/badge/GET-Profile-orange)

</div>

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "cashier@cafe.com",
  "password": "cashier123"
}
```

<div align="center">

### 🛒 **Order Management** (`/api/orders`)
![Create](https://img.shields.io/badge/POST-Create_Order-blue)
![Get](https://img.shields.io/badge/GET-All_Orders-green)
![Update](https://img.shields.io/badge/PUT-Update_Status-yellow)
![Pay](https://img.shields.io/badge/POST-Process_Payment-purple)

</div>

```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "menuItem": "645a1b2c3d4e5f6g7h8i9j0",
      "quantity": 2,
      "specialInstructions": "No sugar"
    }
  ],
  "tableNumber": "T1",
  "customerName": "John Smith"
}
```

<div align="center">

### 📋 **Menu Management** (`/api/menu`)
![GetAll](https://img.shields.io/badge/GET-All_Items-blue)
![Create](https://img.shields.io/badge/POST-Create_Item-green)
![Update](https://img.shields.io/badge/PUT-Update_Item-yellow)
![Delete](https://img.shields.io/badge/DELETE-Delete_Item-red)

</div>

```http
GET /api/menu?category=drinks&availableOnly=true
```

<div align="center">

### 👨‍🍳 **Kitchen Operations** (`/api/kitchen`)
![Orders](https://img.shields.io/badge/GET-Kitchen_Orders-blue)
![Start](https://img.shields.io/badge/PUT-Start_Preparation-green)
![Ready](https://img.shields.io/badge/PUT-Mark_Ready-yellow)
![Inventory](https://img.shields.io/badge/GET-Low_Stock-red)

</div>

```http
GET /api/kitchen/orders
Authorization: Bearer <cook_token>
```

<div align="center">

### 📊 **Admin Dashboard** (`/api/admin`)
![Dashboard](https://img.shields.io/badge/GET-Dashboard_Stats-blue)
![Reports](https://img.shields.io/badge/GET-Sales_Reports-green)
![TopItems](https://img.shields.io/badge/GET-Top_Selling_Items-yellow)
![Staff](https://img.shields.io/badge/GET-Staff_Management-purple)

</div>

```http
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

### 📚 **Postman Collection**

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/YOUR_COLLECTION_ID)

Download our complete Postman collection with pre-configured:
- All API endpoints
- Test environments
- Authentication flows
- Sample requests

<hr>

## 🎯 Use Cases

<div align="center">

### ☕ **Small Café**
![Cafe](https://img.shields.io/badge/🏪-Small_Cafe-orange)
*Perfect for coffee shops and bakeries*

</div>

- Quick order entry for coffee and pastries
- Simple table management
- Basic sales reporting
- Staff shift tracking

<div align="center">

### 🍽️ **Full-Service Restaurant**
![Restaurant](https://img.shields.io/badge/🍽️-Full_Service_Res
