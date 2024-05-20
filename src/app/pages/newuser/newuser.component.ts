import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-newuser',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './newuser.component.html',
  styleUrl: './newuser.component.css',
})
export class NewuserComponent {
  modelForm: FormGroup;
  userPhoto: string | ArrayBuffer | null = null;

  constructor() {
    this.modelForm = new FormGroup(
      {
        nombre: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
        ]),
        apellidos: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
        ]),
        email: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ]),
        repiteemail: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        repitepass: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
      },
      [this.checkpassword]
    );
  }

  checkpassword(formValue: AbstractControl): any {
    const password = formValue.get('password')?.value;
    const repitepass = formValue.get('repitepass')?.value;
    if (password !== repitepass) {
      return { checkpassword: true };
    } else {
      return null;
    }
  }

  checkemail(formValue: AbstractControl): any {
    const email = formValue.get('email')?.value;
    const repiteemail = formValue.get('repiteemail')?.value;
    if (email !== repiteemail) {
      return { checkemail: true };
    } else {
      return null;
    }
  }

  ngOnInit(): void {
    // lo pido a BBDD
    let obj = {
      id: 1,
      nombre: 'Nombre',
      apellidos: 'Apellidos',
      email: 'jj@gmail.com',
      password: '12345',
    };
  }
  getDataForm(): void {
    console.log(this.modelForm.value);
    this.modelForm.reset();
  }

  checkControl(
    formControlName: string,
    validador: string
  ): boolean | undefined {
    return (
      this.modelForm.get(formControlName)?.hasError(validador) &&
      this.modelForm.get(formControlName)?.touched
    );
  }
  onFileChange(event: any): void {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.userPhoto = reader.result;
      };
    }
  }
}
