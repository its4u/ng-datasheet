import { ItemEvent } from './../models/item-event';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CellDynamicComponent } from '../cell/cell-dynamic-component';
import { CellDynamicInterface } from '../cell/cell-dynamic-interface';
import { Filter } from '../models/filter';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'ds-cell-edit-drop-down',
  templateUrl: './cell-edit-drop-down.component.html',
  styleUrls: ['./cell-edit-drop-down.component.css']
})
export class CellEditDropDownComponent extends CellDynamicComponent implements OnInit, CellDynamicInterface {

  @ViewChild('container', { read: NgSelectComponent })
  container: NgSelectComponent;

  constructor() {
    super();
  }

  ngOnInit() {
    if (!this.isFilter) {
      this.container.open();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 9: // tab
      case 13: // enter
      case 27: // esc
      case 37: // left
      case 39: // right
        this.key.emit(event);
        break;
    }
  }

  onSelect(option: Object): void {
    // this.dataModel = option;

    const ie: ItemEvent = new ItemEvent();
    ie.item = option;
    ie.data = this.data;
    ie.column = this.column;
    ie.row = this.row;

    this.column.itemEvent.emit(ie);
  }

  isSelected(option: Object): boolean {
    return option === this.dataModel;
  }

  get dataModel(): string {
    if (this.isFilter) {
      const filters: Array<Filter> = this.data as Array<Filter>;
      const filter = filters.find(f => {
        return f.column === this.column;
      });
      return (filter) ? filter.value : null;
    } else {
      if (this.column.type && this.column.type === 'string') {
        return this.data[this.column.data];
      } else {
        return this.column.options.dataSet.find(element => {
          return element[this.column.options.value] === this.data[this.column.data];
        })[this.column.options.value];
      }
    }
  }

  set dataModel(val: string) {
    if (this.isFilter) {
      const filters: Array<Filter> = this.data as Array<Filter>;
      filters.find(filter => {
        return filter.column === this.column;
      }).value = val;
    } else {
      if (this.column.type && this.column.type === 'string') {
        this.data[this.column.data] = val;
      } else {
        this.data[this.column.data] = this.column.options.dataSet.find(element => {
          return element[this.column.options.value] === val;
        });
      }
    }
  }

  getPlaceHolder(): string {
    if (this.isFilter) {
      return this.placeHolder;
    } else {
      return this.column.options.placeHolder;
    }
  }

  getDisplayedLabel(): string {
    if (this.column.type && this.column.type === 'string') {
      const elem: Object = this.column.options.dataSet.find(element => {
        return element[this.column.options.value] === this.data[this.column.data];
      });

      if (elem) {
        return elem[this.column.options.label];
      } else {
        return '';
      }
    } else {
      return this.data[this.column.data][this.column.options.label];
    }
  }

  getLabel(val: object) {
    return val[this.column.options.label];
  }

  onChange(event) {
    const ie: ItemEvent = new ItemEvent();
    ie.item = event;
    ie.data = this.data;
    ie.column = this.column;
    ie.row = this.row;

    this.column.itemEvent.emit(ie);
    this.cellChange.emit(this.data);
  }
}
