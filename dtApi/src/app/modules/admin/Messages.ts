// Students Module Messages //
export const studentsTableColumns = [
    'id',
    'gradebook_id',
    'student_surname',
    'actions',
];

type Students =
    | 'extrasError'
    | 'upload'
    | 'notStudents'
    | 'getError'
    | 'modalError'
    | 'modalErrClose'
    | 'modalCancel'
    | 'modalClose'
    | 'add'
    | 'update'
    | 'transfer'
    | 'remove'
    | 'confirmRemove'
    | 'viewDataError'
    | 'notViewData'
    | 'removeError'
    | 'viewError'
    | 'transferError'
    | 'getGroupsError'
    | 'getFacultyError'
    | 'createError'
    | 'updateError'
    | 'formInvalid'
    | 'newStudentError';

export function studentsMessages(
    students: Students,
    firstname?: string,
    lastname?: string
): string {
    if (students === 'extrasError') {
        return 'Сталася помилка! Відсутні дані для отримання студентів! Спробуйте знову';
    } else if (students === 'upload') {
        return 'Студентів завантажено';
    } else if (students === 'notStudents') {
        return 'У вибраній групі відсутні студенти';
    } else if (students === 'getError') {
        return 'Сталася помилка! Не вдалося завантажити студентів даної групи! Спробуйте знову';
    } else if (students === 'modalError') {
        return 'Помилка';
    } else if (students === 'modalErrClose') {
        return 'Закрито через помилку';
    } else if (students === 'modalCancel') {
        return 'Скасовано';
    } else if (students === 'modalClose') {
        return 'Закрито';
    } else if (students === 'add') {
        return 'Студента додано';
    } else if (students === 'update') {
        return 'Дані студента оновлено';
    } else if (students === 'transfer') {
        return 'Студента переведено';
    } else if (students === 'remove') {
        return 'Студента видалено';
    } else if (students === 'confirmRemove') {
        return `Видалити студента ${firstname} ${lastname}?`;
    } else if (students === 'viewDataError') {
        return 'Немає даних';
    } else if (students === 'notViewData') {
        return 'Немає даних про вибраного студента';
    } else if (students === 'removeError') {
        return 'Сталася помилка! Не вдалося видалити вибраного студента! Спробуйте знову';
    } else if (students === 'viewError') {
        return 'Сталася помилка при отриманні даних студента. Спробуйте знову';
    } else if (students === 'transferError') {
        return 'Сталася помилка при переведенні студента. Спробуйте знову';
    } else if (students === 'getGroupsError') {
        return 'Сталася помилка при списку груп. Спробуйте знову';
    } else if (students === 'getFacultyError') {
        return 'Сталася помилка при списку факультетів. Спробуйте знову';
    } else if (students === 'createError') {
        return 'Сталася помилка під час створення студента. Спробуйте знову';
    } else if (students === 'updateError') {
        return 'Сталася помилка під час оновлення даних студента. Спробуйте знову';
    } else if (students === 'formInvalid') {
        return 'Сталася помилка! Заповніть форму відповідно до вимог і спробуйте знову';
    } else if (students === 'newStudentError') {
        return 'Сталася помилка при формуванні даних студента! Спробуйде знову';
    }
}
