import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { DocumentService } from '../../services/document.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.scss'],
})
export class DocumentViewComponent implements OnInit {
  documentId!: number;
  document: any;
  isLoading = true;
  fileUrl: SafeResourceUrl | null = null;
  activeTab = 0;

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.documentId = +this.route.snapshot.params['id'];
    this.loadDocument();
  }

  loadDocument(): void {
    this.isLoading = true;
    this.documentService.getDocumentById(this.documentId).subscribe(
      (data) => {
        this.document = data;
        this.isLoading = false;
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          data.file_url
        );
      },
      (error) => {
        this.isLoading = false;
        console.error('Error loading document', error);
        this.snackBar.open('Error loading document', 'Close', {
          duration: 3000,
        });
      }
    );
  }
}
