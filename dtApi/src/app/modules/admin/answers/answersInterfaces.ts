export interface typeOfQuestion {
    simpleChoice: string;
    multiChoice: string;
    inputField: string;
    numerical: string;
}

export interface questionData {
    test_id: string;
    question_text: string;
    level: string;
    type: string;
    attachment?: string;
    question_id?: string;
}
export interface answerData {
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
