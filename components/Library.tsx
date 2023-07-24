"use client"

import { TbPlaylist } from "react-icons/tb"
import { AiOutlinePlus } from "react-icons/ai"
import useAuthModal from "@/hooks/useAuthModal"
import { useUser } from "@/hooks/useUser"
import useUploadModal from "@/hooks/useUploadModal"
import MediaItem from "./MediaItem"
import { Song } from "@/types"
import useOnPlay from "@/hooks/useOnPlay"

interface LibraryProps {
    songs: Song[]
}

const Library: React.FC<LibraryProps> = ({ songs }) => {
    const authModal = useAuthModal()
    const uploadModal = useUploadModal()
    const onPlay = useOnPlay(songs)
    const { user } = useUser()

    const onClick = () => {
        if (!user) {
            return authModal.onOpen()
        }
        return uploadModal.onOpen()
        // Check subscription
    }
    return (<div className="flex flex-col">
        <div className="flex items-center justify-between py-5 px-4">
            <div className="inline-flex items-center gap-x-2">
                <TbPlaylist className="text-neutral-400" size={24} />
                <p className="text-neutral-400 font-medium text-md"> Your Library </p>
            </div>
            <AiOutlinePlus onClick={onClick} size={20} className="text-neutral-400 cursor-pointer hover:text-white" />
        </div>
        <div className="flex flex-col gap-y-2 mt-4 px-3">
            {songs.map(song => <MediaItem onClick={(id: string) => onPlay(id)} key={song.id} data={song} />)}
        </div>
    </div >)
}

export default Library
