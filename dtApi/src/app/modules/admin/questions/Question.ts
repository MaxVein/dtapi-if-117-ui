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
export function typeReverse(type: string): string {
    if (type.length > 1) {
        switch (type) {
            case 'Простий вибір':
                type = '1';
                break;
            case 'Мульти вибір':
                type = '2';
                break;
            case 'Текстове поле':
                type = '3';
                break;
            case 'Числове поле вводу':
                type = '4';
                break;
        }
    } else {
        switch (type) {
            case '1':
                type = 'Простий вибір';
                break;
            case '2':
                type = 'Мульти вибір';
                break;
            case '3':
                type = 'Текстове поле';
                break;
            case '4':
                type = 'Числове поле вводу';
                break;
        }
    }
    return type;
}
