# 🌍 Travel Log

An interactive full-stack travel logging application that lets users pin travel locations on a map, upload travel notes with images, and view past journeys in the map.

## 🚀 Live Demo

👉 [View the App](https://travel-log-three-delta.vercel.app/)


## 🧰 Features

- 🗺️ Interactive map with pin placements
- 📌 Create travel logs with title, description, date, location, rating, and image
- 🧾 Timeline of your travel entries
- 📊 Dashboard with trip statistics
- 🔐 User authentication with JWT
- 🌐 Fully responsive for mobile and desktop

## 🛠️ Tech Stack

**Frontend**:
- React (Vite)
- Tailwind CSS or CSS
- Mapbox GL JS

**Backend**:
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- Cloudinary for image uploads

## 📦 Installation

### Prerequisites
- Node.js and npm
- MongoDB Atlas account
- Mapbox Access Token
- Cloudinary credentials

### Clone the repo

```bash
git clone https://github.com/anjaypp/travel-log.git
cd travel-log
```
### Setup Backend

```bash
cd server
npm install
# Create a .env file with the following:
# PORT=5000
# NODE_ENV= your_node_env
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
# CLIENT_URL= your_client_url

npm run dev
```
### Setup Frontend

```bash
cd ../client
npm install
# Create a .env file with:
# VITE_MAPBOX_TOKEN=your_mapbox_token
# VITE_API_BASE_URL=http://localhost:5000

npm run dev
```
# 🧪 Tests
Tests are currently not implemented. PRs are welcome to add unit and integration tests.

# 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.





