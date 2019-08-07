export interface IProfileResponse {
    id: number;
    message: string;
    status: boolean;
}
export interface IChangePassword {
    newpswd: string;
    oldpswd: string;
}
export interface IUpdateProfile {
    firstname: string;
    language: string;
    lastname: string;
    mobileNo: string;
    userId: number;
}