import { Component, OnInit, ViewChild } from '@angular/core';
import { IBuilding } from '../_model/buildingmodel';
import { MatPaginator, MatTableDataSource, MatDialog, MatSort, MatDialogConfig } from '@angular/material';
import { BuildingService } from '../_service/buildingservice';
import { environment } from '../../../environments/environment';
import { BuildingcreateComponent } from '../buildingcreate/buildingcreate.component';

@Component({
  selector: 'app-buildingmanage',
  templateUrl: './buildingmanage.component.html',
  styleUrls: ['./buildingmanage.component.scss']
})
export class BuildingmanageComponent implements OnInit {
  selectedPage:any;
  initPage = 0;
  pageSize = environment.pageSize;
  buildingsList:IBuilding[];
  filterBuildings:IBuilding[];
  listflag: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  dataSource = new MatTableDataSource();
  searchdata:any;
  constructor(private dialog: MatDialog, private buildingsService:BuildingService) { }

  ngOnInit() {
    this.buildingsList = this.buildingsService.getBuildings();
    this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
  }

  getDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30vw';
    dialogConfig.height = '92.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0'};
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  createBuilding()
  {
    this.dialog.open(BuildingcreateComponent,this.getDialogConfig());
  }

  editBuilding(data)
  {
    this.dialog.open(BuildingcreateComponent,this.getDialogConfig(data));
  }

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;

    this.filterBuildings = this.buildingsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  sortData() {
    this.dataSource.sort = this.sort
  }
}
