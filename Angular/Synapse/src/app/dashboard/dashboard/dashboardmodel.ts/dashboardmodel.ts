export interface IdashBoard {
    Delivered: number;
    Incoming: number;
    Outgoing: number;
    Pending: number;
    PriorityId: number;
    PriorityName: string;
    UserId?: number;
    UserName?: string;
    DeptId?: number;
    DeptName?: string;
}