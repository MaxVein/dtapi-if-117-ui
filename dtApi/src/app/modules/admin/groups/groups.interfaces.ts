export interface GroupData {
    group_id: string;
    group_name: string;
    speciality_name: string;
    faculty_name: string;
    speciality_id: string;
    faculty_id: string;
}

export interface AddGroupData {
    group_name: string;
    speciality_id: string;
    faculty_id: string;
}

export interface ServiceResponse {
    groups: [];
    faculties: [];
    specialities: [];
}
