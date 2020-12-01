export interface Admins {
    id: string;
    email: string;
    username: string;
}
export interface AdminsCreation {
    id?: string;
    email: string;
    username: string;
    password: string;
    password_confirm: string;
}

export interface ModalData {
    title?: string;
    user?: AdminsCreation;
}
