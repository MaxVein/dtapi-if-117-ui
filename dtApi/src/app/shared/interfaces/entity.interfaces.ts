export interface Student {
    user_id?: string;
    gradebook_id: string;
    student_surname: string;
    student_name: string;
    student_fname: string;
    group_id: number;
    photo: string | ArrayBuffer;
    password?: string;
    password_confirm?: string;
    plain_password: string;
}

export interface StudentInfo {
    email: string;
    id?: string;
    last_login?: string;
    logins?: number;
    username: string;
}

export interface StudentProfileData extends Student {
    username?: string;
    email?: string;
    faculty_name?: string;
    group_name?: string;
    speciality_code?: string;
    speciality_name?: string;
    speciality_id?: string;
}

export interface GroupInfoState {
    groupName: string;
    id: number;
}

export interface ValidateStudentData {
    gradebook_id: string;
    username: string;
    email: string;
}

export interface DialogResult {
    message?: any;
    data?: any;
    id?: number | string;
}

export interface Check {
    response: boolean;
}

export interface Unique {
    propertyIsNotUnique: boolean;
}

export interface Faculty {
    faculty_id: number;
    faculty_name: string;
    faculty_description: string;
}

export interface Group {
    group_id: string;
    group_name: string;
    speciality_id: string;
    faculty_id: string;
}

export interface Speciality {
    speciality_id: number;
    speciality_code: string;
    speciality_name: string;
}

export interface Response {
    error?: Response;
    response?: string;
    user_id?: string;
    id?: number;
}

export interface Subject {
    subject_id: string;
    subject_name: string;
    subject_description: string;
}
