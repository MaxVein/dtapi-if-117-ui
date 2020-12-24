import {
    StudentProfile,
    TestDate,
    TestDetails,
} from '../../shared/interfaces/student.interfaces';
import {
    TestPlayerResponse,
    TestResult,
} from '../../shared/interfaces/test-player.interfaces';

// Logout Messages //
type Logout = 'error' | 'logout' | 'testInProcess' | 'checkError' | 'result';

export function logoutMessages(logout: Logout, result?: TestResult): string {
    if (logout === 'error') {
        return 'Сталася помилка при виході. Спробуйте знову';
    } else if (logout === 'logout') {
        return 'Ви успішно здійснили вихід з профілю! Успіхів!';
    } else if (logout === 'testInProcess') {
        return 'Ви дійсно хочете покинути профіль? Тест триває! Якщо ви вийдете, ваша спроба та поточні відповіді будуть зараховані!';
    } else if (logout === 'checkError') {
        return 'Сталася помилка! Не вдалося перевірити Ваш тест та визначити результат';
    } else if (logout === 'result') {
        return `Ви покинули профіль! Ваш результат тесту: Правильних відповідей: ${result.number_of_true_answers}; Результат: ${result.full_mark}`;
    }
}

// TestPlayer Server Messages //
type TestPlayer = 'get' | 'save' | 'reset';

export function testPlayerServerMessages(testPlayer: TestPlayer): string {
    if (testPlayer === 'get') {
        return 'Сталася помилка при отриманні даних із сесії. Невдається продовжити операцію! Спробуйте знову';
    } else if (testPlayer === 'reset') {
        return 'Сталася помилка при видаленні сесії. Невдається продовжити операцію! Спробуйте знову';
    } else if (testPlayer === 'save') {
        return 'Сталася помилка при збереженні даних у сесії. Невдається продовжити операцію! Спробуйте знову';
    }
}

// SnackBar Messages //
type SnackBar = 'cancel' | 'close';

export function snackBarMessages(snackBar: SnackBar): string {
    if (snackBar === 'cancel') {
        return 'Скасовано';
    }
}

// Theme Messages //
export function themeChangeMessage(theme: string): string {
    if (theme === 'default-theme') {
        return 'Тему додатку змінено на світлу';
    } else {
        return 'Тему додатку змінено на темну';
    }
}

// Profile Page Messages //
export const testsTableColumns = [
    'Предмет',
    'Тест',
    'Початок',
    'Кінець',
    'Кількість завдань',
    'Тривалість тесту',
    'Кількість спроб',
    'Почати тестування',
];
type Profile =
    | 'subjects'
    | 'student'
    | 'emptySubjects'
    | 'isMatch'
    | 'welcome'
    | 'getSessionError'
    | 'continueTest'
    | 'snackbarCancel';
export function profileMessages(
    profile: Profile,
    response?: StudentProfile,
    testName?: string,
    subjectName?: string
): string {
    if (profile === 'student') {
        return `Сталася помилка. Не вдалося отримати дані Ваші дані. Спробуйте знову`;
    } else if (profile === 'subjects') {
        return `Сталася помилка. Не вдалося отримати предмети Вашої групи. Спробуйте знову`;
    } else if (profile === 'emptySubjects') {
        return 'Предмети у групи відсутні';
    } else if (profile === 'isMatch') {
        return 'Неможливо здати даний тест! У сесії відсутні дані про тест, який Ви хочете здавати';
    } else if (profile === 'welcome') {
        return `Ласкаво просимо ${response.student_surname} ${response.student_name} ${response.student_fname}`;
    } else if (profile === 'getSessionError') {
        return 'Сталася помилка при перевірці незакінчених тестів Не вдалося отримати дані з сесії для перевірки здачі тесту! Спробуйте знову';
    } else if (profile === 'continueTest') {
        return `У даний момент у Вас є незакінчений тест ${testName} з предмету ${subjectName}! Бажаєте продовжити здачу тесту? У випадку відмови, тест буде тривати і щойно закінчиться час - тест буде закінчено і отримано результат`;
    } else if (profile === 'snackbarCancel') {
        return `Тест ${testName} триває. Ви завжди можете повернутися до здачі`;
    }
}

// Schedule Table Messages //
type Schedule =
    | 'isTests'
    | 'noTests'
    | 'noTestData'
    | 'activeTestsError'
    | 'subjectTestsError'
    | 'confirmStartTest';

export function scheduleMessages(
    schedule: Schedule,
    subjectName?: string,
    test?: TestDetails
): string {
    if (schedule === 'isTests') {
        return 'Тести завантажено';
    } else if (schedule === 'noTests') {
        return 'Тести відсутні';
    } else if (schedule === 'noTestData') {
        return 'Дані відсутні';
    } else if (schedule === 'activeTestsError') {
        return 'Сталася помилка під час складання списку активних тестів. Спробуйте знову';
    } else if (schedule === 'subjectTestsError') {
        return `Сталася помилка. Не вдалося отримати тести з предмету ${subjectName}. Спробуйте знову`;
    } else if (schedule === 'confirmStartTest') {
        return `Розпочати тест ${test.test_name} з предмету ${test.subjectname}?
                    Тривалість тесту ${test.time_for_test} та ${test.attempts} спроби на здачу ${test.tasks} завдань!`;
    }
}

// Check Date For Pass Test Messages //
type CheckTestDate =
    | 'noAvailable'
    | 'willBeAvailableLater'
    | 'notData'
    | 'willBeAvailableToday';

export function checkTestDateMessages(
    check: CheckTestDate,
    test: TestDate
): string {
    if (check === 'noAvailable') {
        return `Ви не можете здавати цей екзамен! Екзамен більше не доступний! Кінцева дата здачі була ${test.end_date}`;
    } else if (check === 'willBeAvailableLater') {
        return `Ви не можете здавати цей екзамен! Екзамен буде доступний ${test.start_date} о ${test.start_time}`;
    } else if (check === 'notData') {
        return `Екзамен не доступний! Немає потрібних даних`;
    } else if (check === 'willBeAvailableToday') {
        return `Ви не можете здавати цей екзамен! Екзамен буде доступний сьогодні о ${test.start_time}`;
    }
}

// Start Test Messages //
type StartTestPlayer =
    | 'startTest'
    | 'getLogError'
    | 'saveSessionError'
    | 'getSessionError'
    | 'scheduleError'
    | 'numberOfQuestions'
    | 'allAttempts'
    | 'makingTest'
    | 'onlyForYou'
    | 'paramsNotFound'
    | 'madeRecently'
    | 'default';

export function startTestPlayerMessages(
    startTest: StartTestPlayer,
    error?: boolean
): string {
    if (startTest === 'startTest') {
        return 'Тест розпочато! Час пішов!';
    } else if (startTest === 'saveSessionError') {
        return 'Сталася помилка при старті тесту! Не вдалося зберегти дані у сесії для здачі тесту! Спробуйте знову';
    } else if (startTest === 'getSessionError') {
        return 'Сталася помилка при спробі продовжити тест! Не вдалося отримати дані з сесії для здачі тесту! Спробуйте знову';
    } else if (startTest === 'scheduleError' && error) {
        return 'You cannot make the test due to your schedule';
    } else if (startTest === 'scheduleError' && !error) {
        return 'Сталася помилка! Ви не можете пройти тест за своїм розкладом';
    } else if (startTest === 'numberOfQuestions' && error) {
        return 'Error: The number of needed questions for the quiz is not suitable due to test details';
    } else if (startTest === 'numberOfQuestions' && !error) {
        return 'Сталася помилка! Кількість необхідних питань для вікторини не підходить через деталі тесту';
    } else if (startTest === 'allAttempts' && error) {
        return 'You cannot make the test due to used all attempts';
    } else if (startTest === 'allAttempts' && !error) {
        return 'Сталася помилка! Ви використали всі спроби для здачі даного тесту';
    } else if (startTest === 'makingTest' && error) {
        return 'User is making test at current moment';
    } else if (startTest === 'makingTest' && !error) {
        return 'Сталася помилка! Користувач здає тест у даний момент';
    } else if (startTest === 'onlyForYou' && error) {
        return 'You can start tests which are only for you!!!';
    } else if (startTest === 'onlyForYou' && !error) {
        return 'Сталася помилка! Ви можете розпочати тести, які призначені лише Вам';
    } else if (startTest === 'paramsNotFound' && error) {
        return 'Test detail parameters not found for requested test';
    } else if (startTest === 'paramsNotFound' && !error) {
        return 'Сталася помилка! Не знайдено детальних параметрів для запитуваного тесту';
    } else if (startTest === 'madeRecently' && error) {
        return 'Error. User made test recently';
    } else if (startTest === 'madeRecently' && !error) {
        return 'Сталася помилка! Користувач здав даний тест недавно. Зачекайте деякий час ( до 1хв )';
    } else if (startTest === 'default') {
        return 'Сталася помилка! Невідома помилка, тест розпочати не вдається! Спробуйте знову';
    }
}

// Test Player Messages //
type TestPlayerClient =
    | 'withoutMakingQuiz'
    | 'enoughNumber'
    | 'default'
    | 'finish'
    | 'sureFinish'
    | 'checkError'
    | 'emptySlot';
export function testPlayerMessages(
    testPlayer: TestPlayerClient,
    error?: boolean,
    testName?: string,
    gone?: boolean
): string {
    if (testPlayer === 'default') {
        return 'Сталася помилка! Невідома помилка при отриманні запитань до тесту, тест розпочати не вдається! Спробуйте знову';
    } else if (testPlayer === 'withoutMakingQuiz' && error) {
        return 'You cannot call this method without making an quiz';
    } else if (testPlayer === 'withoutMakingQuiz' && !error) {
        return 'Сталася помилка! Неможливо запустити даний текст';
    } else if (testPlayer === 'enoughNumber' && error) {
        return 'Not enough number of questions for quiz';
    } else if (testPlayer === 'enoughNumber' && !error) {
        return 'Сталася помилка! Недостатня кількість питань для тесту! Неможливо продовжити! Спробуйте знову';
    } else if (testPlayer === 'sureFinish') {
        return `Ви впевнені, що хочете завершити ${testName}?`;
    } else if (testPlayer === 'finish' && gone) {
        return 'Час здачі тесту вийшов! Ваш результат!';
    } else if (testPlayer === 'finish' && !gone) {
        return 'Ви закінчили тест! Ваш результат!';
    } else if (testPlayer === 'checkError') {
        return 'Сталася помилка! Не вдалося перевірити Ваш тест та визначити результат';
    } else if (testPlayer === 'emptySlot') {
        return 'Сталася помилка! Тест не було розпочато або тест уже було закінчено! Неможливо здати тест або повернутися до його здачі';
    }
}

// Timer Messages //
type Timer = 'timerError' | 'endError' | 'saveError' | 'syncError';

export function timerMessages(timer: Timer): string {
    if (timer === 'syncError') {
        return 'Сталася помилка! Не вдалося синхронізувати час! Неможливо продовжити! Спробуйте знову';
    } else if (timer === 'endError') {
        return 'Сталася помилка! Не вдалося отримати час закінчення тесту! Неможливо продовжити! Спробуйте знову';
    } else if (timer === 'saveError') {
        return 'Сталася помилка! Не вдалося зберегти час тесту! Неможливо продовжити! Спробуйте знову';
    } else if (timer === 'timerError') {
        return 'Сталася помилка! Проблеми таймера! Спробуйте знову';
    }
}
