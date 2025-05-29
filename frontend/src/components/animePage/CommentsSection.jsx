import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useComments } from '../../hooks/useComments'
import '../../styles/animePage/CommentsSection.css'

const Comment = ({ comment, onReply, onShowReplies, repliesLoaded }) => {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyContent, setReplyContent] = useState('')
    const { user } = useAuth()

    const handleReplySubmit = () => {
        onReply(replyContent, comment.id)
        setReplyContent('')
        setShowReplyForm(false)
    }

    return (
        <div className={`comment level-${comment.level}`}>
            <div className="comment-header">
                <div className="user-avatar">
                    {comment.user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                    <span className="username">{comment.user?.username}</span>
                    <span className="date">
                        {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>
            <div className="comment-content">{comment.comment}</div>

            <div className="comment-actions">
                {user && !showReplyForm && (
                    <button
                        className="reply-btn"
                        onClick={() => setShowReplyForm(true)}
                    >
                        Ответить
                    </button>
                )}

                {comment.replies_count > 0 && !comment.repliesLoaded && (
                    <button
                        className="show-replies-btn"
                        onClick={() => onShowReplies(comment.id)}
                    >
                        Показать ответы ({comment.replies_count})
                    </button>
                )}
            </div>

            {showReplyForm && (
                <div className="reply-form">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Ваш ответ..."
                    />
                    <div className="form-actions">
                        <button onClick={() => setShowReplyForm(false)}>
                            Отмена
                        </button>
                        <button onClick={handleReplySubmit}>Отправить</button>
                    </div>
                </div>
            )}

            {comment.repliesLoaded && comment.replies.length > 0 && (
                <div className="replies">
                    {comment.replies.map((reply) => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            onShowReplies={onShowReplies}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export const CommentsSection = ({ animeId }) => {
    const [commentContent, setCommentContent] = useState('')
    const { user } = useAuth()
    const { comments, loading, error, addComment, loadReplies } =
        useComments(animeId)

    const handleAddComment = async () => {
        if (commentContent.trim()) {
            await addComment(commentContent)
            setCommentContent('')
        }
    }

    return (
        <div className="comments-section">
            <h2>Комментарии</h2>

            {user && (
                <div className="new-comment">
                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Ваш комментарий..."
                    />
                    <button
                        onClick={handleAddComment}
                        className="standard-input button"
                    >
                        Отправить
                    </button>
                </div>
            )}

            {loading && <div className="loading">Загрузка комментариев...</div>}

            <div className="comments-list">
                {comments.map((comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        onReply={addComment}
                        onShowReplies={loadReplies}
                        repliesLoaded={comment.repliesLoaded}
                    />
                ))}
            </div>
        </div>
    )
}
