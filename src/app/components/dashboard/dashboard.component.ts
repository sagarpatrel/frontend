import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  recentDocuments: any[] = [];
  isLoading = true;
  stats = {
    totalDocuments: 0,
    totalSize: '0 MB',
    recentUploads: 0,
  };

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Get recent documents
    this.documentService.getRecentDocuments().subscribe(
      (data) => {
        this.recentDocuments = data.slice(0, 5); // Get only 5 most recent
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading recent documents', error);
        this.isLoading = false;
      }
    );

    // Get stats
    this.documentService.getDocumentStats().subscribe(
      (data) => {
        this.stats = data;
      },
      (error) => {
        console.error('Error loading stats', error);
      }
    );
  }
}
