// Admin Module Shared Messages //
export const titleErrorMessage = 'Помилка';
export const errorMessage = 'Сталася помилка. Спробуйте знову';
export const closeError = 'Закрито через помилку';
export const cancelErrorMessage = 'Скасовано';
export const closeMessageE = 'Закрито';

// Students Module Messages //
export const uploadStudentsMessage = 'Студентів завантажено';
export const notStudentsMessage = 'У вибраній групі відсутні студенти';
export const addStudentMessage = 'Студента додано';
export const updateStudentMessage = 'Дані студента оновлено';
export const transferStudentMessage = 'Студента переведено';
export const studentRemoveMessage = 'Студента видалено';
export const getUpdateErrorMessage =
    'Сталася помилка при отриманні даних студента. Спробуйте знову';
export const getFacultyErrorMessage =
    'Сталася помилка при списку факультетів. Спробуйте знову';
export const getGroupErrorMessage =
    'Сталася помилка при списку груп. Спробуйте знову';
export const transferStudentErrorMessage =
    'Сталася помилка при переведенні студента. Спробуйте знову';
export const studentsTableColumns = [
    'id',
    'gradebook_id',
    'student_surname',
    'actions',
];

export function removeStudentMessage(
    firstname: string,
    lastname: string
): string {
    return `Видалити студента ${firstname} ${lastname}?`;
}

export function updateCreateErrorMessage(update: boolean): string {
    if (update) {
        return 'Сталася помилка під час оновлення даних студента. Спробуйте знову';
    } else {
        return 'Сталася помилка під час створення студента. Спробуйте знову';
    }
}
