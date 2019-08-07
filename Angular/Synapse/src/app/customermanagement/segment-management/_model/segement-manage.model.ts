
export interface CustomersData {
    customerId: number;
    customerName: string;
    address: string;
    city: string;
    country: string;
    mobileNo: string;
    emailId: string;
    dob: string;
    pob: string;
    residenceType: string;
    nationality: string;
    passportNo: string;
    nationalId: string;
    language: number;
    smsChannel: number;
    emailChannel: number;
    pushChannel: number;
    prefStartTime: string;
    prefEndTime: string;
    status?: number;
}
export interface creteProfileOpenData{
    type:number;
    SegementCustomerData:SegementCustomerData;
    CustomersDataData:CustomersData;
    segmentId:number;

}

export interface SegementCustomerData {
    customersData?: CustomersData[];
    segmentCode: string;
    segmentDesc: string;
    segmentId?: number;
    segmentName: string;
    segmentPrecedence: number;
    status?: number;
}

export interface ApiResponse {
    id: number;
    message: string;
    status: boolean;
}

export interface ChannelsInfo {
    channelId: number;
    channelName: string;
}



