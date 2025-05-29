import { useState, useEffect } from 'react'
import { StatusService } from '../api/StatusService'

export const useStatus = (animeId, userId) => {
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!animeId || !userId) {
            setLoading(false)
            return
        }

        const fetchStatus = async () => {
            try {
                const statusData = await StatusService.getUserStatus(
                    animeId,
                    userId
                )
                setStatus(statusData)
            } catch (error) {
                console.error('Error fetching status:', error)
                setStatus(null)
            } finally {
                setLoading(false)
            }
        }

        fetchStatus()
    }, [animeId, userId])

    const handleStatusChange = async (newStatus) => {
        if (!userId || !animeId) return

        try {
            // Удаление статуса
            if (!newStatus && status) {
                await StatusService.deleteStatus(status.id)
                setStatus(null)
                return
            }

            // Обновление существующего статуса
            if (status) {
                await StatusService.updateStatus(status.id, {
                    ...status,
                    status: newStatus,
                })
                setStatus({ ...status, status: newStatus })
                return
            }

            // Создание нового статуса
            const newStatusData = {
                user_id: userId,
                anime_id: animeId,
                status: newStatus,
                created_at: new Date().toISOString(),
            }
            const createdStatus =
                await StatusService.createStatus(newStatusData)
            setStatus(createdStatus)
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    return {
        status,
        loading,
        handleStatusChange,
    }
}
