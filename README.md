# ☁️ CloudPad: Secure React Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

**Live Demo:** [Insert your Vercel URL here]
**Backend API Repository:** [cloud-notepad-backend](https://github.com/raunakranjann/cloud-notepad-backend)

This is the frontend client for **CloudPad**, a production-grade secure note-taking application. It is a single-page application (SPA) built with React and Vite, designed to consume a secure Spring Boot REST API. 

## ✨ Key Frontend Features

* **State Management & Routing:** Utilizes React Hooks (`useState`, `useEffect`) and React Router DOM for seamless, instantaneous page transitions without reloads.
* **Client-Side Auth Guard:** Implements Route protection (`RequireAuth`) to intercept unauthorized users and redirect them to the login screen before rendering sensitive components.
* **Stateless JWT Handling:** Securely captures and stores JSON Web Tokens (JWT) in local storage, automatically attaching them via Axios interceptors to all outbound HTTP requests.
* **Dynamic Role Rendering:** Decodes JWT payloads on the client side to dynamically render UI elements (like the Admin Dashboard) based on the user's cryptographic role without requiring extra network calls.
* **Edge Deployment:** Hosted on Vercel's global edge network for lightning-fast asset delivery.

## 🚀 Local Setup

To run this React application locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/raunakranjann/cloud-notepad-frontend.git](https://github.com/raunakranjann/cloud-notepad-frontend.git)
   cd cloud-notepad-frontend