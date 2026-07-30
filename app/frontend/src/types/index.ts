export type Book = {
    id: number
    title?: string
    author?: string
    description?: string
    thumbnail?: string
    page_count?: number
    publisher?: number
    publisher_name?: string
    character?: number
    character_name?: string
    team?: string
    thumbnail_url?: string
    marvel_id?: number
    price?: number
    isbn?: string
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
