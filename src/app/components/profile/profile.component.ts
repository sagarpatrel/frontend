import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  isSaving = false;
  userProfile: any = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.authService.getUserProfile().subscribe(
      (data) => {
        this.userProfile = data;
        this.profileForm.patchValue({
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
        });
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error loading user profile', error);
        this.snackBar.open('Error loading user profile', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSaving = true;

      const profileData = {
        first_name: this.profileForm.value.firstName,
        last_name: this.profileForm.value.lastName,
        email: this.profileForm.value.email,
      };

      this.authService.updateUserProfile(profileData).subscribe(
        (data) => {
          this.isSaving = false;
          this.userProfile = data;
          this.snackBar.open('Profile updated successfully', 'Close', {
            duration: 3000,
          });
        },
        (error) => {
          this.isSaving = false;
          console.error('Error updating profile', error);
          this.snackBar.open('Error updating profile', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }
}
