import axios from 'axios'
import API_BASE_URL from '../config'

export const CommentService = {
    createComment: async (commentData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}api/v1/crud/comment`,
                commentData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        accept: 'application/json',
                    },
                    withCredentials: true,
                }
            )
            return response.data
        } catch (error) {
            throw new Error(
                error.response?.data?.detail || 'Ошибка создания комментария'
            )
        }
    },

    getRootComments: async (animeId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}api/v1/crud/comment/anime/${animeId}`
            )
            return response.data
        } catch (error) {
            throw new Error('Ошибка загрузки комментариев')
        }
    },

    getCommentReplies: async (commentId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}api/v1/crud/comment_tree`,
                {
                    params: { comment_id: commentId },
                }
            )

            return response.data
        } catch (error) {
            throw new Error('Ошибка загрузки ответов')
        }
    },
}
