import { create } from "zustand"

interface PlayerStore {
    ids: string[]
    active_id?: string
    setId: (id: string) => void
    setIds: (id: string[]) => void
}

const usePlayer = create<PlayerStore>((set) => ({
    ids: [],
    active_id: undefined,
    setId: (id: string) => set({ active_id: id }),
    setIds: (ids: string[]) => set({ ids: ids }),
    reset: () => set({ ids: [], active_id: undefined })
}))

export default usePlayer
