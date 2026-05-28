// Favorite repository record from database
export type Repos = {
    id?: string,
    user_id?: string,
    repo_id?: string,
    repo_name?: string,
    repo_url?: string,
    description?: string,
    rating?: number,
    created_at?: Date
}

// What client receives back
export type Client = {
    repo_name: string,
    repo_url: string,
    description: string,
    rating: number
}

export type PayloadId = {
    user: {
        id: string
    }
}

export type MessageWithQuery = {message?: string, deleted?: Repos, added?: Repos}


export type ApiResponse<T> = T | MessageWithQuery
