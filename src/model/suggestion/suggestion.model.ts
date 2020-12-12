export interface Suggestion {
    key?: string;
    userid: string;
    title: string;
    content: string;
    type: string;
    todoid?: string;
    active?: boolean;
    createDate?: any;
    deleteDate?: any;
}