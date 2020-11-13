export interface Student {
    email: string
    username: string
    password: string
    password_confirm: string
    user_id?: string
    gradebook_id: string
    student_surname: string
    student_name: string
    student_fname: string
    group_id: number
    photo: string
    plain_password: string
}
