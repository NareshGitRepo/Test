export interface ModulesInfo {
    checker: number;
    link: string;
    menuId: number;
    moduleId: number;
    moduleType: number;
    modulename: string;
    viewChecker: number;
    checked?: boolean;
}

export interface ModuleData{

    modulesInfo :ModulesInfo[];
}

export interface IResponse {
    id: number;
    message: string;
    status: boolean;
}