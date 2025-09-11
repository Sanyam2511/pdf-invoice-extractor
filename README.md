# PDF Invoice Data Extractor

A full-stack web application designed to streamline invoice processing. Users can upload a PDF invoice, view it in-browser, and use the Google Gemini AI to automatically extract key information. The extracted data is then populated into a fully editable form, allowing for corrections before being saved to a MongoDB database. The application features full CRUD (Create, Read, Update, Delete) functionality for managing saved invoices.

---

## Live Demo

* **Frontend Application:** [Frontend Site](https://pdf-invoice-extractor-web.vercel.app/)
* **Backend API:** [Backend Deployment](https://pdf-invoice-extractor-api.vercel.app/)

## Screenshots
* **Extraction Of PDF and Split Layout:**
<img width="2174" height="2432" alt="pdf-invoice-extractor-web vercel app_" src="https://github.com/user-attachments/assets/0473f7b8-eee8-4d5a-a75b-26bf587f68d0" />

* **Saving the Extracted Invoice:**
<img width="2326" height="812" alt="image" src="https://github.com/user-attachments/assets/1a275a5e-24e7-422e-b297-817407d33162" />

* **Editing and Updating the saved Invoice:**
<img width="2326" height="812" alt="image" src="https://github.com/user-attachments/assets/f1399f44-b89e-4c29-a50a-a5b2f4f4f1b8" />

* **Deleting the Invoice:**
<img width="2274" height="648" alt="image" src="https://github.com/user-attachments/assets/9454408f-4602-497b-91da-9bb86e7f7af8" />
<img width="2373" height="1258" alt="image" src="https://github.com/user-attachments/assets/a2ae9f14-75aa-4674-b6e6-58db1e6fc4b0" />

## Features

* **In-Browser PDF Viewer:** Upload and view any PDF with multi-page navigation.
* **AI-Powered Data Extraction:** Utilizes the Google Gemini API to intelligently parse PDF text and extract structured invoice data.
* **Fully Editable Form:** A dynamic and user-friendly form is pre-populated with the AI's extracted data, allowing for easy review, correction, and addition/removal of line items.
* **Full CRUD Functionality:** Create, Read, Update, and Delete saved invoice records in the database.
* **Searchable Invoice List:** A central dashboard to view all saved invoices, with real-time search by Vendor Name or Invoice Number.
* **Monorepo Architecture:** Built with Turborepo for efficient management of the separate frontend and backend applications.

## Tech Stack

* **Monorepo:** Turborepo + pnpm
* **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
* **Backend:** Node.js, Express, TypeScript
* **Database:** MongoDB Atlas
* **AI Service:** Google Gemini API
* **Deployment:** Vercel

---

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

* Node.js v20.x (LTS)
* pnpm (install via `npm install -g pnpm`)
* Git

### 1. Setup

First, clone the repository and install the dependencies.

```bash
# Clone the repository
git clone [ADD YOUR GITHUB REPO URL HERE]

# Navigate into the project directory
cd pdf-invoice-extractor

# Install all dependencies for the entire monorepo
pnpm install
```

### 2. Environment Variables

The backend API requires a `.env` file with your database connection string and AI API key.

1. Navigate to the API directory: `cd apps/api`
2. Create a new file named `.env`
3. Add the following variables, replacing the placeholders with your actual credentials.

```env
# /apps/api/.env
MONGODB_URI=mongodb+srv://user:<password>@cluster.mongodb.net/database_name
GEMINI_API_KEY=YourGoogleGeminiApiKeyHere
```

### 3. Running the Development Server

You can run both the frontend and backend servers concurrently with a single command from the **root** of the project.

```bash
pnpm dev
```

* **Frontend:** `http://localhost:3000`
* **Backend:** `http://localhost:8000`

---

## API Documentation

The backend provides the following RESTful endpoints.

### AI Extraction

* **Endpoint:** `POST /api/extract`
* **Description:** Receives a PDF file, extracts its text, and returns AI-parsed JSON data.
* **Request Body:** `multipart/form-data` with a single file field named `invoice`.
* **Successful Response (200):** A JSON object with the extracted invoice data.

```json
{
  "vendor": {
    "name": "East Repair Inc.",
    "address": "1912 Harvest Lane, New York, NY 12210"
  },
  "invoice": {
    "number": "US-001",
    "date": "11/02/2019",
    "total": 154.06
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
```

### Invoice CRUD Endpoints

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/invoices` | `POST` | Creates a new invoice record from JSON data. |
| `/api/invoices` | `GET` | Retrieves a list of all invoices. Supports search via `?q=`. |
| `/api/invoices/:id` | `GET` | Retrieves a single invoice by its unique ID. |
| `/api/invoices/:id` | `PUT` | Updates an existing invoice by its ID. |
| `/api/invoices/:id` | `DELETE` | Deletes an invoice by its ID. |
