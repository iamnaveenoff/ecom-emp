import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, NgIf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {FileUploadModule} from "primeng/fileupload";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {RippleModule} from "primeng/ripple";
import {MessageService, SharedModule} from "primeng/api";
import {Table, TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {Category} from "../../model/category.model";
import {Product} from "../../model/product.model";
import {ApiService} from "../../../service/api.service";

@Component({
  selector: 'app-category-details',
  standalone: true,
    imports: [
        ButtonModule,
        CurrencyPipe,
        DialogModule,
        DropdownModule,
        FileUploadModule,
        FormsModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        NgIf,
        ReactiveFormsModule,
        RippleModule,
        SharedModule,
        TableModule,
        ToastModule,
        ToolbarModule
    ],
    providers: [MessageService],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss'
})
export class CategoryDetailsComponent  implements OnInit{
    categories: Category[] = [];
    // product: Product = <Product>{};
    category: Category = <Category>{};
    submitted: boolean = false;
    categoryDialog: boolean = false;
    cols: any[] = [];
    selectedCategories: Category[] = [];
    updateForm!: FormGroup;

    imageFile: File | null = null;  // Stores the selected image
    imagePreview: string | ArrayBuffer | null = null;  // For image preview

    statusList: any;
    openNew() {
        this.category = {};
        this.submitted = false;
        this.categoryDialog = true;
    }

     ngOnInit(): void {
         this.getAllCategories();
         this.updateForm = new FormGroup({
             categoryImage: new FormControl('', ),
             categoryName: new FormControl('', [Validators.required]),
             status: new FormControl(''),
         });
         this.statusList = [
             { status: 'Active', code: 'true' },
             { status: 'InActive', code: 'false' }
         ];
     }
    constructor(private apiService: ApiService, private messageService: MessageService) {
    }


    getAllCategories(){
        this.apiService.getCategories().subscribe(
            (response: any) => {
                if (response.statusCode === 200 && response.data) {
                    this.categories = response.data || [];
                }
            },
            (error: any) => {
                console.error('Error fetching Categories:', error);
            }
        );
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    editCategory(category: Category) {
        // Clone the selected product object
        this.category = {...category};


        // Open the dialog to edit the product
        this.categoryDialog = true;
    }

    deleteCategory(category: Category) {
        // this.deleteProductDialog = true;
        this.apiService.deleteCategory(category.categoryId).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Category Deleted',
                    life: 3000
                });
                this.categories = this.categories.filter(p => p.categoryId !== category.categoryId);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Category Deletion Failed',
                    life: 3000
                });
            }
        });

    }

    hideDialog() {
        this.categoryDialog = false;
        this.submitted = false;
    }

    saveCategory() {
        this.submitted = true;

        if (this.updateForm.valid) {  // Ensure the form is valid before proceeding
            const updatedCategory = new FormData();
            updatedCategory.append('categoryName', this.updateForm.get('categoryName')?.value);
            updatedCategory.append('status', this.updateForm.get('status')?.value);


            // If it's an existing product, update it
            if (this.category.categoryId) {
                this.apiService.updateCategory(this.category.categoryId, updatedCategory).subscribe({
                    next: (response) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Category Updated',
                            life: 3000
                        });
                        this.getAllCategories();
                        this.categoryDialog = false;

                    },
                    error: (err) => {
                        console.log(err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Category Update Failed',
                            life: 3000
                        });
                    }
                });
            }else {
                // Create product API
                this.apiService.createCategory(updatedCategory).subscribe({
                    next: (response) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Product Created',
                            detail: 'The Category has been successfully created.',
                            life: 3000
                        });
                        this.getAllCategories();
                        this.categoryDialog = false;
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Creation Failed',
                            detail: 'Error creating product.',
                            life: 3000
                        });
                    }
                });
            }
        }
    }

    onUpload(event: any) {
        const file = event.files[0];
        if (file) {
            this.imageFile = file;
            const reader = new FileReader();
            reader.onload = (e: any) => this.imagePreview = e.target.result;
            reader.readAsDataURL(file);
        }

        this.messageService.add({severity: 'info', summary: 'Image Uploaded', detail: 'File successfully uploaded.'});
    }
}
