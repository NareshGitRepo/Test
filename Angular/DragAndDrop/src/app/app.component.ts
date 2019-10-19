import { Component } from '@angular/core';
import { DndDropEvent,DropEffect} from 'ngx-drag-drop';
import { field, value } from './_model/form.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DragAndDrop';
  InfoForm:FormGroup;
  value:value={
    label:"",
    value:""
  };
  success = false;
  Values={
    name:"Naresh",
    email:"knaresh@df.co",
    phone:"32423432432",
    Date:"09/09/2019",
    Address:"dsfsdfsdfsdfsdfsdf",
    
  };

  fieldModels:Array<field>=[
    {
      "type": "text",
      "icon": "fa-font",
      "label": "Name",
      "description": "Enter your name",
      "placeholder": "Enter your name",
      "className": "form-control",
      "subtype": "text",
      "regex":"[a-zA-Z]+$",
      "handle":true
    },
    {
      "type": "email",
      "icon": "fa-envelope",
      "required": true,
      "label": "Email",
      "description": "Enter your email",
      "placeholder": "Enter your email",
      "className": "form-control",
      "subtype": "text",
      "regex" : "^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\.([a-zA-Z]{2,5})$",
      "errorText": "Please enter a valid email",
      "handle":true
    },
    {
      "type": "phone",
      "icon": "fa-phone",
      "label": "Phone",
      "description": "Enter your phone",
      "placeholder": "Enter your phone",
      "className": "form-control",
      "subtype": "text",
      "regex" : "^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$",
      "errorText": "Please enter a valid phone number",
      "handle":true
    },
  
    {
      "type": "date",
      "icon":"fa-calendar",
      "label": "Date",
      "placeholder": "Date",
      "className": "form-control"
    },
    
    {
      "type": "textarea",
      "icon":"fa-text-width",
      "label": "Address" ,
      "regex":"[a-zA-Z0-9]+$"
    },
    
    {
      "type": "checkbox",
      "required": true,
      "label": "Language",
      "icon":"fa-list",
      "description": "Checkbox",
      "inline": true,
      "values": [
        {
          "label": "English",
          "value": "option-1"
        },
        {
          "label": "Hindi",
          "value": "option-2"
        }
      ]
    },
    {
      "type": "radio",
      "icon":"fa-list-ul",
      "label": "Gender",
      "description": "Radio boxes",
      "values": [
        {
          "label": "Male",
          "value": "option-1"
        },
        {
          "label": "Female",
          "value": "option-2"
        }
      ]
    },
    {
      "type": "autocomplete",
      "icon":"fa-bars",
      "label": "Program Lang",
      "description": "Select",
      "placeholder": "Select",
      "className": "form-control",
      "values": [
        {
          "label": "Angular",
          "value": "option-1"
        },
        {
          "label": "Java",
          "value": "option-2"
        },
        {
          "label": "Oracle",
          "value": "option-3"
        }
      ]
    },
    {
      "type": "file",
      "icon":"fa-file",
      "label": "File Upload",
      "className": "form-control",
      "subtype": "file"
    },
    {
      "type": "button",
      "icon":"fa-paper-plane",
      "subtype": "submit",
      "label": "Submit"
    }
  ];
  

  modelFields:Array<field>=[];
  model:any = {
    name:'App name...',
    theme:{
      bgColor:"ffffff",
      textColor:"555555",
      bannerImage:""
    },
    attributes:this.modelFields
  };

  report = false;
  reports:any = [];

  constructor(private fb:FormBuilder){
     this.InfoForm=this.fb.group({
       name:['',Validators.required],
       email:['',Validators.required],
       phone:['',Validators.required],
       date:['',Validators.required],
       datetime:['',Validators.required],
       Address:['',Validators.required],
       uploadfile:['',Validators.required],
       Select:['',Validators.required],
       Radio:['',Validators.required],

     })
  }

  onDragStart(event:DragEvent) {
    console.log("drag started", JSON.stringify(event, null, 2));
  }
  
  onDragEnd(event:DragEvent) {
    console.log("drag ended", JSON.stringify(event, null, 2));
  }
  
  onDraggableCopied(event:DragEvent) {
    console.log("draggable copied", JSON.stringify(event, null, 2));
  }
  
  onDraggableLinked(event:DragEvent) {
    console.log("draggable linked", JSON.stringify(event, null, 2));
  }
    
   onDragged( item:any, list:any[], effect:DropEffect ) {
    if( effect === "move" ) {
      const index = list.indexOf( item );
      list.splice( index, 1 );
    }
  }
      
  onDragCanceled(event:DragEvent) {
    console.log("drag cancelled", JSON.stringify(event, null, 2));
  }
  
  onDragover(event:DragEvent) {
    console.log("dragover", JSON.stringify(event, null, 2));
  }
  
  onDrop( event:DndDropEvent, list?:any[] ) {
    if( list && (event.dropEffect === "copy" || event.dropEffect === "move") ) {
      
      if(event.dropEffect === "copy")
      event.data.name = event.data.type+'-'+new Date().getTime();
      let index = event.index;
      if( typeof index === "undefined" ) {
        index = list.length;
      }
      list.splice( index, 0, event.data );
    }
  }

  addValue(values){
    values.push(this.value);
    this.value={label:"",value:""};
  }

  initReport(){
    this.report = true; 
    let input = {
      id:this.model._id
    }
  }

  toggleValue(item){
    item.selected = !item.selected;
  }

  submit(){
  console.log(this.InfoForm.value)
  }
}
