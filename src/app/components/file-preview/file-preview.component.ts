import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.scss'],
})
export class FilePreviewComponent implements OnInit {
  @Input() fileUrl: string = '';
  @Input() fileType: string = '';
  safeUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.fileUrl) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.fileUrl
      );
    }
  }
}
