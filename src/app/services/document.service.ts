import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // Get all documents
  getAllDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/documents/`);
  }

  // Get recent documents
  getRecentDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/documents/recent/`);
  }

  // Get document by ID
  getDocumentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/documents/${id}/`);
  }

  // Upload document
  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/documents/`, formData);
  }

  // Update document
  updateDocument(id: number, document: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/documents/${id}/`, document);
  }

  // Delete document
  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/documents/${id}/`);
  }

  // Get document statistics
  getDocumentStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/documents/stats/`);
  }

  // INGESTION RELATED METHODS

  // Start document ingestion process
  ingestDocument(documentId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/documents/${documentId}/ingest/`,
      {}
    );
  }

  // Check ingestion status
  getIngestionStatus(documentId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/documents/${documentId}/ingestion-status/`
    );
  }

  // Ask a question about a document
  askQuestion(documentId: number, question: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/documents/${documentId}/ask/`, {
      question,
    });
  }

  // Get questions history for a document
  getQuestionHistory(documentId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/documents/${documentId}/questions/`
    );
  }
}
