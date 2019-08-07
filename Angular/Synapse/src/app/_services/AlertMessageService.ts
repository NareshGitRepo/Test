
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';



export enum AlertType {
    SUCCESS,
    WARN,
    ERROR,
}

export enum ActionType {
    SUCCESS = 'ok',
    FAILED = 'Failed',
    ERROR = 'Error',
    ALERT = 'Alert',
}

@Injectable({ providedIn: 'root'})
export class AlertMessageService {

    constructor(private snackBar: MatSnackBar) {
    }

    showAlert(msg: string, action?: string, durationInSec?: number, alertType?: AlertType,actionType?: ActionType) {
        const config = new MatSnackBarConfig();

        switch (alertType) {
            case AlertType.SUCCESS:
                config.panelClass = ['background-alert-success'];
                break;
            case AlertType.WARN:
                config.panelClass = ['background-alert-warn'];
                break;
            case AlertType.ERROR:
                config.panelClass = ['background-alert-red'];
                break;
            default:
                break;
        }
        switch (actionType) {
            case ActionType.SUCCESS:
                config.panelClass = ['background-alert-success'];
                break;
            case ActionType.ALERT:
                config.panelClass = ['background-alert-warn'];
                break;
            case ActionType.ERROR:
                config.panelClass = ['background-alert-red'];
                break;
                case ActionType.FAILED:
                config.panelClass = ['background-alert-red'];
                break;
            default:
                break;
        }

        config.duration = durationInSec ? durationInSec*1000 : 3000;


        this.snackBar.open(msg, action ? action : undefined, config);
    }
}