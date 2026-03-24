export interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    thumbnail: string;
    page_count: number;
    publisher: number;
    publisher_name: string;
    character: number;
    character_name: string;
}

export interface Character {
    id: number;
    name: string;
    publisher: number;
}

export interface Publisher {
    id: number;
    key: string;
    name: string;
}
