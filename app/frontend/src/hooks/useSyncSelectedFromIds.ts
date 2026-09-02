import { useEffect } from "react"

interface WithId {
    id: number
}
export function useSyncSelectedFromIds<T extends WithId>(
    ids: number[] | undefined,
    options: T[],
    selected: T[],
    setSelected: (next: T[]) => void,
) {
    useEffect(() => {
        if (!options.length) return

        const wantedIds = ids ?? []
        const currentIds = selected.map((item) => item.id)
        const inSync =
            wantedIds.length === currentIds.length &&
            wantedIds.every((id) => currentIds.includes(id))
        if (inSync) return

        setSelected(options.filter((option) => wantedIds.includes(option.id)))
    }, [ids, options, selected, setSelected])
}
