import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FeaturesService } from '../../features/features.service';

interface Server {
  deviceName: string;
  serialNumber: string;
  operatingSystem: string;
  processor: string;
  ram: string;
  purchaseDate: string;
  location: string;
  assignedPersonnel: string;
  condition: string;
}

@Component({
  selector: 'app-modalinfo-server',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './modalinfo-server.component.html',
  styleUrls: ['./modalinfo-server.component.css']
})
export class ModalinfoServerComponent implements OnInit {
  @Input() selectedServer: any;
  @Output() closeModalEvent = new EventEmitter<void>();
  isModalOpen = true;

  servers: Server[] = [];
  totalServers = 0;
  pageSize = 10;
  currentPage = 1;

  displayedColumns: string[] = [
    'deviceName',
    'serialNumber',
    'operatingSystem',
    'processor',
    'ram',
    'purchaseDate',
    'location',
    'assignedPersonnel',
    'condition'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private featuresService: FeaturesService) {}

  ngOnInit(): void {
    this.getServers(this.currentPage, this.pageSize);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.closeModalEvent.emit();
  }

  getServers(page: number, pageSize: number): void {
    this.featuresService.getAllServer(page, pageSize).subscribe({
      next: (response: { servers: Server[]; totalCount?: number }) => {
        this.servers = response?.servers ?? [];
        this.totalServers = response?.totalCount ?? this.servers.length;
      },
      error: (error: any) => console.error('Error fetching servers:', error)
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getServers(this.currentPage, this.pageSize);
  }
}
