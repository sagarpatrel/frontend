import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
      },
      { validators: this.checkPasswords }
    );
  }

  // Custom validator to check if passwords match
  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { notSame: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;

      // Create a user object excluding the confirmPassword field
      const userData = {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        first_name: this.registerForm.value.firstName,
        last_name: this.registerForm.value.lastName,
      };

      this.authService.register(userData).subscribe(
        () => {
          this.isLoading = false;
          this.snackBar.open(
            'Registration successful! Please login.',
            'Close',
            {
              duration: 5000,
            }
          );
          this.router.navigate(['/login']);
        },
        (error) => {
          this.isLoading = false;
          let errorMsg = 'Registration failed. Please try again.';

          if (error.error) {
            if (error.error.username) {
              errorMsg = `Username error: ${error.error.username}`;
            } else if (error.error.email) {
              errorMsg = `Email error: ${error.error.email}`;
            } else if (error.error.password) {
              errorMsg = `Password error: ${error.error.password}`;
            } else if (error.error.detail) {
              errorMsg = error.error.detail;
            }
          }

          this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
        }
      );
    }
  }
}
