export interface isLoggedRes {
    roles: string[]
    id: string
    username: string
    response: string
}

export interface studentDetails {
    gradebook_id: string
    student_fname: string
    student_name: string
    student_surname: string
    photo: string
    group_id: string
}

export interface groupDetails {
    faculty_id: string
    group_id: string
    group_name: string
    speciality_id: string
}

export interface facultyDetails {
    faculty_name: string
}
export interface specialityDetails {
    speciality_code: string
    speciality_id: string
    speciality_name: string
}
export interface subjectDetails {
    subject_id: string
}
