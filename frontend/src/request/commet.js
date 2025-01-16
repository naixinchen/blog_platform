import apiClient from "./apiClient";
export default {
    get: slug => apiClient.get(`/comments/${slug}`),
    create: (slug, body) => apiClient.post(`/comments/${slug}`, { comment: { body } }),
    delete: (slug, id) => apiClient.delete(`/comments/${slug}/${id}`)
}