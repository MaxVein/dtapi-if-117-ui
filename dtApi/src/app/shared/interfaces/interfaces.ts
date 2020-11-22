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
    photo: string | ArrayBuffer
    plain_password: string
}

export interface Check {
    response: boolean
}

export interface Unique {
    propertyIsNotUnique: boolean
}

export interface Faculty {
    faculty_id: number
    faculty_name: string
    faculty_description: string
}

export interface Group {
    group_id: string
    group_name: string
    speciality_id: string
    faculty_id: string
}

export interface Speciality {
    speciality_id: number
    speciality_code: string
    speciality_name: string
}
