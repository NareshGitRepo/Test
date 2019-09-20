import { Component, OnInit, ViewChild } from '@angular/core';
import { IDrilldownInfo, IServicesInfo, IypeData, IFilterTable, INavigationModel, IFilterKeyModel } from '../_model/mdashboard.model';
import { MatTableDataSource } from '@angular/material/table';
import { MDashBoardService } from '../_service/mdashboardservice';
import { ActionType, AlertMessageService } from '../../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-drilldowndashboard',
  templateUrl: './drilldowndashboard.component.html',
  styleUrls: ['./drilldowndashboard.component.scss']
})
export class DrilldowndashboardComponent implements OnInit {


  displayedColumnsData = ['name', 'totalAppointments', 'patientsCheckedIn', 'patientsWaiting', 'patientsServed', 'waitingTime'];
  filterKeyData: IFilterKeyModel[] = [{ filterType: IypeData.building, filterId: 'buildId', filterName: 'buildEngName', filterString: 'buildId' },
  { filterType: IypeData.level, filterId: 'floorId', filterName: 'floorEngName', filterString: 'floorId' },
  { filterType: IypeData.department, filterId: 'deptId', filterName: 'deptEngName', filterString: 'deptId' },
  { filterType: IypeData.service, filterId: 'serviceId', filterName: 'serviceEngName', filterString: 'serviceId' },
  { filterType: IypeData.resource, filterId: 'drId', filterName: 'login', filterString: 'drId' }]

  navigationData: INavigationModel[] = [];
  drilldownData: IDrilldownInfo[] =[];
  resourceData: IServicesInfo[] = [];

  subscription: any;
  filterTableData = [];
  dataSourceData = new MatTableDataSource<IFilterTable>();
  intervalValue: number = 60;
  initPage = 0;
  pageSize = 5;//environment.pageSize;

  loading: boolean = true;
  refreshActionD: boolean = false;
  @ViewChild('MatPaginator') paginator: MatPaginator;


  constructor(private _dasboardService: MDashBoardService, private appconfig: AppConfig,
    private translate: TranslateService, private alertMessage: AlertMessageService, private router: Router) {

    let dval = this.appconfig.getdashboardInterval();
    this.intervalValue = dval != null ? (dval < 5 ? 5 : dval) : 60;
  }

  ngOnInit() {
    this.getVvDashboardNew(true);
    this.subscription = Observable.interval(this.intervalValue * 1000).subscribe(data => {

       if (!this.refreshActionD)
      this.getVvDashboardRefresh(false);

    });

  }
  getVvDashboardRefresh(action: boolean) {
    this.refreshActionD = true;
    let selctionType = IypeData.building;
    if (this.navigationData.length > 0) {
      selctionType = (this.navigationData[this.navigationData.length - 1].type) + 1
    }
    let id = 0;
    if (this.navigationData.length > 1) {
      id = this.navigationData[this.navigationData.length - 2].id;
    }
    if (selctionType == IypeData.service || selctionType == IypeData.resource) {
      let index = this.navigationData.findIndex(x => x.type == IypeData.department);
      if (index != -1) {
        let filterKeyindex = this.filterKeyData.findIndex(x => x.filterType == selctionType);
        this._dasboardService.getVvDashboardServices(this.navigationData[index].id).subscribe((result: IServicesInfo[]) => {
          console.log("getVvDashboardServices=>", result, filterKeyindex, this.filterKeyData[filterKeyindex], selctionType);

          if (result) {
            if (result.length > 0) {
              if (!_.isEqual(this.resourceData, result)) {
                this.resourceData = result;
                let clickedFilterData = []
                if (selctionType == IypeData.resource) {
                  clickedFilterData = this.resourceData.filter(ele => {
                    return ele.serviceId == this.navigationData[this.navigationData.length - 1].id;
                  });
                }
                console.log("getVvDashboardServices=>", selctionType == IypeData.resource ? clickedFilterData : this.resourceData, this.filterKeyData[filterKeyindex], selctionType);
                this.filterTableData =
                  _(selctionType == IypeData.resource ? clickedFilterData : this.resourceData)
                    .groupBy(this.filterKeyData[filterKeyindex].filterString)
                    .map((objs, key) => ({
                      'Id': objs[0][this.filterKeyData[filterKeyindex].filterId],
                      'previousId': id,
                      'name': objs[0][this.filterKeyData[filterKeyindex].filterName],
                      'type': this.filterKeyData[filterKeyindex].filterType,
                      'totalAppointments': _.sumBy(objs, 'totalAppointments'),
                      'patientsCheckedIn': _.sumBy(objs, 'patientsCheckedIn'),
                      'waitingTime': _.sumBy(objs, 'waitingTime'),
                      'patientsServed': _.sumBy(objs, 'patientsServed'),
                      'patientsWaiting': _.sumBy(objs, 'patientsWaiting')
                    }))
                    .value();
                this.dataSourceData = new MatTableDataSource(this.filterTableData);
                if (this.filterTableData.length == this.dataSourceData.data.length) {
                  setTimeout(() => { this.dataSourceData.paginator = this.paginator });
                } else {
                  this.subscription = Observable.interval(1000).subscribe(data => {
                    if (this.filterTableData.length == this.dataSourceData.data.length) {
                      if (this.subscription)
                        this.subscription.unsubscribe();
                      setTimeout(() => { this.dataSourceData.paginator = this.paginator });

                    }
                  });
                }
                setTimeout(() => { this.dataSourceData.paginator = this.paginator }, 0);
                console.log('filterTableData =>', this.filterTableData, this.navigationData);
              }
            }
            else {
              this.resourceData = result;
              this.filterTableData = [];
              this.dataSourceData = new MatTableDataSource(this.filterTableData);
              setTimeout(() => { this.dataSourceData.paginator = this.paginator }, 0);
            }
          }
          else {
            this.resourceData = result;
            this.filterTableData = [];
            this.dataSourceData = new MatTableDataSource(this.filterTableData);
            setTimeout(() => { this.dataSourceData.paginator = this.paginator }, 0);
          }
          setTimeout(() => { this.loading = false, this.refreshActionD = false }, 0);
        }, error => {
          console.log("Failed :: " + JSON.stringify(error));
          this.showAlert(error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : error.message, ActionType.ERROR, error.status);
          this.loading = false;
          this.refreshActionD = false;
          this.resourceData = [];
        });
      }
    }
    else {
      this._dasboardService.getVvDashboardNew().subscribe((result: IDrilldownInfo[]) => {
        //  result=this.drilldownData;
        console.log("Result from Server::::::::", JSON.stringify(result), this.filterKeyData);

        if (result) {
          if (result.length > 0) {
            if (!_.isEqual(this.drilldownData, result)) {
              this.drilldownData = result;
              let filterKeyindex = this.filterKeyData.findIndex(x => x.filterType == selctionType);
              //   let navigateddata=this.navigationData[this.navigationData.length-1];
              let clickedFilterData = [];
              clickedFilterData = this.drilldownData.filter(ele => {
                if (selctionType == IypeData.building) {
                  return true;
                }
                else if (selctionType == IypeData.level) {
                  return ele.buildId == this.navigationData[this.navigationData.length - 1].id;
                }
                else if (selctionType == IypeData.department) {
                  return ele.floorId == this.navigationData[this.navigationData.length - 1].id;
                }
                else
                  return false
              });
              this.filterTableData =
                _(clickedFilterData)
                  .groupBy(this.filterKeyData[filterKeyindex].filterString)
                  .map((objs, key) => ({
                    'Id': objs[0][this.filterKeyData[filterKeyindex].filterId],
                    'previousId': id,
                    'name': objs[0][this.filterKeyData[filterKeyindex].filterName],
                    'type': this.filterKeyData[filterKeyindex].filterType,
                    'totalAppointments': _.sumBy(objs, 'totalAppointments'),
                    'patientsCheckedIn': _.sumBy(objs, 'patientsCheckedIn'),
                    'waitingTime': _.sumBy(objs, 'waitingTime'),
                    'patientsServed': _.sumBy(objs, 'patientsServed'),
                    'patientsWaiting': _.sumBy(objs, 'patientsWaiting')
                  }))
                  .value();
              // this.dataSourceData = new MatTableDataSource(this.filterTableData);
              // if (this.filterTableData.length == this.dataSourceData.data.length) {
              //   setTimeout(() => { this.dataSourceData.paginator = this.paginator });
              // } else {
              //   this.subscription = Observable.interval(1000).subscribe(data => {
              //     if (this.filterTableData.length == this.dataSourceData.data.length) {
              //       if (this.subscription)
              //         this.subscription.unsubscribe();
              //       setTimeout(() => { this.dataSourceData.paginator = this.paginator });

              //     }
              //   });
              // }
              setTimeout(() => { this.dataSourceData.paginator = this.paginator }, 0);
              console.log('filterTableData =>', clickedFilterData, selctionType);
            }
          }
          else {
            this.drilldownData = result;
            this.filterTableData = [];
            this.dataSourceData = new MatTableDataSource(this.filterTableData);
            setTimeout(() => { this.dataSourceData.paginator = this.paginator }, 0);
          }
        }
        else {
          this.drilldownData = result;
          this.filterTableData = [];
          this.dataSourceData = new MatTableDataSource(this.filterTableData);
          setTimeout(() => { this.dataSourceData.paginator = this.paginator }, 0);
        }
        setTimeout(() => { this.loading = false, this.refreshActionD = false }, 0);

      }, error => {
        console.log("Failed :: " + JSON.stringify(error));
        this.showAlert(error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : error.message, ActionType.ERROR, error.status);
        this.loading = false;
        this.refreshActionD = false;
      });
    }
    //this.refreshActionD=false;
  }
  getVvDashboardNew(action: boolean) {
    this.refreshActionD = true;
    this._dasboardService.getVvDashboardNew().subscribe((result: IDrilldownInfo[]) => {
      console.log("Result from Server::::::::", JSON.stringify(result), this.filterKeyData);

      if (result) {

        if (result.length > 0) {

          this.drilldownData = result;
          let filterKeyindex = this.filterKeyData.findIndex(x => x.filterType == IypeData.building);
          this.filterTableData =
            _(this.drilldownData)
              .groupBy(this.filterKeyData[filterKeyindex].filterString)
              .map((objs, key) => ({
                'Id': objs[0][this.filterKeyData[filterKeyindex].filterId],
                'previousId': 0,
                'name': objs[0][this.filterKeyData[filterKeyindex].filterName],
                'type': this.filterKeyData[filterKeyindex].filterType,
                'totalAppointments': _.sumBy(objs, 'totalAppointments'),
                'patientsCheckedIn': _.sumBy(objs, 'patientsCheckedIn'),
                'waitingTime': _.sumBy(objs, 'waitingTime'),
                'patientsServed': _.sumBy(objs, 'patientsServed'),
                'patientsWaiting': _.sumBy(objs, 'patientsWaiting')
              }))
              .value();
          this.dataSourceData = new MatTableDataSource(this.filterTableData);
          if (this.filterTableData.length == this.dataSourceData.data.length) {
            setTimeout(() => { this.dataSourceData.paginator = this.paginator });
          } else {
            this.subscription = Observable.interval(1000).subscribe(data => {
              if (this.filterTableData.length == this.dataSourceData.data.length) {
                if (this.subscription)
                  this.subscription.unsubscribe();
                setTimeout(() => { this.dataSourceData.paginator = this.paginator });

              }
            });
          }
          setTimeout(() => { this.dataSourceData.paginator = this.paginator });
          console.log('filterTableData =>', this.filterTableData);
        }
        else {
          this.drilldownData = result;
          this.filterTableData = [];
          this.dataSourceData = new MatTableDataSource(this.filterTableData);
          setTimeout(() => { this.dataSourceData.paginator = this.paginator }, 0);
        }
      }
      else {
        this.drilldownData = result;
        this.filterTableData = [];
        this.dataSourceData = new MatTableDataSource(this.filterTableData);
        setTimeout(() => { this.dataSourceData.paginator = this.paginator }, 0);
      }
      this.loading = false;
      this.refreshActionD = false;
    }, error => {
      console.log("Failed :: " + JSON.stringify(error));
      this.showAlert(error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : error.message, ActionType.ERROR, error.status);
      this.loading = false;
      this.refreshActionD = false;
    });
  }
  navigateBackToDrillDown(action?: boolean, matindex?: number, obj?: INavigationModel) {
    this.loading = true;
    this.refreshActionD = true;
    if (action) {
      matindex = this.navigationData.length - 1 > -1 ? this.navigationData.length - 1 : 0;
      obj = this.navigationData.length - 1 > -1 ? this.navigationData[this.navigationData.length - 1] : this.navigationData[0];
    }
    console.log('In navigate=>', matindex, obj, this.navigationData.length, action);
    let filterKeyindex = this.filterKeyData.findIndex(x => x.filterType == obj.type);
    // let indx = this.navigationData.findIndex(x => x.type == obj.type);
    // if (indx == -1)
    //   this.navigationData.push({ id: id, name: name, type: type,indexPostion:indexPostion } as INavigationModel);
    let clickedFilterData = [];
    if (obj.type == IypeData.building || obj.type == IypeData.level || obj.type == IypeData.department) {
      clickedFilterData = this.drilldownData.filter(ele => {
        if (obj.type == IypeData.building) {
          return true;
        }
        else if (obj.type == IypeData.level) {
          return ele.buildId == obj.previousId;
        }
        else if (obj.type == IypeData.department) {
          return ele.floorId == obj.previousId;
        }
        else
          return false
      });
    }
    else if (obj.type == IypeData.service) {
      clickedFilterData = this.resourceData.filter(ele => {
        if (obj.type == IypeData.service) {
          return ele.deptId == obj.previousId
        }
        else
          return false
      });
    }
    console.log('clickedBuildingData=>', clickedFilterData, this.drilldownData, obj, this.navigationData, this.filterKeyData[filterKeyindex]);

    if (clickedFilterData.length > 0) {
      let id = 0;
      if (matindex > 0) {
        id = this.navigationData[matindex - 1].id;
      }
      this.filterTableData =
        _(clickedFilterData)
          .groupBy(this.filterKeyData[filterKeyindex].filterString)
          .map((objs, key) => ({
            'Id': objs[0][this.filterKeyData[filterKeyindex].filterId],
            'previousId': id,
            'name': objs[0][this.filterKeyData[filterKeyindex].filterName],
            'type': this.filterKeyData[filterKeyindex].filterType,
            'totalAppointments': _.sumBy(objs, 'totalAppointments'),
            'patientsCheckedIn': _.sumBy(objs, 'patientsCheckedIn'),
            'waitingTime': _.sumBy(objs, 'waitingTime'),
            'patientsServed': _.sumBy(objs, 'patientsServed'),
            'patientsWaiting': _.sumBy(objs, 'patientsWaiting')
          }))
          .value();
    }
    else
      this.filterTableData = [];
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.dataSourceData = new MatTableDataSource(this.filterTableData);
    // if (this.filterTableData.length == this.dataSourceData.data.length) {
    //   setTimeout(() => { this.dataSourceData.paginator = this.paginator });
    // } else {
    //   this.subscription = Observable.interval(1000).subscribe(data => {
    //     if (this.filterTableData.length == this.dataSourceData.data.length) {
    //       if (this.subscription)
    //         this.subscription.unsubscribe();
    //       setTimeout(() => { this.dataSourceData.paginator = this.paginator });

    //     }
    //   });
    // }
    setTimeout(() => { this.paginator && obj.indexPostion != 0 ? this.paginator.pageIndex = obj.indexPostion : false, this.dataSourceData.paginator = this.paginator }, 0);
    console.log('filterTableData =>', this.filterTableData, this.navigationData);

    for (let k = this.navigationData.length - 1; k >= matindex; k--) {
      this.navigationData.splice(k, 1);
    }
    this.loading = false;
    this.refreshActionD = false;
  }
  building1(id, previousid, name, type, action) {
    this.loading = true;
    this.refreshActionD = true;
    console.log('inside building', id, name, type);
    let filterKeyindex = 0;
    let indx = this.navigationData.findIndex(x => x.type == type);
    let indexPostion = 0;
    if (this.paginator)
      indexPostion = this.paginator.pageIndex;
    if (indx == -1)
      this.navigationData.push({ id: id, previousId: previousid, name: name, type: type, indexPostion: indexPostion } as INavigationModel);
    if (IypeData.level == type || IypeData.building == type || IypeData.service == type) {
      let clickedFilterData = [];
      if (IypeData.service == type) {
        clickedFilterData = this.resourceData.filter(ele => {
          if (type == IypeData.service) {
            filterKeyindex = this.filterKeyData.findIndex(x => x.filterType == IypeData.resource);
            return ele.serviceId == id

          }
          else
            return false
        });
      }
      else {
        clickedFilterData = this.drilldownData.filter(ele => {
          if (type == IypeData.building) {
            filterKeyindex = this.filterKeyData.findIndex(x => x.filterType == IypeData.level);
            return ele.buildId == id

          }
          else if (type == IypeData.level) {
            filterKeyindex = this.filterKeyData.findIndex(x => x.filterType == IypeData.department);
            return ele.floorId == id
          }
          else
            return false
        });
      }
      console.log('clickedBuildingData=>', clickedFilterData, this.resourceData, this.filterKeyData[filterKeyindex]);

      if (clickedFilterData.length > 0) {

        this.filterTableData =
          _(clickedFilterData)
            .groupBy(this.filterKeyData[filterKeyindex].filterString)
            .map((objs, key) => ({
              'Id': objs[0][this.filterKeyData[filterKeyindex].filterId],
              'previousId': id,
              'name': objs[0][this.filterKeyData[filterKeyindex].filterName],
              'type': this.filterKeyData[filterKeyindex].filterType,
              'totalAppointments': _.sumBy(objs, 'totalAppointments'),
              'patientsCheckedIn': _.sumBy(objs, 'patientsCheckedIn'),
              'waitingTime': _.sumBy(objs, 'waitingTime'),
              'patientsServed': _.sumBy(objs, 'patientsServed'),
              'patientsWaiting': _.sumBy(objs, 'patientsWaiting')
            }))
            .value();
      }
      else
        this.filterTableData = [];
      if (this.paginator)
        this.paginator.firstPage();
      // this.paginator.pageIndex
      this.dataSourceData = new MatTableDataSource(this.filterTableData);
      if (this.filterTableData.length == this.dataSourceData.data.length) {
        setTimeout(() => { this.dataSourceData.paginator = this.paginator });
      } else {
        this.subscription = Observable.interval(1000).subscribe(data => {
          if (this.filterTableData.length == this.dataSourceData.data.length) {
            if (this.subscription)
              this.subscription.unsubscribe();
            setTimeout(() => { this.dataSourceData.paginator = this.paginator });

          }
        });
      }
      setTimeout(() => { this.dataSourceData.paginator = this.paginator }, 0);
      console.log('filterTableData =>', this.filterTableData, this.navigationData);

      this.loading = false;
      this.refreshActionD = false;
    }
    else {
      this._dasboardService.getVvDashboardServices(id).subscribe((result: IServicesInfo[]) => {
        console.log("getVvDashboardServices=>", result);

        if (result) {
          if (result.length > 0) {
            filterKeyindex = this.filterKeyData.findIndex(x => x.filterType == IypeData.service);
            this.resourceData = result;
            this.filterTableData =
              _(this.resourceData)
                .groupBy(this.filterKeyData[filterKeyindex].filterString)
                .map((objs, key) => ({
                  'Id': objs[0][this.filterKeyData[filterKeyindex].filterId],
                  'previousId': id,
                  'name': objs[0][this.filterKeyData[filterKeyindex].filterName],
                  'type': this.filterKeyData[filterKeyindex].filterType,
                  'totalAppointments': _.sumBy(objs, 'totalAppointments'),
                  'patientsCheckedIn': _.sumBy(objs, 'patientsCheckedIn'),
                  'waitingTime': _.sumBy(objs, 'waitingTime'),
                  'patientsServed': _.sumBy(objs, 'patientsServed'),
                  'patientsWaiting': _.sumBy(objs, 'patientsWaiting')
                }))
                .value();
            if (this.paginator)
              this.paginator.firstPage();
            // this.paginator.pageIndex
            this.dataSourceData = new MatTableDataSource(this.filterTableData);
            if (this.filterTableData.length == this.dataSourceData.data.length) {
              setTimeout(() => { this.dataSourceData.paginator = this.paginator });
            } else {
              this.subscription = Observable.interval(1000).subscribe(data => {
                if (this.filterTableData.length == this.dataSourceData.data.length) {
                  if (this.subscription)
                    this.subscription.unsubscribe();
                  setTimeout(() => { this.dataSourceData.paginator = this.paginator });

                }
              });
            }
            setTimeout(() => { this.dataSourceData.paginator = this.paginator }, 0);
            console.log('filterTableData =>', this.filterTableData, this.navigationData);
          }
          else {
            this.resourceData = result;
            this.filterTableData = [];
            this.dataSourceData = new MatTableDataSource(this.filterTableData);
            setTimeout(() => { this.dataSourceData.paginator = this.paginator }, 0);
          }
        }
        else {
          this.resourceData = result;
          this.filterTableData = [];
          this.dataSourceData = new MatTableDataSource(this.filterTableData);
          setTimeout(() => { this.dataSourceData.paginator = this.paginator }, 0);
        }
        setTimeout(() => { this.loading = false, this.refreshActionD = false }, 0);

      }, error => {
        console.log("Failed :: " + JSON.stringify(error));
        this.showAlert(error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : error.message, ActionType.ERROR, error.status);
        this.loading = false;
        this.refreshActionD = false;
        this.resourceData = [];
      });
    }
  }

  getListData(obj) {
    this.dataSourceData.paginator = this.paginator;

  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
