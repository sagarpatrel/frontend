import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
// import { DocumentService } from '../../services/document.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval } from 'rxjs';
import { takeWhile, switchMap } from 'rxjs/operators';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-document-qa',
  templateUrl: './document-qa.component.html',
  styleUrls: ['./document-qa.component.scss'],
})
export class DocumentQaComponent implements OnInit {
  @Input() documentId!: number;
  document: any;
  isLoading = true;
  isIngesting = false;
  ingestionComplete = false;
  ingestionStatus: string = 'NOT_STARTED';
  questionInput = new FormControl('', [Validators.required]);
  isAskingQuestion = false;
  questions: any[] = [];
  currentAnswer: string = '';

  constructor(
    private documentService: DocumentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDocument();
    this.loadQuestionHistory();
  }

  loadDocument(): void {
    this.isLoading = true;
    this.documentService.getDocumentById(this.documentId).subscribe(
      (data) => {
        this.document = data;
        this.isLoading = false;
        this.checkIngestionStatus();
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

  loadQuestionHistory(): void {
    this.documentService.getQuestionHistory(this.documentId).subscribe(
      (data) => {
        this.questions = data;
      },
      (error) => {
        console.error('Error loading question history', error);
      }
    );
  }

  startIngestion(): void {
    this.isIngesting = true;
    this.ingestionStatus = 'PROCESSING';

    this.documentService.ingestDocument(this.documentId).subscribe(
      () => {
        this.pollIngestionStatus();
      },
      (error) => {
        this.isIngesting = false;
        console.error('Error starting ingestion', error);
        this.snackBar.open('Error starting document ingestion', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  pollIngestionStatus(): void {
    interval(5000)
      .pipe(
        switchMap(() =>
          this.documentService.getIngestionStatus(this.documentId)
        ),
        takeWhile((response) => response.status === 'PROCESSING', true)
      )
      .subscribe(
        (response) => {
          this.ingestionStatus = response.status;

          if (this.ingestionStatus === 'COMPLETED') {
            this.isIngesting = false;
            this.ingestionComplete = true;
            this.snackBar.open(
              'Document ingestion completed successfully',
              'Close',
              {
                duration: 3000,
              }
            );
          } else if (this.ingestionStatus === 'FAILED') {
            this.isIngesting = false;
            this.snackBar.open('Document ingestion failed', 'Close', {
              duration: 3000,
            });
          }
        },
        (error) => {
          this.isIngesting = false;
          console.error('Error checking ingestion status', error);
          this.snackBar.open('Error checking ingestion status', 'Close', {
            duration: 3000,
          });
        }
      );
  }

  checkIngestionStatus(): void {
    this.documentService.getIngestionStatus(this.documentId).subscribe(
      (response) => {
        this.ingestionStatus = response.status;
        this.ingestionComplete = this.ingestionStatus === 'COMPLETED';
      },
      (error) => {
        console.error('Error checking ingestion status', error);
      }
    );
  }

  askQuestion(): void {
    if (this.questionInput.valid) {
      const question = this.questionInput.value || '';
      this.isAskingQuestion = true;
      this.currentAnswer = '';

      this.documentService.askQuestion(this.documentId, question).subscribe(
        (response) => {
          this.isAskingQuestion = false;
          this.currentAnswer = response.answer;

          // Add to history
          this.questions.unshift({
            question: question,
            answer: response.answer,
            asked_at: new Date().toISOString(),
          });

          this.questionInput.reset();
        },
        (error) => {
          this.isAskingQuestion = false;
          console.error('Error asking question', error);
          this.snackBar.open('Error asking question', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }
}
