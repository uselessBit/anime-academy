import React, { useState } from 'react'
import { useComments } from '../../hooks/useComments'
import { useUser } from '../../contexts/UserContext.jsx'
import '../../styles/animePage/CommentsSection.css'

const Comment = ({ comment, onReply, onShowReplies, repliesLoaded }) => {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyContent, setReplyContent] = useState('')
    const [showReplies, setShowReplies] = useState(false)
    const { user: currentUser } = useUser()

    const { user: commentUser, loading: userLoading } = useUser(comment.user_id)

    const handleReplySubmit = () => {
        onReply(replyContent, comment.id)
        setReplyContent('')
        setShowReplyForm(false)
    }

    const canReply = comment.level === 0

    const handleShowReplies = () => {
        if (!comment.repliesLoaded) {
            onShowReplies(comment.id)
        }
        setShowReplies(true)
    }

    const handleHideReplies = () => {
        setShowReplies(false)
    }

    return (
        <div className={`comment level-${comment.level}`}>
            <div className="comment-header">
                <div className="user-avatar">
                    {commentUser?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-info">
                    <div className="username">
                        {userLoading
                            ? 'Загрузка...'
                            : commentUser?.username ||
                              'Неизвестный пользователь'}
                    </div>
                    <div className="date">
                        {new Date(comment.created_at).toLocaleString('ru-RU', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </div>
                </div>
            </div>
            <div className="comment-content">{comment.comment}</div>

            <div className="comment-actions">
                {currentUser && canReply && !showReplyForm && (
                    <button
                        className="reply-btn"
                        onClick={() => setShowReplyForm(true)}
                    >
                        Ответить
                    </button>
                )}

                {comment.has_reply && canReply && (
                    <>
                        {!showReplies ? (
                            <button
                                className="show-replies-btn"
                                onClick={handleShowReplies}
                            >
                                Показать ответы
                            </button>
                        ) : (
                            <button
                                className="hide-replies-btn"
                                onClick={handleHideReplies}
                            >
                                Скрыть ответы
                            </button>
                        )}
                    </>
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
                        <button
                            className="standard-input button"
                            onClick={() => setShowReplyForm(false)}
                        >
                            Отмена
                        </button>
                        <button
                            className="standard-input button active"
                            onClick={handleReplySubmit}
                        >
                            Отправить
                        </button>
                    </div>
                </div>
            )}

            {showReplies &&
                comment.repliesLoaded &&
                comment.replies.length > 0 && (
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
    const { user } = useUser()
    const { comments, loading, error, addComment, loadReplies } =
        useComments(animeId)

    const handleAddComment = async () => {
        if (commentContent.trim()) {
            await addComment(commentContent)
            setCommentContent('')
        }
    }

    return (
        <>
            {user && (
                <div className="container anime-container" id="player">
                    <div className="margin-container">
                        <div className="comments-section">
                            <h2>Комментарии</h2>

                            {user && (
                                <div className="new-comment">
                                    <textarea
                                        value={commentContent}
                                        onChange={(e) =>
                                            setCommentContent(e.target.value)
                                        }
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

                            {loading && (
                                <div className="loading">
                                    Загрузка комментариев...
                                </div>
                            )}

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
                    </div>
                </div>
            )}
        </>
    )
}
