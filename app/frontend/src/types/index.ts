export type Book = {
    id: number
    title?: string
    authors?: number[]
    authors_data?: Author[]
    artists?: number[]
    artists_data?: Artist[]
    description?: string
    thumbnail?: string
    page_count?: number
    volume_number?: number
    publisher?: number
    publisher_data?: Publisher
    characters?: number[]
    characters_data?: Character[]
    team?: number
    team_data?: Team
    thumbnail_url?: string
    marvel_id?: number
    price?: number
    isbn?: string
    format?: number
    format_data?: Format
    sub_category?: number
    sub_category_data?: SubCategory
    is_wishlisted?: boolean
    is_owned?: boolean
}

export type Character = {
    id: number
    name: string
    publisher: number
}

export type Publisher = {
    id: number
    name: string
}

export type Author = {
    id: number
    name: string
}

export type Artist = {
    id: number
    name: string
}

export type Format = {
    id: number
    name: string
    abbreviation: string
}

export type SubCategory = {
    id: number
    name: string
}

export type Team = {
    id: number
    name: string
    characters: number[]
    character_names: string[]
}
