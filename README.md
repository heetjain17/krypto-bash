# Krypto-Bash CRYPTO-TRACKING WEB APP

Krypto-Bash is a feature-rich web application that provides real-time tracking of cryptocurrency data. It allows users to bookmark their favorite coins, compare different cryptocurrencies, and stay updated with the latest market trends. The application is built with a modern tech stack, ensuring a seamless and responsive user experience.

### Live Demo 🚀

You can access the live version of the application here: [https://krypto-bash.vercel.app/](https://krypto-bash.vercel.app/)

---

## **Features** ✨

- **Real-Time Crypto Tracking**: Get up-to-date information on a wide range of cryptocurrencies.
- **Bookmarking**: Save your favorite coins for quick and easy access.
- **Coin Comparison**: Compare different cryptocurrencies side-by-side to make informed decisions.
- **User Authentication**: Secure user authentication powered by Clerk.

---

## **Technologies Used** 💻

- **React**: A JavaScript library for building user interfaces.
- **Clerk**: For secure and easy-to-implement user authentication.
- **Supabase**: An open-source Firebase alternative for the database.
- **Vercel**: For deployment.

---

## **Setup and Installation** ⚙️

To get a local copy up and running, follow these simple steps.

### **Prerequisites**

- **Node.js**: Make sure you have Node.js installed. You can download it from [here](https://nodejs.org/).
- **npm** or **yarn**: A package manager for JavaScript.

### **Installation**

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/heetjain17/krypto-bash.git](https://github.com/heetjain17/krypto-bash.git)
    ```
2.  **Navigate to the project directory**
    ```sh
    cd krypto-bash
    ```
3.  **Install NPM packages**
    ```sh
    npm install
    ```
    or
    ```sh
    yarn install
    ```

---

## **Environment Variables** 🔑

To run the application, you need to add the following environment variables to a `.env` file in the root of your project:

VITE_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_KEY=YOUR_SUPABASE_KEY

You can get these keys from your [Clerk](https://clerk.com/) and [Supabase](https://supabase.com/) dashboards.

---

## **Available Scripts** 📜

In the project directory, you can run:

### `npm run dev` or `yarn dev`

Runs the app in development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build` or `yarn build`

Builds the app for production to the `dist` folder.
