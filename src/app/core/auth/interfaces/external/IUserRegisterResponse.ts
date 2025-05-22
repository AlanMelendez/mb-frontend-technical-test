export interface UserRegisterResponse {
    errors:    Error[];
    succeeded: boolean;
}

export interface Error {
    code:        string;
    description: string;
}
