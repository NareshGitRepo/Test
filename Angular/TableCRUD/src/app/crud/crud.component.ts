import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import { FormComponent } from '../form/form.component';
import { EditdataComponent } from '../editdata/editdata.component';
import {MatPaginator} from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DialogData {
  empid:number;
  ename: string;
  position:string;
  sal:number;
  date:Date;
}

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit {

  dataList:DialogData[]=[];
  pagelength: any[];
  displayedColumns: string[] = ['empid', 'ename', 'position', 'sal','date'];
  dataSource = new MatTableDataSource<DialogData>();
  emp_url:any='../assets/empdata.json';
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  ngOnInit() {}

  getHColor(){
    return 'red';
  }
  getbgColor(esal){
    if(esal>=15000){
      return 'pink';
    }
    else if( esal<=14000){
    return 'yellow';
    }
  }

  getColor(csal){
    if(csal>=15000){
      return 'red';
    }
    else if(csal<=14000){
      return 'green';
    }
  }

  opensnackbar(message:string, action:string){
    this.snackBar.open(message, action, {
      duration: 1000,
    });
  }

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar, private http:HttpClient) {
    
    this.getJSON().subscribe(empdata => {
      console.log("local json",empdata);

      this.dataList=empdata;
      console.log("local json datalist",this.dataList);

      this.dataSource = new MatTableDataSource(this.dataList); 
      console.log("dataSource json",this.dataSource)
      
      this.opensnackbar('Data Loaded','Success');
     this.dataSource.paginator = this.paginator;
     },
     error =>{
      console.log('failed');
      this.opensnackbar('Unable to Load Data','Failed');
     }); 
   }
   public getJSON(): Observable<any> {
    return this.http.get(this.emp_url);
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  

  AddData(): void {
    const dialogRef = this.dialog.open(FormComponent, { width: '500px' });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      if(result){
        this.dataList.push(result);
        this.dataSource = new MatTableDataSource(this.dataList);
        this.dataSource.paginator = this.paginator;
        this.pagelength=result;
        this.opensnackbar('create emp data','Success');
      }
      else if(!result){
       this.opensnackbar('Unable to Create data','Failed');
        this.pagelength=result; 
      }
    });
  }

  deletedata(element){
     console.log('delete the record');
     this.dataSource.data = this.dataSource.data.filter( data =>data != element);
     this.snackBar.open('Your Remove the Emp data', 'Delete Data', {
      duration: 1000,
    });
  }

  editdata(rowData){
    console.log('edit the record');
    const dialogRef = this.dialog.open(EditdataComponent, { width: '500px', data:rowData });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      if(result){
      this.dataList.forEach(udata=>{
        if(udata.empid==result.empid){
          udata.empid=result.empid;
          udata.ename=result.ename;
          udata.position=result.position;
          udata.sal=result.sal;
          udata.date=result.date;
          this.dataSource = new MatTableDataSource(this.dataList);
          this.dataSource.paginator = this.paginator;
        }
      });
      this.opensnackbar('Modify Data','Success');
    }
    });
  }
 
}
