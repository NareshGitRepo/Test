import { Component, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';

import { SelectionModel } from '@angular/cdk/collections';
import { PrivilegesService } from '../_service/privileges.service';
import { FormBuilder, FormGroup } from '@angular/forms';


import { ActionType, AlertMessageService } from '../../_services/alertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { IRoles, roleType } from '../_model/previlegemodel';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../_helpers/app.config';

export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: any;
  level: number;
  expandable: boolean;
}


@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] {   console.log('this.dataChange.value',this.dataChange.value)
    return this.dataChange.value; 
  }

  constructor(private privilegeservice: PrivilegesService) {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const TREE_DATA = this.privilegeservice.getallRolesInfo();
    const data = this.buildFileTree(TREE_DATA[0], 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: object, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];    console.log('value',value)    
      const node = new TodoItemNode();    
      node.item = key;   console.log('node.item',node.item)

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

}

@Component({
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.scss'],
  providers: [ChecklistDatabase]
})
export class PrivilegesComponent implements OnInit {
  totalRoles: IRoles[];
  
  roleForm: FormGroup;
  _tokenInfo: IUserUpdateDto;
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  constructor(private database: ChecklistDatabase, private fb: FormBuilder, private cdrRef: ChangeDetectorRef,
    private translate: TranslateService, private appConfig: AppConfig,
    private alertMessage: AlertMessageService, private privilegeservice: PrivilegesService) {

    let tokenData = this.appConfig.getTokenInfo() as ITokenInfo;
    let roleId = 0;
   
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    if (this._tokenInfo && tokenData) {
      roleId =this._tokenInfo.roles.length>0? this._tokenInfo.roles[0].roleId:0;
      console.log("roleId=>",roleId);
    }
    this.privilegeservice.getRolesByUserRoleId()
      .subscribe((response: IRoles[]) => {
        if (response) {
          this.totalRoles = response;
          console.log('this.totalRoles',this.totalRoles)
        }
        else
          this.totalRoles = [];
      }, error => {
        this.totalRoles = [];
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR);
      });
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
      console.log('this.dataSource.data',this.dataSource.data)
      console.log('this.dataSource',this.dataSource)
    });
  }

  showAlert(error: any, action: ActionType) {
    setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  roleSelect() {
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      this.checklistSelection.deselect(this.treeControl.dataNodes[i]);
    };
    let rolesData = [];
    switch (this.roleForm.value.roleName) {
      case roleType.SuperAdmin:
        rolesData.push(
          { Childrens: "Dashboard" }, { Childrens: "Clients" }, { Childrens: "Users" },
          { Childrens: "Privileges" }, { Childrens: "CurrentTokens" },
          { childrens: "Roles" }, { Childrens: "CurrentDayAppointments" },
          { Childrens: "Tokens History" }, { Childrens: "AppointmentHistory" }
        );
        break;
      case roleType.ClientAdmin:

        rolesData.push(
          { Childrens: "Dashboard" }, { Childrens: "Groups" }, { Childrens: "Facility" }, { Childrens: "Users" },
          { Childrens: "CurrentTokens" },
          { Childrens: "CurrentDayAppointments" },
          { Childrens: "Tokens History" }, { Childrens: "AppointmentHistory" }
        );
        break;
      case roleType.GroupAdmin:
        rolesData.push(
          { Childrens: "Dashboard" }, { Childrens: "Groups" }, { Childrens: "Departments" }, { Childrens: "Devices" },
          { Childrens: "Facility" }, { Childrens: "Queues" }, { Childrens: "Users" }, { Childrens: "Roles" }, { Childrens: "Privileges" },
          { Childrens: "CurrentTokens" }, { Childrens: "Token Service" },
          { Childrens: "CurrentDayAppointments" }, { Childrens: "Kiosk Errors" },
          { Childrens: "Tokens History" }, { Childrens: "AppointmentHistory" }
        );
        break;
      case roleType.FacilityAdmin:
        rolesData.push(
          { Childrens: "Dashboard" }, { Childrens: "Departments" }, { Childrens: "Devices" },
          { Childrens: "Queues" }, { Childrens: "Users" }, { Childrens: "Roles" }, { Childrens: "Privileges" },
          { Childrens: "CurrentTokens" }, { Childrens: "Token Service" },
          { Childrens: "CurrentDayAppointments" }, { Childrens: "Kiosk Errors" },
          { Childrens: "Tokens History" }, { Childrens: "AppointmentHistory" }
        );
        break;
      default:

        rolesData.push(
          { Childrens: "Dashboard" },
          { Childrens: "CurrentTokens" }, { Childrens: "Token Service" },
          { Childrens: "CurrentDayAppointments" },
          { Childrens: "Tokens History" }, { Childrens: "AppointmentHistory" }
        );
        break;
    }
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      for (let j = 0; j < rolesData.length; j++) {

        if (this.treeControl.dataNodes[i].item == (rolesData[j].Childrens)) {
          this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
          this.treeControl.expand(this.treeControl.dataNodes[i]);
        }
      }
    }
    this.cdrRef.detectChanges();
  }
  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  ngOnInit() {
    this.roleForm = this.fb.group({
      roleName: ['']
    })

  }
  onSubmit() {
  }

}
