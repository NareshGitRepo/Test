export interface Menu {
    description: string;
    type: string;
    typeId: number;
}

export interface IDashboard {
    menus: Menu[];
    messages: string;
    status: boolean;
    kisokId: string;
    printerSatus: string;

}



