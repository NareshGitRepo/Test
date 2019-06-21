import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface departmentlist{
  did:number;
  dname:string;
  users:any[];
}

export interface users{
  uid:number;
  uname:string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ServiceCreation';
  department_form:FormGroup;
  userList=[];
  service='';
  
  constructor(private fb:FormBuilder, private router:Router)
  {
    this.department_form=this.fb.group({
      dpname:[''],
      users:[''],
      sname:['',[Validators.minLength(5),Validators.pattern('[a-zA-Z0-9]+$')]]
    });
  }
  departmentlist=[
    {
      did:1, dname:'web', users:[{uid:121, uname:'stella'},{uid:122,uname:'king'} ]
    },
    {
      did:2, dname:'db', users:[{uid:231, uname:'sanny'},{uid:232,uname:'master'} ]
    },
    {
      did:3, dname:'testing', users:[{uid:421, uname:'raghu'},{uid:422,uname:'alita'} ]
    },
  ];

 // public selecteddept= this.departmentlist[0];
  
  onSelect(value) { 
   console.log(value); 
   let index=this.departmentlist.findIndex(item=>{
     return item.dname==value
   });
   console.log(index)
   if(index!=-1)
   {
    this.userList = this.departmentlist[index].users;
    console.log(this.userList)
   }
  }

  getvalue(event){
     this.service =event.target.value;
     console.log(this.service)
  } 

  Nextpage(){
    //this.router.navigateByUrl('submit');
    let smsg=this.department_form.value;
    console.log(smsg)

    this.router.navigate(["submit"]);
  }
}
