export interface Admins {
    id: string
    email: string
    username: string
}
export interface AdminsCreation {
    title?: string
    email: string
    username: string
    password: string
    password_confirm: string
}
