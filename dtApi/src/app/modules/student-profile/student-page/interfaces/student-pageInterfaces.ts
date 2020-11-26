export interface isLoggedRes {
    roles: string[];
    id: string;
    username: string;
    response: string;
}

export interface studentDetails {
    gradebook_id: string;
    student_fname: string;
    student_name: string;
    student_surname: string;
    photo: string;
    group_id: string;
}

export interface groupDetails {
    faculty_id: string;
    group_id: string;
    group_name: string;
    speciality_id: string;
}

export interface facultyDetails {
    faculty_name: string;
}
export interface specialityDetails {
    speciality_code: string;
    speciality_id: string;
    speciality_name: string;
}
export interface subjectDetails {
    subject_id: string;
    subject_name: string;
}
export interface testDetails {
    attempts: string;
    enabled: string;
    subject_id: string;
    tasks: string;
    test_id: string;
    test_name: string;
    time_for_test: string;
    response: string;
}
export interface testDetailsErorr {
    response: string;
}

export interface testDate {
    end_date: string;
    end_time?: string;
    group_id?: string;
    start_date: string;
    start_time?: string;
    subject_id?: string;
    timetable_id?: string;
    response?: string;
}
