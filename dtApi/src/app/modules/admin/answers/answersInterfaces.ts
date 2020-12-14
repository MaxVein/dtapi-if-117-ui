export interface TypeOfQuestion {
    simpleChoice: string;
    multiChoice: string;
    inputField: string;
    numerical: string;
}

export interface QuestionData {
    test_id: string;
    question_text: string;
    level: string;
    type: string;
    attachment?: string;
    question_id?: string;
}
export interface AnswerData {
    answer_id?: string;
    question_id: string;
    true_answer: string;
    answer_text: string;
    attachment?: string;
}
export interface noRecords {
    responce: string;
}
export interface Response {
    response: string;
}
export interface AnswerType {
    answer_id?: string;
    atachmentAnswer?: string;
    text: string;
    trueAnswerMulti?: boolean;
    trueAnswerSimple?: boolean;
}
