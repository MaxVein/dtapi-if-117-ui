export interface Login {
    userName: string;
    password: string;
}

export interface Logo {
    logo: string;
}

export interface Logged {
    roles: Array<string>;
    username: string;
    id: string;
    response: string;
}
