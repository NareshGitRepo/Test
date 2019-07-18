import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
export interface CardData{
  CardNumber:any;
  CardName:string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CardDetails';
  Card_Form: FormGroup;

  Cards:any = ['Pan Card','Aadhar Card','Driving License'];

  constructor(private fb:FormBuilder ){
    this.Card_Form= this.fb.group({
      CardName:['',[Validators.required]], detailsArray:this.fb.array([])
    })
  }
   get checkedData() {
     return <FormArray>this.Card_Form.get('detailsArray');
   }
  
  // createData(data) {
  //   console.log('data=>30',data);
  //   const CData = this.fb.group({
  //     CNumber:['',[Validators.required,Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]],
  //     CName:['',[Validators.required,Validators.pattern('[a-zA-Z]+$')]],
  //     name:[data]

  //   })
  //   this.checkedData.push(CData);
    
  // }
  ngOnInit() {
  }
  SelectCard(id){
    console.log('cardName',id);

    if (id.length > 0) {
      id.forEach(element => {
        let CardIndex = this.checkedData.controls.findIndex(x => x.value.name == element);
        console.log('CardIndex',CardIndex);
        
        if (CardIndex == -1)
          {
            this.checkedData.push(this.fb.group({
              CNumber:['',[Validators.required,Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]],
              CName:['',[Validators.required,Validators.pattern('[a-zA-Z]+$')]],
              name:[element]
            }));
          }
      });
 
      this.checkedData.controls.forEach(data => {
        let CNo = id.findIndex(x => x == data.value.name);
        console.log('index=>',CNo,this.checkedData.value,data.value.name);
        let y=0;
        if (CNo == -1)
        {
          this.checkedData.removeAt(y);
        }
        y++;
      });
    }
    else {
      for (let i = 0; i < this.checkedData.controls.length; i++) {
        this.checkedData.removeAt(i);
      }
    } 
  }

  Submit(){
    console.log(this.Card_Form.value);
    if(this.Card_Form.value){
      let carddata:CardData[];
      carddata=this.Card_Form.value.detailsArray
      console.log('carddata',carddata);
    }
  }
}
