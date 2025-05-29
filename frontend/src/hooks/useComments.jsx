import { useState, useEffect } from 'react'
import { CommentService } from '../api/CommentService'
import { useAuth } from './useAuth.jsx'

export const useComments = (animeId) => {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user } = useAuth()

    const loadComments = async () => {
        try {
            setLoading(true)
            const data = await CommentService.getRootComments(animeId)
            const initializedComments = data.map((comment) => ({
                ...comment,
                replies: [],
                repliesLoaded: false,
            }))
            setComments(initializedComments)
            setError(null)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const addComment = async (content, parentId = null) => {
        try {
            const newComment = {
                user_id: user.id,
                anime_id: animeId,
                comment: content,
                parent_id: parentId,
            }

            const createdComment =
                await CommentService.createComment(newComment)

            createdComment.user = {
                username: user.username,
                id: user.id,
            }

            createdComment.replies = []
            createdComment.repliesLoaded = false

            if (parentId) {
                setComments((prev) =>
                    prev.map((comment) => {
                        if (comment.id === parentId) {
                            const newReplies = [
                                ...comment.replies,
                                createdComment,
                            ]
                            return {
                                ...comment,
                                replies: newReplies,
                                replies_count: (comment.replies_count || 0) + 1,
                            }
                        }
                        return comment
                    })
                )
            } else {
                setComments((prev) => [...prev, createdComment])
            }

            return true
        } catch (err) {
            setError(err.message)
            return false
        }
    }

    const loadReplies = async (commentId) => {
        try {
            const replies = await CommentService.getCommentReplies(commentId)

            const initializedReplies = replies.map((reply) => ({
                ...reply,
                replies: [],
                repliesLoaded: false,
            }))

            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === commentId
                        ? {
                              ...comment,
                              replies: initializedReplies,
                              repliesLoaded: true,
                          }
                        : comment
                )
            )
        } catch (err) {
            setError(err.message)
        }
    }

    useEffect(() => {
        if (animeId) loadComments()
    }, [animeId])

    return { comments, loading, error, addComment, loadReplies }
}
