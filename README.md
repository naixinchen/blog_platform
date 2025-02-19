# **Blog Platform**

## **Project Description**
This project is a multi-user blogging platform built with **React** and **Vite**. It adopts a front-end and back-end decoupled architecture to support various features, including user registration, login, profile management, and article publishing and interaction. The primary goal of this project is to facilitate resource sharing and knowledge dissemination.

## **Technologies Used**
- **React**: A JavaScript library for building user interfaces.  
- **Ant Design**: A UI library for creating elegant and consistent interfaces.  
- **React-Router**: For routing and navigation in the application.  
- **React-Redux**: For managing application state.  
- **Fetch**: For asynchronous API requests.

## **Project Highlights**
- **Login State Synchronization**: Resolved issues where login status was not updated in real-time by optimizing React-Redux state synchronization mechanisms.  
- **Persistent User Settings**: Fixed issues with persistent storage of user information on the settings page.  
- **Lifecycle Management**: Improved component lifecycle management to ensure a stable user experience.  
- **Data Refresh Optimization**: Optimized the data refresh flow for the user’s personal homepage by leveraging React’s `useEffect` hook.

## **Installation**
### **Prerequisites**
- Node.js (v16+ recommended)
- A back-end server for handling user data and API requests.

### **Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/naixinchen/blog_platform.git
   cd blog_platform
   ```
2. Start the service:
   ```bash
   cd backend
   pnpm install
   pnpm start
   ```
3. Start the clint:
   ```bash
   cd ..
   cd frontend
   pnpm install
   pnpm run dev
   ```
4. Open the application in your browser at `http://localhost:5173`.

## **Usage**
1. **Registration and Login**: Create a user account or log in with an existing account.  
2. **Profile Management**: Update personal details on the settings page.  
3. **Article Publishing**: Create and publish blog posts.  
4. **Interaction**: Comment and interact with other users’ articles.

## **Contributing**
Contributions are welcome!  
- Fork the repository.  
- Create a feature branch:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- Commit your changes:
  ```bash
  git commit -m "Describe your changes"
  ```
- Push your branch and open a pull request.

## **License**
This project is licensed under the [MIT License](LICENSE).

## **Contact**
If you have any questions or suggestions, feel free to open an issue or contact the project owner.
