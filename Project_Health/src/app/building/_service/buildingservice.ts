import { Injectable } from '@angular/core';
import { IBuilding } from '../_model/buildingmodel';

@Injectable({providedIn:'root'})

export class BuildingService {

buildingsList:IBuilding[] = [
    {buildingName:"Building 1",buildingArabicName:"667744"},
    {buildingName:"Building 2",buildingArabicName:"632744"},
    {buildingName:"Building 3",buildingArabicName:"6678944"},
    {buildingName:"Building 4",buildingArabicName:"6673414"},
    {buildingName:"Building 5",buildingArabicName:"66773444"},
    {buildingName:"Building 6",buildingArabicName:"6312744"},
    {buildingName:"Building 7",buildingArabicName:"66855944"},
    {buildingName:"Building 8",buildingArabicName:"66233414"},
    {buildingName:"Building 9",buildingArabicName:"6655944"},
    {buildingName:"Building 10",buildingArabicName:"662414"},
    ]

getBuildings()
{
    return this.buildingsList;
}
}