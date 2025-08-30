# FullStack Car Rental

A full-featured Car Rental web application built with a modern full-stack technology stack. This project enables users to browse, book, and manage car rentals online, while providing administrators with tools to manage the fleet, reservations, and users.

---
## Live Demo

Check out the deployed application here:  
[https://full-stack-carrental.vercel.app](https://full-stack-carrental.vercel.app)

-----

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User authentication and registration
- Browse available cars with filtering and searching
- Book cars for specific dates and durations
- Payment processing (optional, depending on integration)
- Admin dashboard for managing cars, users, and bookings
- Responsive design for desktop and mobile devices
- View booking history and manage reservations

---

## Tech Stack

- **Frontend:** React.js (with Redux, React Router)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** CSS3 / SCSS / Styled Components / Tailwind (depending on your setup)
- **Other:** Axios, dotenv, bcryptjs, and more

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or cloud, e.g. MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mvamshireddy/FullStack-Carrental.git
   cd FullStack-Carrental
   ```

2. **Install server dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables:**

   - Create a `.env` file in both `backend` and `frontend` directories.
   - Backend example:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```
   - Frontend example (if using environment variables):
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```

5. **Run the application:**

   - Start the backend server:
     ```bash
     cd backend
     npm run dev
     ```
   - Start the frontend client:
     ```bash
     cd ../frontend
     npm start
     ```

6. **Visit** `http://localhost:3000` in your browser.

---

## Project Structure

```
FullStack-Carrental/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── App.js
│   │   └── index.js
│   └── public/
│
├── README.md
└── package.json
```

---

## Screenshots

> _Add screenshots of the main pages (Home, Cars Listing, Booking, Admin Dashboard, etc.)_

---

## API Endpoints

_Example endpoints:_

- `POST   /api/users/register` - Register a new user
- `POST   /api/users/login` - Log in
- `GET    /api/cars` - List all available cars
- `POST   /api/bookings` - Create a booking
- `GET    /api/bookings/user/:userId` - Get user bookings
- `POST   /api/cars` - (Admin) Add a new car
- `PUT    /api/cars/:id` - (Admin) Update car details

> _See the source code for full details and additional endpoints._

---

## Contributing

Contributions are welcome! Please open an issue or pull request with your suggestions or improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

**Happy Renting! 🚗**
