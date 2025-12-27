# Equipment Tracker

A full-stack CRUD application for managing equipment, built with React, Node.js/Express, and SQLite.

## Features

- View all equipment in a table format
- Add new equipment with form validation
- Edit existing equipment
- Delete equipment with confirmation
- Status badges for visual identification
- Responsive design for mobile devices

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Node.js with Express
- **Database**: SQLite (using sql.js)
- **Styling**: Vanilla CSS

## Database

The application uses SQLite for data storage:
- **Database file**: `backend/database/equipment.db`
- **Library**: sql.js for in-memory SQLite with file persistence
- **Schema**: Equipment table with auto-incrementing ID and timestamps
- **Persistence**: Data is automatically saved to file after any changes

## How to Run Locally

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tracker
   ```

2. **Start the Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The API will run on http://localhost:5000

3. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The app will run on http://localhost:5173

4. **Open your browser** and navigate to http://localhost:5173

**Important**: Both backend and frontend must be running simultaneously for the application to work. The frontend communicates with the backend API to access the SQLite database.

## API Endpoints

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| GET    | /api/equipment       | Get all equipment        |
| GET    | /api/equipment/:id   | Get equipment by ID      |
| POST   | /api/equipment       | Create new equipment     |
| PUT    | /api/equipment/:id   | Update equipment         |
| DELETE | /api/equipment/:id   | Delete equipment         |
| GET    | /api/health          | Health check             |

## Equipment Schema

| Field           | Type   | Options                                  |
|-----------------|--------|------------------------------------------|
| name            | string | Required                                 |
| type            | string | Machine, Vessel, Tank, Mixer             |
| status          | string | Active, Inactive, Under Maintenance      |
| lastCleanedDate | date   | Required                                 |

## Assumptions Made

1. **No Authentication**: The app is for single-user use without login requirements
2. **Simple Database**: Using SQLite for easy setup - assumes low to moderate data volume
3. **Modern Browser**: Assumes use of a modern browser with ES6+ support
4. **Local Development**: Designed for local development, not production deployment
5. **Date Format**: Dates are stored in ISO format (YYYY-MM-DD)

## What I Would Improve With More Time

1. **Testing**: Add unit tests with Jest/React Testing Library and API tests
2. **Search & Filter**: Add ability to search by name and filter by type/status
3. **Sorting**: Add column sorting to the table
4. **Pagination**: Add pagination for large datasets
5. **Better Error Handling**: More granular error messages and retry mechanisms
6. **Loading States**: Skeleton loaders instead of text loading
7. **Dark Mode**: Toggle for dark/light theme
8. **Form Improvements**: Date validation, character limits, duplicate detection
9. **Bulk Operations**: Select multiple items for bulk delete
10. **Export Data**: Export equipment list to CSV/Excel

## Project Structure

```
tracker/
├── backend/
│   ├── package.json
│   ├── server.js           # Express server setup
│   ├── database/
│   │   └── db.js          # SQLite initialization
│   └── routes/
│       └── equipment.js    # API routes
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx         # Main component
│   │   ├── App.css
│   │   ├── components/
│   │   │   ├── EquipmentTable.jsx
│   │   │   ├── EquipmentTable.css
│   │   │   ├── EquipmentForm.jsx
│   │   │   └── EquipmentForm.css
│   │   └── services/
│   │       └── api.js      # API functions
│   └── index.html
└── README.md
```

## License

MIT
