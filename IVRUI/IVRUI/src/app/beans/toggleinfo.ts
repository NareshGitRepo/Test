export class ToggleResp {

    public sessionid: string;
    public mode: string;
    public bindstatus: number;

    constructor(sessionid: string, mode: string, bindstatus: number) {
        this.sessionid = sessionid;
        this.mode = mode;
        this.bindstatus = bindstatus;
    }

}
