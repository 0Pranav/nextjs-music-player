"use client"

import useAuthModal from "@/hooks/useAuthModal"
import { useUser } from "@/hooks/useUser"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"

type LikeButtonProps = {
    songId: string
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
    const router = useRouter()
    const { supabaseClient } = useSessionContext()
    const authModal = useAuthModal()
    const { user } = useUser()

    const [isLiked, setIsLiked] = useState(false)

    useEffect(() => {
        if (!user?.id) {
            return
        }

        const fetchData = async () => {
            const { data, error } = await supabaseClient
                .from('liked_songs')
                .select("*")
                .eq('used_id', user?.id)
                .eq('song_id', songId)
                .single()

            if (error) {
                toast.error("Error fetching liked songs:")
                return
            }

            if (data) {
                setIsLiked(true)
            }

        }
    }, [songId, supabaseClient, user?.id])

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart

    const handleLike = async () => {
        if (!user) {
            return authModal.onOpen()
        }

        if (isLiked) {
            const { error } = await supabaseClient
                .from('liked_songs')
                .delete()
                .eq('used_id', user?.id)
                .eq('song_id', songId)

            if (error) {
                toast.error("Error disliking songs:")
                return
            } else {
                setIsLiked(false)
            }

        } else {
            const { error } = await supabaseClient
                .from('liked_songs')
                .insert({
                    'used_id': user?.id,
                    'song_id': songId
                })

            if (error) {
                toast.error("Error liking songs:")
                return
            } else {
                setIsLiked(false)
            }
        }
        router.refresh()
    }

    return <button className="hover:opacity-75 transition" onClick={handleLike}>
        <Icon color={isLiked ? "#22c55e" : "white"} size={25} />
    </button>
}

export default LikeButton
