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
    time_for_test: string;
    response: string;
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
}
