export interface ISenderCreate {
    senderName: number;
}
export interface Isender {
    senderId?: string;
    senderName: string;
    senderType?: number;
    status?: number;
}
export interface IsenderRes {
    id: number;
    message: string;
    status: boolean;
}
