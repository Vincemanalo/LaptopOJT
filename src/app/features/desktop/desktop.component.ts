import { Component, OnInit } from '@angular/core';
import { ModalDesktopComponent } from '../../core/modaldesktop/modaldesktop.component';
import { CommonModule } from '@angular/common';
import { FeaturesService } from '../features.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UpdatesComponent } from '../../core/updates/updates.component';
import { DeleteComponent } from '../../core/delete/delete.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Modalinfo_desktopComponent } from '../../core/modalinfo-desktop/modalinfo-desktop.component';
import { DeleteDesktopComponent } from '../../core/delete-desktop/delete-desktop.component';
import { UpdatesDesktopComponent } from "../../core/updates-desktop/updates-desktop.component";
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

interface Desktop {
  desktopName: string;
  desktopSerialNumber: string;
  desktopModel: string;
  desktopRam: string;
  desktopStorage: string;
  desktopPurchaseDate: Date;
  desktopLocation: string;
  desktopAssignedTo: string;
  desktopCondition: string;
}

@Component({
  selector: 'app-desktop',
  imports: [
    ModalDesktopComponent,
    UpdatesDesktopComponent,
    DeleteDesktopComponent,
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    MatPaginatorModule,
    Modalinfo_desktopComponent,
    MatFormField,
    MatInput


    
],
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.css'],
  standalone: true,
})
export class DesktopComponent implements OnInit {
  displayedColumns: string[] = [
    'desktopName',
    'desktopSerialNumber',
    'desktopPurchaseDate',
    'desktopLocation',
    'desktopAssignedTo',
    'desktopCondition',
    'actions',
  ];

  desktops: Desktop[] = [];
  isModalOpen = false;
  isModalinfoOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  searchKeyword = '';
  pageNo = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 1;
  isEditMode: any;
  selectedDesktop: any;

  employees: any[] = [];
  employeeMap: { [key: string]: string } = {};

  constructor(private FeaturesService: FeaturesService) {}

  ngOnInit(): void {
    this.getEmployees();
    this.getDesktops();
  }

  getDesktops(): void {
    this.FeaturesService.getAllDesktop(this.pageNo, this.pageSize, this.searchKeyword).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response && response.desktop) {
          this.desktops = response.desktop.filter((desktop: Desktop) =>
            this.filterDesktops(desktop)
          );
          this.totalRecords = response.totalRecords;
          this.totalPages = response.totalPages;
        } else {
          this.desktops = [];
        }
        console.log('Filtered Desktops:', this.desktops);
      },
      error: (error) => console.error('Error fetching desktops:', error),
    });
  }

  getEmployees(): void {
    this.FeaturesService.getAllEmployee().subscribe({
      next: (response) => {
        console.log('Employees response:', response);
        const employeeArray = response?.employees ?? [];
        console.log('Employee Array:', employeeArray);
        this.employees = employeeArray;
        this.employeeMap = employeeArray.reduce(
          (map: { [key: string]: string }, employee: { _id: string; employeeName: string }) => {
            map[employee._id] = employee.employeeName;
            return map;
          },
          {}
        );
        console.log('Employee Map:', this.employeeMap);
      },
      error: (error) => console.error('Error fetching employees:', error),
    });
  }

  getEmployeeName(_id: string): string {
    return this.employeeMap[_id] || 'Unknown';
  }

  filterDesktops(desktop: Desktop): boolean {
    if (!this.searchKeyword.trim()) return true;
    const keyword = this.searchKeyword.trim().toLowerCase();
    return (
      desktop.desktopName.toLowerCase().includes(keyword) ||
      desktop.desktopSerialNumber.toLowerCase().includes(keyword) ||
      desktop.desktopModel.toLowerCase().includes(keyword) ||
      desktop.desktopPurchaseDate.toString().toLowerCase().includes(keyword) ||
      desktop.desktopLocation.toLowerCase().includes(keyword) ||
      desktop.desktopAssignedTo.toLowerCase().includes(keyword) ||
      desktop.desktopCondition.toLowerCase().includes(keyword)
    );
  }

  openModal(desktop?: any) {
    this.isModalOpen = true;
    if (desktop) {}
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.getDesktops();
  }

  openModalinfo(desktop?: any) {
    console.log('Info button clicked');
    this.isModalinfoOpen = true;
    this.selectedDesktop = desktop;
    console.log('Selected Desktop:', this.selectedDesktop);
  }

  closeModalinfo(): void {
    this.isModalinfoOpen = false;
    this.selectedDesktop = null;
  }

  openEditModal(desktop?: any) {
    console.log('Edit button clicked');
    this.isEditModalOpen = true;
    this.selectedDesktop = desktop;
    console.log('Selected Desktop:', this.selectedDesktop);
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  openDeleteModal(desktop?: any) {
    console.log('Delete button clicked');
    this.isDeleteModalOpen = true;
    this.selectedDesktop = desktop;
    console.log('Selected Desktop:', this.selectedDesktop);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }

  onSearch(): void {
    this.pageNo = 1;
    this.getDesktops();
  }

  clearSearch(): void {
    this.searchKeyword = '';
  }

  onPageChange(event: any): void {
    this.pageNo = event.pageIndex + 1;  // Update pageNo (since pageIndex starts from 0)
    this.pageSize = event.pageSize;     // Update pageSize
    this.getDesktops();                  // Fetch the desktop for the new page
  }
}
