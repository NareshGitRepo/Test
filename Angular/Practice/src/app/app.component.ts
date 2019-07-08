import { Component } from '@angular/core';
import * as _ from 'lodash';

export interface emplist{
  empid:number;
  ename:string;
  department:string;
  deptid:number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Practice';
  Name:string='Welcome';
  Company:string='Vectramind';
  data=[]; 
  Find=[];
  Group=[];
  Empdata={};
  ddata={};
  deplist={};
  Keys={};
  emp=[];
   users = [
      { 'user': 'barney',  'age': 36, 'active': false },
      { 'user': 'fred',  'age': 40,   'active': true },
      { 'user': 'barney',  'age': 39, 'active': true },
      { 'user': 'fred',  'age': 47,   'active': true },
      { 'user': 'barney',  'age': 45, 'active': false },
      { 'user': 'pebbles',  'age': 56, 'active': true },
      { 'user': 'pebbles',  'age': 59, 'active': true }
    ];

    emplist=[
      {empid:1182, ename:'stella', department:'Web'},
      {empid:1183, ename:'martin', department:'AI'},
      {empid:1184, ename:'scott', department:'DB'},
      {empid:1185, ename:'barney', department:'Java'},
      {empid:1186, ename:'fred', department:'Testing'},
      {empid:1187, ename:'pebbles', department:'AI'},
      {empid:1188, ename:'king', department:'DB'},
      {empid:1189, ename:'stella', department:'Testing'},
      {empid:1192, ename:'pebbles', department:'Web'},
      {empid:1182, ename:'maala', department:'Web'}
    ];  
    
  constructor(){
    this.deplist= _.mapValues(_.groupBy(this.emplist, 'department'),
                         elist => elist.map(list => _.omit(list, 'department')));
    console.log('deplist',this.deplist);
    this.Keys=Object.keys(this.deplist);
    console.log('keys:: ',this.Keys);
      // var emp=Object.values(this.deplist);

   /*
    console.log(_.isNumber(8.4 * 5));   

    this.Empdata=_.groupBy(this.emplist,'department');
   console.log('emp data',this.Empdata);
   this.Keys=Object.keys(this.Empdata);
   console.log('keys:: ',this.Keys)
                                          //this.Empdata and this.ddata both group by
   this.ddata = _.mapValues(_.groupBy(this.emplist, 'department'),
                          elist => elist.map(list => _.omit(list, 'department')));
   console.log(this.ddata);

   _.forEach(this.users,function(value,key){
       console.log('value',value)
       console.log('key',key); 
  });

   this.Find=_.find(this.users,function(value){
     return value.age>36;
   });
   console.log('find data',this.Find);
   
   this.Group=_.groupBy(this.users,'user');
   console.log('group data',this.Group);
   
   console.log('key by', _.keyBy(this.users,'user'))
   
   console.log('order by',_.orderBy(this.users,['user','age'],['asc','desc']));
   
   console.log('some by',_.some(this.users,{ 'user': 'pebbles',  'age':70, 'active': true }));
   
   console.log('some by',_.some(this.users,{ 'user': 'pebbles', 'active': true }));
   console.log('sort by',_.sortBy(this.users,[function(data){
     return data.age;
   }]))

   console.log('sort by',_.sortBy(this.users,['user','age']))
   */
}
  
  findtext(event){
   console.log(event)
   /* let index=_.findIndex(this.users,function(data){
    return data.user==event.target.value;
   })
   console.log(index)

   if(index!=-1)
   {
    let userList = this.users[index];
    console.log(userList)
   } */

   this.data=_.filter(this.users,function(data){
    return data.user==event.target.value;
    }) 
    console.log("input data",this.data);   
  }

  onSelect(key){
   console.log('select value',key);
   this.emp=this.deplist[key];
      console.log(this.emp);
    }   
}
