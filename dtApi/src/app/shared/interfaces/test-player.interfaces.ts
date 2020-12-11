import { Response } from './entity.interfaces';
import { Answer, Question } from './student.interfaces';

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
}

export interface TestPlayerResponse {
    response?: string;
    id?: number;
    testInProgress?: boolean;
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