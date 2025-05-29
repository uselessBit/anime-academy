import { useState, useEffect, useCallback } from 'react'
import { RatingService } from '../api/RatingService'

export const useRating = (animeId, userId) => {
    const [ratingData, setRatingData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchRating = useCallback(async () => {
        if (!animeId || !userId) return

        setLoading(true)
        try {
            const data = await RatingService.getRating(animeId, userId)
            setRatingData(data)
            setError(null)
        } catch (err) {
            setError(err.message || 'Ошибка загрузки рейтинга')
        } finally {
            setLoading(false)
        }
    }, [animeId, userId])

    useEffect(() => {
        if (userId) fetchRating()
    }, [fetchRating, userId])

    const rateAnime = async (ratingValue) => {
        if (!userId) return

        try {
            let result
            if (ratingData) {
                result = await RatingService.updateRating(
                    ratingData.id,
                    ratingValue
                )
            } else {
                result = await RatingService.createRating({
                    user_id: userId,
                    anime_id: animeId,
                    rating: ratingValue,
                    created_at: new Date().toISOString(),
                })
            }

            setRatingData({
                ...(ratingData || {}),
                id: result.id,
                rating: ratingValue,
            })
            return true
        } catch (err) {
            setError(err.message || 'Ошибка сохранения оценки')
            return false
        }
    }

    const deleteRating = async () => {
        if (!ratingData?.id) return false

        try {
            await RatingService.deleteRating(ratingData.id)
            setRatingData(null)
            return true
        } catch (err) {
            setError(err.message || 'Ошибка удаления оценки')
            return false
        }
    }

    return {
        rating: ratingData?.rating || null,
        ratingId: ratingData?.id || null,
        loading,
        error,
        rateAnime,
        deleteRating,
        refetch: fetchRating,
    }
}
