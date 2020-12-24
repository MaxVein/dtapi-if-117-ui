import { Student } from './entity.interfaces';

export interface RouterState {
    username?: string;
    id?: string;
}

export interface TestDetails {
    attempts: string;
    enabled: string;
    subject_id: string;
    tasks: string;
    test_id: string;
    test_name: string;
    time_for_test: number;
    response: string;
    subjectname?: string;
}

export interface StudentProfile extends Student {
    group_name?: string;
    faculty_id?: number;
    faculty_name?: string;
    speciality_id?: string;
    speciality_name?: string;
    speciality_code?: string;
}

export interface TestDate {
    end_date: string;
    end_time?: string;
    group_id?: string;
    start_date: string;
    start_time?: string;
    subject_id?: string;
    timetable_id?: string;
    response?: string;
    subjectname?: string;
}

export interface SpecialityDataProfile {
    name: string;
    code: string;
}

export interface Question {
    question_id: string;
    test_id: string;
    question_text: string;
    level: string;
    type: string;
    attachment: string;
}

export interface Answer {
    answer_id: number;
    question_id: number;
    true_answer?: boolean;
    answer_text: string;
    attachment: string;
}
