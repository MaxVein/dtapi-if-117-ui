import { TestDetails } from '../../shared/interfaces/student.interfaces';
import { Student } from '../../shared/interfaces/entity.interfaces';

// Student Module Shared Messages //
export const errorTitleMessage = 'Помилка';
export const warningTitleMessage = 'Попередження';
export const cancelMessage = 'Скасовано';
export const baseErrorMessage = 'Сталася помилка. Спробуйте знову';
export const logoutErrorMessage = 'Сталася помилка при виході. Спробуйте знову';
export function themeChangeMessage(theme: string): string {
    if (theme === 'default-theme') {
        return 'Ви змінили тему додатку на світлу';
    } else {
        return 'Ви змінили тему додатку на темну';
    }
}
export const testLogoutConfirmMessage =
    'Ви дійсно хочете покинути профіль? Тест триває! Якщо ви вийдете, ваша спроба та поточні відповіді будуть зараховані!';

// Student Module Profile Page Messages //
export const isMatchErrorMessage =
    'Неможливо здати даний тест. У сесії відсутній код даного тесту';
export function welcomeMessage(response: Student): string {
    return `Ласкаво просимо ${response.student_surname} ${response.student_name} ${response.student_fname}`;
}
export const profileStudentMessage =
    'Сталася помилка. Не вдалося отримати дані студента. Спробуйте знову';
export const profileSubjectsMessage =
    'Сталася помилка. Не вдалося отримати предмети студента. Спробуйте знову';
export function profileTestMessage(subjectName: string): string {
    return `Сталася помилка. Не вдалося отримати тести з предмету ${subjectName}. Спробуйте знову`;
}
export const notTestData = 'Дані відсутні';
export function uploadTests(isTest: boolean): string {
    if (isTest) {
        return 'Тести завантажено';
    } else {
        return 'Тести відсутні';
    }
}
export function isTestStart(testStart: boolean): string {
    if (testStart) {
        return 'Тест розпочато! Час пішов!';
    } else {
        return 'Сталася помилка при старті тесту! Спробуйте знову';
    }
}
export function testLogError1(error: boolean): string {
    if (error) {
        return 'You cannot make the test due to your schedule';
    } else {
        return 'Сталася помилка! Ви не можете пройти тест за своїм розкладом';
    }
}
export function testLogError2(error: boolean): string {
    if (error) {
        return 'Error: The number of needed questions for the quiz is not suitable due to test details';
    } else {
        return 'Сталася помилка! Кількість необхідних питань для вікторини не підходить через деталі тесту';
    }
}
export function testLogError3(error: boolean): string {
    if (error) {
        return 'You cannot make the test due to used all attempts';
    } else {
        return 'Сталася помилка! Ви використали всі спроби для здачі даного тесту';
    }
}
export function testLogError4(error: boolean): string {
    if (error) {
        return 'User is making test at current moment';
    } else {
        return 'Користувач здає тест у даний момент';
    }
}
export function testLogError5(error: boolean): string {
    if (error) {
        return 'You can start tests which are only for you!!!';
    } else {
        return 'Ви можете розпочати тести, які призначені лише Вам';
    }
}
export function testLogError6(error: boolean): string {
    if (error) {
        return 'Test detail parameters not found for requested test';
    } else {
        return 'Не знайдено детальних параметрів для запитуваного тесту';
    }
}
export function testLogError7(error: boolean): string {
    if (error) {
        return 'Error. User made test recently';
    } else {
        return 'Користувач здав даний тест недавно. Зачекайте деякий час (до 1хв)';
    }
}
export function confirmStartTestMessage(test: TestDetails): string {
    return `Розпочати тест ${test.test_name} з предмету ${test.subjectname}?
                    Тривалість тесту ${test.time_for_test} та ${test.attempts} спроби на здачу ${test.tasks} завдань!`;
}
export function testWillBeAvailableTodayMessage(startTime: string): string {
    return `Ви не можете здавати цей екзамен! Екзамен буде доступний сьогодні о ${startTime}`;
}
export function testNoAvailableMessage(endDate: string): string {
    return `Ви не можете здавати цей екзамен! Екзамен більше не доступний! Кінцева дата здачі була ${endDate}`;
}
export function testWillBeAvailableLaterMessage(
    startDate: string,
    startTime: string
): string {
    return `Ви не можете здавати цей екзамен! Екзамен буде доступний ${startDate} о ${startTime}`;
}
export function notDataRequiredMessage(): string {
    return `Екзамен не доступний! Немає потрібних даних`;
}

// Student Module Test Player Messages //
export function testPlayerQAError1(error: boolean): string {
    if (error) {
        return 'You cannot call this method without making an quiz';
    } else {
        return 'Сталася помилка! Неможливо запустити даний текст';
    }
}
export function testPlayerQAError2(error: boolean): string {
    if (error) {
        return 'Not enough number of questions for quiz';
    } else {
        return 'Сталася помилка! Недостатня кількість питань для тесту';
    }
}
export function areYouSureFinishTestMessage(testName: string): string {
    return `Ви впевнені, що хочете завершити ${testName}?`;
}
export function testPlayerFinishMessage(gone: boolean): string {
    if (gone) {
        return 'Час здачі тесту вийшов! Ваш результат!';
    } else {
        return 'Ви закінчили тест! Ваш результат!';
    }
}
export const sessionErrorMessage = 'Помилка сесії';
export const timerErrorMessage = 'Помилка таймера';
export const endTimeErrorMessage = 'Не вдалося отримати час закінчення тесту';
export const saveTimeErrorMessage = 'Не вдалося зберегти час';
export const synchronizeErrorMessage = 'Не вдалося синхронізувати час';
