import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FileUploadModule} from "primeng/fileupload";
import {InputTextModule} from "primeng/inputtext";
import {RatingModule} from "primeng/rating";
import {RippleModule} from "primeng/ripple";
import {MessageService, SharedModule} from "primeng/api";
import {Table, TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {ApiService} from "../../../service/api.service";
import {Product} from "../../model/product.model";
import {DialogModule} from "primeng/dialog";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputNumberModule} from "primeng/inputnumber";
import {Category} from "../../model/category.model";
import {DropdownModule} from "primeng/dropdown";
import {UserModel} from "../../model/user.model";
import {AutoCompleteModule} from "primeng/autocomplete";

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [
        ButtonModule,
        CurrencyPipe,
        FileUploadModule,
        InputTextModule,
        RatingModule,
        RippleModule,
        SharedModule,
        TableModule,
        ToastModule,
        ToolbarModule,
        DialogModule,
        NgIf,
        FormsModule,
        NgClass,
        InputTextareaModule,
        InputNumberModule,
        ReactiveFormsModule,
        DropdownModule,
        NgForOf,
        JsonPipe,
        AutoCompleteModule
    ],
    providers: [MessageService],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
    products: Product[] = [];
    categories: Category[] = [];
    product: Product = <Product>{};
    selectedProducts: Product[] = [];
    cols: any[] = [];
    productDialog: boolean = false;
    submitted: boolean = false;
    updateForm!: FormGroup;
    deleteProductsDialog: boolean = false;
    deleteProductDialog: boolean = false;

    categoryList: any;

    userList: any;

    imageFile: File | null = null;  // Stores the selected image
    imagePreview: string | ArrayBuffer | null = null;  // For image preview

    ngOnInit(): void {
       this.getAllProducts();
        this.updateForm = new FormGroup({
            productName: new FormControl(this.product.productName, [Validators.required]),
            categoryId: new FormControl(this.product.category, [Validators.required]),
            description: new FormControl(this.product.description, [Validators.required]),
            contactNumber: new FormControl(this.product.contactNumber, [Validators.required]),
            publishedBy: new FormControl(this.product.publishedBy, [Validators.required]),
            price: new FormControl(this.product.price, [Validators.required]),
        });

        this.apiService.getCategories().subscribe(
            (response: any) => {
                if (response.statusCode === 200 && response.data) {
                    this.categories = response.data;
                    this.categoryList = this.categories.map((category: Category) => ({
                        categoryName: category.categoryName,
                        categoryId: category.categoryId
                    }));
                }
            },
            (error: any) => {
                console.error('Error fetching Categories:', error);
            }
        );

        this.apiService.getUsers().subscribe(
            (response: any) => {
                if (response.statusCode === 200 && response.data) {
                    // this.categories = response.data;
                    this.userList = response.data.map((user: UserModel) => ({
                        label: user.name,
                        value: user.id
                    }));
                }
            },
            (error: any) => {
                console.error('Error fetching Categories:', error);
            }
        );



    }

    getAllProducts(){
        this.apiService.getProducts().subscribe(
            (response: any) => {
                if (response.statusCode === 200 && response.data) {
                    this.products = response.data;
                    // this.totalResults = response.data.length;
                }
            },
            (error: any) => {
                console.error('Error fetching products:', error);
            }
        );

    }
    get f() {
        return this.updateForm.controls;
    }

    constructor(private apiService: ApiService, private messageService: MessageService) {
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    editProduct(product: Product) {
        // Clone the selected product object
        this.product = {...product};

        // Find the matching category by categoryId and set it for the form
        const selectedCategory = this.categories.find(cat => cat.categoryName === product.category);
        if (selectedCategory) {
            // Preselect the category in the form with categoryId
            this.updateForm.patchValue({
                categoryId: selectedCategory.categoryName
            });
        }

        // Patch other product details in the form
        this.updateForm.patchValue({
            productName: this.product.productName,
            description: this.product.description,
            contactNumber: this.product.contactNumber,
            price: this.product.price,
            publishedBy: this.product.publishedBy
        });

        // Open the dialog to edit the product
        this.productDialog = true;
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.updateForm.valid) {  // Ensure the form is valid before proceeding
            const updatedProduct = new FormData();
            updatedProduct.append('productName', this.updateForm.get('productName')?.value);
            updatedProduct.append('description', this.updateForm.get('description')?.value);
            updatedProduct.append('contactNumber', this.updateForm.get('contactNumber')?.value);
            updatedProduct.append('categoryId', this.updateForm.get('categoryId')?.value);  // Correct category ID
            updatedProduct.append('price', this.updateForm.get('price')?.value);
            updatedProduct.append('publishedBy', this.updateForm.get('publishedBy')?.value);

            // If it's an existing product, update it
            if (this.product.productId) {
                this.apiService.updateProduct(this.product.productId, updatedProduct).subscribe({
                    next: (response) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product Updated',
                            life: 3000
                        });
                        this.productDialog = false;
                        this.getAllProducts();

                    },
                    error: (err) => {
                        console.log(err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Product Update Failed',
                            life: 3000
                        });
                    }
                });
            }
        }
    }

    deleteProduct(product: Product) {
        // this.deleteProductDialog = true;
        this.apiService.deleteProduct(product.productId).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
                this.products = this.products.filter(p => p.productId !== product.productId);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Product Deletion Failed',
                    life: 3000
                });
            }
        });

    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    confirmDelete(product: Product) {
        this.deleteProductDialog = false;
        this.apiService.deleteProduct(product.productId).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
                this.products = this.products.filter(p => p.productId !== product.productId);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Product Deletion Failed',
                    life: 3000
                });
            }
        });
        this.product = {};
    }


    onUpload(event: any) {
        const file = event.files[0];
        if (file) {
            this.imageFile = file;
            const reader = new FileReader();
            reader.onload = (e: any) => this.imagePreview = e.target.result;
            reader.readAsDataURL(file);
        }

        this.messageService.add({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
    }


}
