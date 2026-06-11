import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      count: 1,
      inc: () => set((state: { count: number }) => ({ count: state.count + 1 })),
    }),
    {
      name: 'counter-storage', // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

export default useStore