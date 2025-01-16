import apiClient from "./apiClient";
export default {
    getAll:()=>apiClient.get("/tags")
}