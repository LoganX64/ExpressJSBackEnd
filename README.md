# 🍽 Restaurant Ordering Backend (TypeScript + Node.js)

A backend system for managing restaurants, menus, orders, and admin users — built with **Node.js**, **Express**, and **TypeScript**. It supports JWT-based authentication, scalable modular structure, and integrates with Cloudinary for image uploads.

---

## 🚀 Features

- 🔐 Admin user authentication
- 🍽 Restaurant registration and menu management
- 📦 Order placement and tracking
- ☁️ Cloudinary image upload support
- 🧱 Modular code structure (routes, controllers, models, middlewares)
- 🔎 Centralized error handling and middleware
- ✅ Type safety with TypeScript
- 📄 Environment variable support via `.env`

---



---

## 🛠️ Installation

``bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install

# Development
npm run dev

# Production
npm run build
npm start

## 📁 Folder Structure
```
├── server.ts # App entry point
├── src/
│ ├── app.ts # Express app setup
│ ├── adminUser/ # Admin routes, controllers, models
│ ├── restaurant/ # Restaurant and menu features
│ ├── orders/ # Order-related logic
│ ├── users/ # User-related routes and logic
│ ├── config/ # DB, Cloudinary, and environment configs
│ └── middlewares/ # Auth and error handlers
├── .env # Environment variables
├── package.json # Project metadata and dependencies
├── tsconfig.json # TypeScript config
└── eslint.config.mjs # Linting configuration
```

## 📄 License

This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for more details.
