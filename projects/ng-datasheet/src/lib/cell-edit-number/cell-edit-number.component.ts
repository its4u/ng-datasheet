import { ItemEvent } from './../models/item-event';
import { CellDynamicInterface } from './../cell/cell-dynamic-interface';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CellDynamicComponent } from '../cell/cell-dynamic-component';
import { Filter } from '../models/filter';

@Component({
  selector: 'ds-cell-edit-number',
  templateUrl: './cell-edit-number.component.html',
  styleUrls: ['./cell-edit-number.component.css']
})
export class CellEditNumberComponent extends CellDynamicComponent implements OnInit, CellDynamicInterface {

  @ViewChild('container', { read: ElementRef })
  container: ElementRef;

  public _model = 0;

  public set model(val: number) {
    if (val) {
      this._model = val;
    } else {
      this._model = 0;
    }
  }

  public get model(): number {
    return this._model;
  }

  constructor() {
    super();
  }

  ngOnInit() {
    if (!this.isFilter) {
      this.container.nativeElement.focus();
    }
    if (this.column.componentParam['type'] === 'byKey') {
      this._model = 0;
    } else {
      if (this.isFilter) {
        const filters: Array<Filter> = this.data as Array<Filter>;
        this._model = filters.find(filter => {
          return filter.column === this.column;
        }).value;
      } else {
        this._model = this.data[this.column.data];
      }
    }
    this.column.componentParam['type'] = '';
  }

  getStep(): number {
    return 1 / Math.pow(10, this.column.componentParam['step']);
  }

  getPlaceHolder(): string {
    if (this.isFilter) {
      return this.placeHolder;
    } else {
      return this.column.options.placeHolder;
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    let input: HTMLInputElement;
    switch (event.keyCode) {
      case 37: // left
        input = event.currentTarget as HTMLInputElement;
        if (input.selectionStart === 0) {
          this.key.emit(event);
        }
        break;
      case 39: // right
        input = event.currentTarget as HTMLInputElement;
        if (input.selectionStart === input.value.length) {
          this.key.emit(event);
        }
        break;
      case 27: // esc
        this._model = this.data[this.column.data];
        this.key.emit(event);
        break;
      case 9: // tab
      case 13: // enter
      case 38: // up
      case 40: // down
        this.key.emit(event);
        break;
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (this.isFilter) {
      const filters: Array<Filter> = this.data as Array<Filter>;
      filters.find(filter => {
        return filter.column === this.column;
      }).value = this._model;
    }

    this.cellChange.emit(this.data);
  }

  onBlur(event: FocusEvent): void {
    if (this.isFilter) {
      const filters: Array<Filter> = this.data as Array<Filter>;
      filters.find(filter => {
        return filter.column === this.column;
      }).value = this._model;
    } else {
      this.data[this.column.data] = this._model;
    }
    this.blurinput.emit(event);
  }

  onChange(event: Event) {
    this.data[this.column.data] = this._model;
    const ie: ItemEvent = new ItemEvent();
    ie.item = this.container.nativeElement.value;
    ie.data = this.data;
    ie.column = this.column;
    ie.row = this.row;

    this.column.itemEvent.emit(ie);
  }
}
