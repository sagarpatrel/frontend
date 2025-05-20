import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
})
export class DocumentUploadComponent {
  uploadForm: FormGroup;
  isLoading = false;
  selectedFile: File | null = null;
  filename = '';

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      category: ['', [Validators.required]],
      file: [null, [Validators.required]],
      processForQA: [true],
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.filename = this.selectedFile.name;
      this.uploadForm.patchValue({ file: this.selectedFile });
    }
  }

  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('title', this.uploadForm.get('title')?.value);
      formData.append('description', this.uploadForm.get('description')?.value);
      formData.append('category', this.uploadForm.get('category')?.value);
      formData.append('file', this.selectedFile);
      formData.append(
        'process_for_qa',
        this.uploadForm.get('processForQA')?.value ? 'true' : 'false'
      );

      this.documentService.uploadDocument(formData).subscribe(
        (response) => {
          this.isLoading = false;
          this.snackBar.open('Document uploaded successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/documents', response.id]);
        },
        (error) => {
          this.isLoading = false;
          this.snackBar.open(
            error.error?.detail || 'Upload failed. Please try again.',
            'Close',
            { duration: 5000 }
          );
        }
      );
    }
  }
}
