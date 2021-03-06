import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder, FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validators
} from "@angular/forms";

import Color from "../../../../shared/models/color";


@Component({
  selector: 'app-color-form',
  templateUrl: './color-form.component.html',
  styleUrls: ['./color-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ColorFormComponent),
      multi: true
    }
  ]
})
export class ColorFormComponent implements OnInit, ControlValueAccessor {

  @Input() color: Color;
  private form: FormGroup;

  get value(): Color {
    return this.form.value;
  }

  set value(value: Color) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }


  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      name: [this.color?.name ?? '', [Validators.required]],
      color: [this.color?.color ?? '', [Validators.required, Validators.pattern(HEX_COLOR_REGEX)]],
      pantone: [this.color?.pantone ?? '', []],
      year: [
        this.color?.year ?? '',
        [
          Validators.required, Validators.min(1900), Validators.max(2099)
        ]
      ],
    })

    this.form.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    });
  }

  public get f(): FormGroup {
    return this.form;
  }

  onChange: any = () => {
  };
  onTouched: any = () => {
  };


  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.form.reset();
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.form.valid ? null : {color: {valid: false},};
  }

}

const HEX_COLOR_REGEX = /^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/;
