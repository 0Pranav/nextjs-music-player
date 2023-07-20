import './globals.css'
import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import { Sidebar } from '@/components/Sidebar'
import SupabaseProvider from '@/providers/SupabaseProvider'
import UserProvider from '@/providers/UserProvider'
import ModalProvider from '@/providers/ModalProvider'
import ToasterProvider from '@/components/ToasterProvider'
import getSongsByUserID from '@/actions/getSongsByUserID'

const font = Figtree({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'NextJS Music Player',
    description: 'Listen to Music!',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const userSongs = await getSongsByUserID()
    return (
        <html lang="en">
            <body className={font.className}>
            <ToasterProvider />
                <SupabaseProvider>
                    <UserProvider>
                        <ModalProvider />
                        <Sidebar songs={userSongs}>
                            {children}
                        </Sidebar>
                    </UserProvider>
                </SupabaseProvider>
            </body>
        </html>
    )
}
