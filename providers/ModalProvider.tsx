"use client"

import AuthModal from "@/components/AuthModal"
import Modal from "@/components/Modal"
import UploadModal from "@/components/UploadModal"
import { useEffect, useState } from "react"

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    // Prevent hydration errors to be caused by the Modal
    useEffect(() => {
        // ensure client side renderring 
        setIsMounted(true)
    })

    // Return null if server side rendering 
    if (!isMounted) {
        return null;
    }

    // return modal when rendering on client
    return (
        <>
            <AuthModal />
            <UploadModal />
        </>
    )
}

export default ModalProvider
