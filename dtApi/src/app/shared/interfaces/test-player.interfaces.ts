import { Response } from './entity.interfaces';
import { Answer, Question, TestDetails } from './student.interfaces';

export interface ServerTime {
    unix_timestamp: number;
    offset: number;
    curtime: number;
}

export interface Timer {
    hours: number | string | any;
    minutes: number | string | any;
    seconds: number | string | any;
}

export interface TestPlayerSaveData {
    id?: number;
    testInProgress?: boolean;
    response?: string;
    currentTest?: TestDetails;
}

export interface TestPlayerResponse {
    response?: string;
    id?: number;
    testInProgress?: boolean;
    currentTest?: TestDetails;
}

export interface TestLog {
    id?: number;
    response: string;
}

export interface TestLogError {
    error: Response;
}

export interface TestPlayerQAError {
    error: Response;
}

export interface TestPlayerEndTime {
    end: number;
    response?: string;
}

export interface TestCheck {
    time: boolean;
    finish: boolean;
}

export interface TestDetailsByTest {
    id: number;
    test_id: number;
    level: number;
    tasks: number;
    rate: number;
}

export interface QA extends Question {
    answers: Answer[];
}

export interface AnswerData {
    question_id: number;
    answer_ids: Array<number>;
}

export interface TestResult {
    full_mark: number;
    number_of_true_answers: number;
}

export interface RouterResults {
    result: TestResult;
    countOfQuestions: number;
    testName: string;
    subjectName: string;
}

export type TestPlayerNavigate = 'profile' | 'results';
