export interface QuestionInstance {
    question_id: number;
    test_id: string;
    question_text: string;
    level: string;
    type: string;
}
export interface QuestionData {
    title: string;
    question: QuestionInstance;
}
export interface QuestionDataAfterClosed {
    finished: boolean;
    updatedquestion: QuestionInstance;
}
