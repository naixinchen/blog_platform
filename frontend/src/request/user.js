import apiClient from "./apiClient";

export default {
    regist: (user) => apiClient.post("/users", { user }),
    login: (email, password) => apiClient.post("/users/login", { user: { email, password } }),
    get: (username) => apiClient.get("/users/" + username),
    update: (user) => apiClient.put("/users", { user }),
    follow: username => apiClient.post('/follow/' + username),
    unfollow: username => apiClient.delete('/follow/' + username)
}