**PDF Invoice Data Extractor**
This is a full-stack web application designed to streamline invoice processing. Users can upload a PDF invoice, view it in the browser, and use the Google Gemini AI to automatically extract key information. The extracted data is then populated into an editable form, allowing for corrections before being saved to a MongoDB database. The application features full CRUD (Create, Read, Update, Delete) functionality for managing the saved invoices.

**Live Demo Links**
-Frontend Application: [ADD YOUR DEPLOYED FRONTEND URL HERE]

-Backend API: [ADD YOUR DEPLOYED BACKEND URL HERE]

**Features**
-In-Browser PDF Viewer: Upload and view any PDF (≤25 MB) directly in the browser with page navigation controls.

-AI-Powered Data Extraction: Utilizes the Google Gemini API (gemini-1.5-flash-latest) to intelligently parse PDF text and extract structured invoice data.

-Editable Form: A dynamic and user-friendly form is pre-populated with the AI's extracted data, allowing for easy review and correction.

-Full CRUD Functionality: Create, Read, Update, and Delete saved invoice records.

-Searchable Invoice List: A dashboard view to see all saved invoices, with real-time search by Vendor Name or Invoice Number.

-Monorepo Architecture: Built with Turborepo and pnpm for efficient management of the separate frontend and backend applications.

**Tech Stack:**
-Monorepo: Turborepo + pnpm

-Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui

-Backend: Node.js, Express, TypeScript

-Database: MongoDB Atlas

-AI Service: Google Gemini API

-Deployment: Vercel

**Getting Started: Local Development**
Follow these instructions to set up and run the project on your local machine.

-Prerequisites
Node.js (v20.x LTS recommended)
pnpm (install with npm install -g pnpm)
A MongoDB database (local or a free cloud instance from MongoDB Atlas)
A Google Gemini API Key

-1. Setup
First, clone the repository and install the dependencies.
Bash

# Clone the repository
git clone [ADD YOUR GITHUB REPO URL HERE]

# Navigate into the project directory
cd pdf-invoice-extractor

# Install all dependencies for the entire monorepo
pnpm install

-2. Environment Variables
The backend API requires a .env file with your database connection string and AI API key.
Navigate to the API directory: cd apps/api
Create a new file named .env
Copy the content from the example below and paste it into your .env file, replacing the placeholder values with your actual credentials.
.env.example

Code snippet

MONGODB_URI=mongodb+srv://user:<password>@cluster.mongodb.net/database_name
GEMINI_API_KEY=YourGoogleGeminiApiKeyHere
3. How to Run Locally
You can run both the frontend and backend servers concurrently with a single command from the root of the project.

Bash

pnpm dev
The frontend Next.js app will be available at http://localhost:3000.

The backend Express API will be available at http://localhost:8000.

The frontend is configured with a proxy, so any API calls it makes to /api/... will be automatically forwarded to the backend on port 8000.

Brief API Documentation
The backend provides the following RESTful endpoints.

AI Extraction
Route: POST /api/extract

Description: Receives a PDF file, extracts its text, and sends it to the Gemini AI for data extraction.

Request Body: multipart/form-data with a single file field named invoice.

Successful Response (200):

JSON

{
  "vendor": {
    "name": "East Repair Inc.",
    "address": "1912 Harvest Lane, New York, NY 12210",
    "taxId": null
  },
  "invoice": {
    "number": "US-001",
    "date": "11/02/2019",
    "currency": "$",
    "total": 154.06,
    "subtotal": 145.00,
    "taxPercent": 6.25
  },
  "lineItems": [
    {
      "description": "Front and rear brake cables",
      "unitPrice": 100,
      "quantity": 1,
      "total": 100
    }
  ]
}
Invoice CRUD Operations
Route: POST /api/invoices

Description: Creates a new invoice record in the database.

Request Body: The full JSON object of the invoice data.

Successful Response (201): Returns the newly created invoice object, including its unique _id.

Route: GET /api/invoices

Description: Retrieves a list of all saved invoices. Supports searching via a query parameter.

Query Parameter: ?q=<search_term> (searches vendor name and invoice number).

Successful Response (200):

JSON

[
  {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "vendor": { "name": "East Repair Inc." },
    "invoice": { "number": "US-001" }
  }
]
Route: GET /api/invoices/:id

Description: Retrieves a single invoice by its unique ID.

Successful Response (200): Returns the full invoice object.

Route: PUT /api/invoices/:id

Description: Updates an existing invoice by its ID.

Request Body: A JSON object with the fields to be updated.

Successful Response (200): Returns the full, updated invoice object.

Route: DELETE /api/invoices/:id

Description: Deletes an invoice by its ID.

Successful Response (204): No content.
