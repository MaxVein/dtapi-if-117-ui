import {
    Student,
    StudentInfo,
    StudentProfileData,
} from '../../../shared/interfaces/entity.interfaces';

export const studentsMock: Student[] = [
    {
        student_surname: 'Яремин',
        student_name: 'Олег',
        student_fname: 'Володимирович',
        gradebook_id: '07070510',
        group_id: 1,
        photo: 'base64/sadsadas',
        plain_password: '12207070510',
    },
];

export const studentInfoMock: StudentInfo = {
    email: 'oleg.benderg@gmail.com',
    username: 'olehyaremyn7',
};

export const StudentProfileDataMock: StudentProfileData = {
    gradebook_id: '07070510',
    group_id: 1,
    photo: 'base64/sadsadas',
    plain_password: '07070510',
    student_surname: 'Яремин',
    student_name: 'Олег',
    student_fname: 'Володимирович',
    username: 'olehyaremyn7',
    email: 'oleg.benderg@gmail.com',
    faculty_name: 'Інженерія ПЗ',
    group_name: 'ІП-16-2',
    speciality_code: '121',
    speciality_name: 'Інженерія ПЗ',
    speciality_id: '122',
};
