import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface EmpList{
  empid:number;
  empname:string;
  position:string
  salary:number;
}
export interface SalConditions{
  con:any;
  value:number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SelectData';
  emp_form: FormGroup;

  Conditions:SalConditions[] =[
    {con:'below 5000',value:1},
    {con:'5000 to 10000', value:2},
    {con:'above 10000', value:3}
  ];
  empdata:EmpList[]=[
    {empid:1081, empname:'stella',position:'manager',salary:20000},
    {empid:1082, empname:'martin',position:'tl',salary:18000},
    {empid:1083, empname:'king',position:'tl',salary:15000},
    {empid:1084, empname:'master',position:'angdev',salary:10000},
    {empid:1085, empname:'scott',position:'dbdev',salary:8000},
    {empid:1086, empname:'corthar',position:'jdev',salary:6000},
    {empid:1087, empname:'sony',position:'clerk',salary:4000},
    {empid:1088, empname:'abc',position:'uooi',salary:7000},
    {empid:1089, empname:'erew',position:'marketing',salary:9000},
    {empid:1090, empname:'ewqrsd',position:'retailer',salary:10000},
  ]

  
  constructor(private fb:FormBuilder){
   this.emp_form=this.fb.group({
     salary:['',[Validators.required]]
   });
  }
  displayedColumns: string[] = ['empid', 'empname', 'position', 'salary'];
  dataSource = this.empdata;
   
  onSelect(value){
      let filterData=[];
      console.log(value)

      if(value==1){
       filterData = this.empdata.filter(obj=>{ return obj.salary<5000 });
       console.log('emplist=>',this.empdata)
       console.log('below 5000 =>',filterData)
      }
      else if(value==2){
        filterData = this.empdata.filter(obj=>{ return obj.salary>5000 && obj.salary<10000});
        console.log('5000 to 10000 =>',filterData)
      }
      else 
      {
        filterData = this.empdata.filter(obj =>{ return obj.salary>10000});
        console.log('above 10000',filterData)
      }
      console.log('filterData =>',filterData);
      
      this.dataSource = filterData;
      console.log('final data',this.dataSource)
  }
}
