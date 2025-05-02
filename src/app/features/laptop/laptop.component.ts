import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../../core/modallaptop/modal.component';
import { CommonModule } from '@angular/common';
import { FeaturesService } from '../features.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UpdatesComponent } from '../../core/updates/updates.component';
import { DeleteComponent } from '../../core/delete/delete.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ModalinfoComponent } from '../../core/modalinfo_laptop/modalinfo.component';
import { MatInput } from '@angular/material/input';

interface Laptop {
  laptopName: string;
  laptopSerialNumber: string;
  laptopDescription: string;
  laptopPurchaseDate: Date;
  laptopLocation: string;
  laptopAssignedTo: string;
  laptopCondition: string;
}

@Component({
  selector: 'app-laptop',
  imports: [
    ModalComponent,
    UpdatesComponent,
    DeleteComponent,
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    MatPaginatorModule,
    ModalinfoComponent,
    MatFormField,
    MatInput
  ],
  templateUrl: './laptop.component.html',
  styleUrls: ['./laptop.component.css'],
  standalone: true,
})
export class LaptopComponent implements OnInit {
  displayedColumns: string[] = [
    'laptopName',
    'laptopSerialNumber',
    'laptopDescription',
    'laptopPurchaseDate',
    'laptopLocation',
    'laptopAssignedTo',
    'laptopCondition',
    'actions',
  ];

  laptops: Laptop[] = [];
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
  selectedLaptop: any;

  employees: any[] = [];
  employeeMap: { [key: string]: string } = {};

  constructor(private FeaturesService: FeaturesService) {}

  ngOnInit(): void {
    this.getEmployees();
    this.getLaptops();
  }

  getLaptops(): void {
    this.FeaturesService.getAllLaptop(this.pageNo, this.pageSize, this.searchKeyword).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response && response.laptops) {
          this.laptops = response.laptops.filter((laptop: Laptop) =>
            this.filterLaptops(laptop)
          );
          this.totalRecords = response.totalRecords;
          this.totalPages = response.totalPages;
        } else {
          this.laptops = [];
        }
        console.log('Filtered Laptops:', this.laptops);
      },
      error: (error) => console.error('Error fetching laptops:', error),
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

  filterLaptops(laptop: Laptop): boolean {
    if (!this.searchKeyword.trim()) return true;
    const keyword = this.searchKeyword.trim().toLowerCase();
    return (
      laptop.laptopName.toLowerCase().includes(keyword) ||
      laptop.laptopSerialNumber.toLowerCase().includes(keyword) ||
      laptop.laptopDescription.toLowerCase().includes(keyword) ||
      laptop.laptopPurchaseDate.toString().toLowerCase().includes(keyword) ||
      laptop.laptopLocation.toLowerCase().includes(keyword) ||
      laptop.laptopAssignedTo.toLowerCase().includes(keyword) ||
      laptop.laptopCondition.toLowerCase().includes(keyword)
    );
  }

  openModal(laptop?: any) {
    this.isModalOpen = true;
    if (laptop) {}
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.getLaptops();
  }

  openModalinfo(laptop?: any) {
    console.log('Info button clicked');
    this.isModalinfoOpen = true;
    this.selectedLaptop = laptop;
    console.log('Selected Laptop:', this.selectedLaptop);
  }

  closeModalinfo(): void {
    this.isModalinfoOpen = false;
    this.selectedLaptop = null;
  }

  openEditModal(laptop?: any) {
    console.log('Edit button clicked');
    this.isEditModalOpen = true;
    this.selectedLaptop = laptop;
    console.log('Selected Laptop:', this.selectedLaptop);
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  openDeleteModal(laptop?: any) {
    console.log('Delete button clicked');
    this.isDeleteModalOpen = true;
    this.selectedLaptop = laptop;
    console.log('Selected Laptop:', this.selectedLaptop);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }

  onSearch(): void {
    this.pageNo = 1;
    this.getLaptops();
  }

  clearSearch(): void {
    this.searchKeyword = '';
  }

  onPageChange(event: any): void {
    this.pageNo = event.pageIndex + 1;  // Update pageNo (since pageIndex starts from 0)
    this.pageSize = event.pageSize;     // Update pageSize
    this.getLaptops();                  // Fetch the laptops for the new page
  }
}
