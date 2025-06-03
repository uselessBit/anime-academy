import { useState, useEffect } from 'react'
import { CommentService } from '../api/CommentService'
import { useUser } from '../contexts/UserContext.jsx'

const findCommentInTree = (comments, commentId) => {
    for (const comment of comments) {
        if (comment.id === commentId) return comment
        if (comment.replies && comment.replies.length > 0) {
            const found = findCommentInTree(comment.replies, commentId)
            if (found) return found
        }
    }
    return null
}

export const useComments = (animeId) => {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user } = useUser()

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
            const level = parentId ? 1 : 0

            const newComment = {
                user_id: user.id,
                anime_id: animeId,
                comment: content,
                parent_id: parentId,
                level: level,
                has_reply: false,
                created_at: new Date().toISOString(),
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
                setComments((prev) => {
                    const updateComment = (commentList) =>
                        commentList.map((comment) => {
                            if (comment.id === parentId) {
                                return {
                                    ...comment,
                                    replies: [
                                        ...comment.replies,
                                        createdComment,
                                    ],
                                    has_reply: true,
                                }
                            }
                            if (comment.replies && comment.replies.length > 0) {
                                return {
                                    ...comment,
                                    replies: updateComment(comment.replies),
                                }
                            }
                            return comment
                        })

                    return updateComment(prev)
                })
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
            const response = await CommentService.getCommentReplies(commentId)

            const replies = response.replies || []

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
