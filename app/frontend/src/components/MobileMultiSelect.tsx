import React, { useState } from "react"

interface Option {
    id: number
}

interface Props<T extends Option> {
    label: string
    options: T[]
    selected: T[]
    onChange: (selected: T[]) => void
    getOptionLabel: (option: T) => string
    searchPlaceholder?: string
}

// Search box filtering and a scrollable checkbox
// list for mobile
function MobileMultiSelect<T extends Option>({
    label,
    options,
    selected,
    onChange,
    getOptionLabel,
    searchPlaceholder = "Search...",
}: Props<T>) {
    const [search, setSearch] = useState("")

    const filteredOptions = search
        ? options.filter((option) =>
              getOptionLabel(option)
                  .toLowerCase()
                  .includes(search.toLowerCase()),
          )
        : options

    const isSelected = (option: T) => selected.some((s) => s.id === option.id)

    const toggle = (option: T) => {
        onChange(
            isSelected(option)
                ? selected.filter((s) => s.id !== option.id)
                : [...selected, option],
        )
    }

    return (
        <div className="mt-3 md:hidden">
            <span className="block mb-1.5 text-[1.3rem] font-semibold text-gray-300 uppercase tracking-wider">
                {label}
            </span>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-[#3f4a58] border border-gray-500 rounded px-3 py-2 text-[1.4rem] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
            <div className="mt-2 max-h-[20rem] overflow-y-auto rounded border border-gray-600">
                {filteredOptions.length === 0 ? (
                    <div className="px-3 py-2 text-[1.3rem] text-gray-400">
                        No matches.
                    </div>
                ) : (
                    filteredOptions.map((option) => (
                        <label
                            key={option.id}
                            className="flex items-center gap-2.5 px-3 py-2 text-[1.4rem] text-white cursor-pointer hover:bg-white/5"
                        >
                            <input
                                type="checkbox"
                                checked={isSelected(option)}
                                onChange={() => toggle(option)}
                                className="w-[1.8rem] h-[1.8rem] shrink-0 accent-brand"
                            />
                            <span className="truncate">
                                {getOptionLabel(option)}
                            </span>
                        </label>
                    ))
                )}
            </div>
        </div>
    )
}

export default MobileMultiSelect
