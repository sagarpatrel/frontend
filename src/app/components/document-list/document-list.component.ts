import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentService } from '../../services/document.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'created_at',
    'size',
    'type',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private documentService: DocumentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadDocuments(): void {
    this.isLoading = true;
    this.documentService.getAllDocuments().subscribe(
      (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading documents', error);
        this.isLoading = false;
        this.snackBar.open('Error loading documents', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteDocument(id: number): void {
    if (confirm('Are you sure you want to delete this document?')) {
      this.documentService.deleteDocument(id).subscribe(
        () => {
          this.loadDocuments();
          this.snackBar.open('Document deleted successfully', 'Close', {
            duration: 3000,
          });
        },
        (error) => {
          console.error('Error deleting document', error);
          this.snackBar.open('Error deleting document', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }
}
