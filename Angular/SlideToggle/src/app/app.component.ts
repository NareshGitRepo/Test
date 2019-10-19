import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'SlideToggle';
  active:false
  testing=[];

  reports=[{
    name:'Registration', sts:true
    },
    {
      name:'CheckIn', sts:false
    }];
    
  toogleform:FormGroup;
  

  constructor(private fb: FormBuilder){ 
    this.toogleform=this.fb.group({
      reportArray:this.fb.array([])
    })
  }

  get checkedForms() {
    return <FormArray>this.toogleform.get('reportArray');
    
  }
  
  
  ngOnInit(){
    for(var index in this.reports){
       this.reports[index];   
       let data=this.reports[index].sts;   
       this.testing.push(data)   
      //  console.log(this.reports[index])
         console.log(this.testing)
    }
   this.checkedForms.push(this.fb.group({
    toggle:['',Validators.requiredTrue],
    data:['',Validators.required]
   }));
  }
    
  Reports(){
    console.log(this.toogleform.value);
      console.log(this.toogleform.value.reportArray);
  }
  onToggleChange(event){
    console.log(this.toogleform.value.toggle.status)
  }
}
