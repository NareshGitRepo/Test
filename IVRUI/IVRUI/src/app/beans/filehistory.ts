export class OpFileHistoryInfo {

    id: number;
    loginuserId: number;
    action: string;
    type: string;
    filepath: string;
    count: string;
    status: number;
    insertedTime: string;
    processedCount: number;

    constructor(id: number, loginuserId: number, action: string,
        type: string, filepath: string, count: string, status: number, insertedTime: string, processedCount: number) {

        this.id = id;
        this.loginuserId = loginuserId;
        this.action = action;
        this.type = type;
        this.filepath = filepath;
        this.count = count;
        this.status = status;
        this.insertedTime = insertedTime;
        this.processedCount = processedCount;

    }
}
