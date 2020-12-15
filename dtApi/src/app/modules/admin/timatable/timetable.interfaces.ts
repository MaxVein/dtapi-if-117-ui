export interface TimeTable {
    group_id: string;
    subject_id: string;
    start_date: any;
    start_time: string;
    end_date: any;
    end_time: string;
    timetable_id: string;
    group_name?: string;
}

export interface ServiceResponse {
    groups: [];
    timetable: [];
}
