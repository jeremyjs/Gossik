export interface Suggestion {
    key?: string;
    userid: string;
    title: string;
    content: string;
    type: string;
    todoid?: string;
    projectid?: string;
    active?: boolean;
    createDate?: any;
    deleteDate?: any;
}