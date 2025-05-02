import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeaturesService } from '../../features/features.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-update-server',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './update-server.component.html',
  styleUrl: './update-server.component.css',
})
export class UpdateServerComponent implements OnChanges {
  @Input() selectedServer: any = {};
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() refreshTableEvent = new EventEmitter<void>();

  editServerForm!: FormGroup;
  isEditModalOpen: boolean = true;

  constructor(
    private fb: FormBuilder,
    private featuresService: FeaturesService
  ) {
    this.editServerForm = this.fb.group({
      ServerName: ['', Validators.required],
      ServerDate: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedServer']) {
      console.log('selectedServer changed:', this.selectedServer);
      if (this.selectedServer) {
        this.updateForm();
      }
    }
  }

  updateForm() {
    if (this.selectedServer) {
      this.editServerForm.patchValue({
        ServerName: this.selectedServer.ServerName || '',
        ServerDate: this.selectedServer.ServerDate || '',
      });
    }
  }

  closeModal() {
    this.isEditModalOpen = false;
    this.closeModalEvent.emit();
  }

  onSubmit() {
    if (this.editServerForm.valid) {
      const serverData = this.editServerForm.value;
      console.log('Submitting:', serverData);

      this.featuresService
        .updateServer(this.selectedServer._id, serverData)
        .subscribe({
          next: (response) => {
            console.log('Server updated successfully:', response);
            alert(response.message || 'Server updated successfully.');
            this.refreshTableEvent.emit();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error updating server:', error);
            alert(error.message || 'An error occurred while updating the server.');
          },
        });
    }
  }
}
