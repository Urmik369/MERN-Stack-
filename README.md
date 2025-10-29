# StyleSpace - Modern E-commerce Platform

This is a Next.js e-commerce application built with Firebase and styled with ShadCN UI and Tailwind CSS. It features a customer-facing storefront and an admin dashboard for managing products and orders.

## Features

- **Storefront:** Browse products, filter by category, view product details, add items to a shopping cart, and complete the checkout process.
- **AI-Powered Recommendations:** Get product suggestions based on the items in your cart.
- **User Authentication:** Secure login and signup for customers and a dedicated admin user.
- **Admin Dashboard:** A separate interface for the store administrator to manage products (CRUD operations) and view all customer orders.
- **Firebase Integration:** Uses Firestore for the database and Firebase Authentication for user management.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## Local Development Setup

Follow these steps to get your project running on your local machine.

### 1. Clone the Repository

First, clone this repository to your local machine.

```bash
git clone <your-repository-url>
cd <repository-folder-name>
```

### 2. Install Dependencies

Install the necessary Node.js packages using npm.

```bash
npm install
```

### 3. Firebase Configuration

This project is pre-configured to connect to a specific Firebase project, with the configuration stored in `src/firebase/config.ts`. The backend is already set up and ready to use. No additional Firebase setup is required to run the app as is.

**Optional: Connecting to Your Own Firebase Project**

If you wish to connect this application to your own separate Firebase project, you will need to:
1. Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore** and **Firebase Authentication** (with the Email/Password provider).
3. In your new project's settings, create a new Web App to get your Firebase configuration object.
4. Replace the contents of `src/firebase/config.ts` with the configuration object from your new project.

### 4. Firestore Index Setup (Required)

The admin panel requires a specific Firestore index to display all customer orders. You must create this manually.

1.  **Open the Firebase Console** and navigate to your project.
2.  Go to **Build > Firestore Database**.
3.  Select the **Indexes** tab.
4.  Click **Create Index** and configure it as follows:
    *   **Collection ID:** `orders`
    *   **Fields to Index:**
        *   Field 1: `orderDate` | **Descending**
    *   **Query Scope:** Select **Collection group**
5.  Click **Create**.

> **Note:** The index can take a few minutes to build. The Admin Orders page will not work until the index is fully enabled.

### 5. Run the Development Server

Once the setup is complete, you can start the local development server.

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

---

## Accessing the Admin Panel

To access the admin features, you need to log in with the designated admin account:

-   **Email:** `admin@stylespace.com`
-   **Password:** 'password123'.

After logging in with these credentials, you will be automatically redirected to the admin dashboard.
