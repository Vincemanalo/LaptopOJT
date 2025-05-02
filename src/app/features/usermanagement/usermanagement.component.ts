import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesService } from '../features.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { AddempComponent } from '../../core/addemp/addemp.component';
import { UpdatesEmpComponent } from '../../core/updateemp/updateemp.component';
import { DeleteEmpComponent } from '../../core/deleteemp/deleteemp.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ModalinfoComponent } from '../../core/modalinfo_laptop/modalinfo.component';  // Import it here
import { MatInput } from '@angular/material/input';

interface Employee {
  employeeName: string;
  employmentDate: string;
  employmentPeriod: string;
}

@Component({
  selector: 'app-usermanagement',
  imports: [
    UpdatesEmpComponent,
    DeleteEmpComponent,
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    AddempComponent,
    MatPaginatorModule,
    ModalinfoComponent,
    MatFormField,
    MatInput
  ],
  templateUrl: './usermanagement.component.html',
  styleUrl: './usermanagement.component.css',
  standalone: true,
})
export class UserManagementComponent implements OnInit {
  
  displayedColumns: string[] = [
    'employeeName',
    'employmentDate',
    'employmentPeriod',
    'actions'
  ];

  dataSource = new MatTableDataSource<Employee>();

  isModalOpen = false;
  isaddempModalOpen = false;
  iseditempModalOpen = false;
  isDeleteModalOpen = false;
  isModalInfoEmpOpen = false;
  searchKeyword = '';
  pageNo = 1;
  pageSize = 10;
  isEditMode: any;
  selectedemployee: any = {};

  employeeMap: { [key: string]: string } = {};
  
  constructor(private FeaturesService: FeaturesService) {}

  ngOnInit(): void {
    this.getEmployees();
  }  
  
  getEmployees(): void {
    this.FeaturesService.getAllEmployee().subscribe(
      (response: any) => {
        this.dataSource.data = response.employees; // Access the employees array from the response
        response.employees.forEach((employee: Employee) => {
          this.employeeMap[employee.employeeName] = employee.employeeName;
        });
      },
      error => {
        console.error('Error fetching employees:', error);
      }
    );
  }
          
  closeaddemp(): void {
    this.isaddempModalOpen = false;
    this.getEmployees(); // Refresh table after adding a new employee
  }
  
  getEmployeeName(_id: string): string {
    return this.employeeMap[_id] || 'Unknown';
  }

  filterEmployees(employee: Employee): boolean {
    if (!this.searchKeyword.trim()) {
      return true;
    }

    const keyword = this.searchKeyword.trim().toLowerCase();
    return (
      employee.employeeName.toLowerCase().includes(keyword) ||
      employee.employmentDate.toLowerCase().includes(keyword) ||
      employee.employmentPeriod.toLowerCase().includes(keyword)
    );
  }

  openModal(employee?: any) {
    this.isModalOpen = true;
  }
  closeModal(): void {
    this.isModalOpen = false;
  }

  openModalInfoEmp(employee?: any) {
    this.isModalInfoEmpOpen = true;
    this.selectedemployee = employee;
  }

  closeModalInfoEmp(): void {
    this.isModalInfoEmpOpen = false;
  }

  openeditempModal(employee?: any) {
    this.iseditempModalOpen = true;
    this.selectedemployee = employee;
  }

  closeeditempModal(): void {
    this.iseditempModalOpen = false;
  }

  closeaddempModal(): void {
    this.isaddempModalOpen = false;
  } 

  openDeleteEmpModal(employee?: any) {
    console.log('Delete button clicked');
    this.isDeleteModalOpen = true;
    this.selectedemployee = employee;
    console.log('Selected Laptop:', this.selectedemployee);
  }

  closeDeleteEmpModal(): void {
    this.isDeleteModalOpen = false;
  }

  onSearch(): void {
    this.pageNo = 1;
  }

  clearSearch(): void {
    this.searchKeyword = '';
  }
}
