export type Book = {
    id: number
    title?: string
    authors?: number[]
    author_names?: string[]
    artists?: number[]
    artist_names?: string[]
    description?: string
    thumbnail?: string
    page_count?: number
    volume_number?: number
    publisher?: number
    publisher_name?: string
    characters?: number[]
    character_names?: string[]
    team?: number
    team_name?: string
    thumbnail_url?: string
    marvel_id?: number
    price?: number
    isbn?: string
    format?: number
    format_name?: string
    format_abbreviation?: string
    sub_category?: number
    sub_category_name?: string
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
