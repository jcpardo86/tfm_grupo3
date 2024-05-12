import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import React from 'react';

@Component({
  selector: 'app-newuser',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './newuser.component.html',
  styleUrl: './newuser.component.css',
})
export class NewuserComponent implements OnInit {
  newUserForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.newUserForm = new FormGroup({
      name: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      confirmEmail: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      photo: new FormControl(''),
    });
  }

  onSubmit(): void {
    if (this.newUserForm.valid) {
      // Call API to register user
      console.log('Form submitted:', this.newUserForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
