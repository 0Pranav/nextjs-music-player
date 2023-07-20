import useUploadModal from "@/hooks/useUploadModal"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { useState } from "react"
import Input from "./Input"
import Modal from "./Modal"
import Button from "./Button"
import { toast } from "react-hot-toast"
import { useUser } from "@/hooks/useUser"
import uniqid from "uniqid"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"

const UploadModal = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useUser()
    const supabaseClient = useSupabaseClient()
    const router = useRouter()

    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            author: "",
            title: "",
            song: null,
            image: null
        }
    })

    const uploadModal = useUploadModal()

    const onChange = (open: boolean) => {
        if (!open) {
            // reset the form
            reset()
            uploadModal.onClose()
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        // Upload to subabase
        try {
            setIsLoading(true)

            const imageFile = values.image?.[0]
            const songFile = values.song?.[0]

            if (!imageFile || !songFile || !user) {
                toast.error("Missing fields")
                return
            }

            const uniqueID = uniqid()

            const { data: songData, error: songError } = await supabaseClient
                .storage
                .from('songs')
                .upload(`song-${values.title}-${uniqueID}`, songFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (songError) {
                setIsLoading(false);
                return toast.error("Error Uploading Song");
            }


            const { data: imageData, error: imageError } = await supabaseClient
                .storage
                .from('images')
                .upload(`image-${values.title}-${uniqueID}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (imageError) {
                setIsLoading(false);
                return toast.error("Error Uploading Image");
            }

            const { error: supabaseError } = await supabaseClient
                .from('songs')
                .insert({
                    user_id: user.id,
                    title: values.title,
                    author: values.author,
                    image_path: imageData.path,
                    songs_path: songData.path

                })

            if (supabaseError) {
                setIsLoading(false)
                toast.error(supabaseError.message)
            }

            router.refresh()
            setIsLoading(false)
            toast.success("Song Created!")

        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <Modal
            title="Upload A Song"
            description="Upload an MP3 File"
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4"
            >
                <Input
                    id="title"
                    disabled={isLoading}
                    placeholder="Song Title"
                    {...register('title', { required: true })}
                />

                <Input
                    id="author"
                    disabled={isLoading}
                    placeholder="Song Author"
                    {...register('author', { required: true })}
                />
                <div>
                    <div className="pb-1">
                        Select a song file
                    </div>

                    <Input
                        id="song"
                        type="file"
                        disabled={isLoading}
                        accept=".mp3"
                        {...register('song', { required: true })}
                    />
                </div>
                <div>
                    <div className="pb-1">
                        Select a song image
                    </div>

                    <Input
                        id="image"
                        type="file"
                        disabled={isLoading}
                        accept="image/*"
                        {...register('image', { required: true })}
                    />
                </div>
                <Button disabled={isLoading} type="submit">
                    Create
                </Button>
            </form>
        </Modal>
    )
}

export default UploadModal
