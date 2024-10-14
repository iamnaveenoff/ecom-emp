import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, tap, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {AuthService} from "./AuthService.service";
import {SigninResponse} from "../components/model/Signin.model";
import {UserModel} from "../components/model/user.model";
import {Product} from "../components/model/product.model";

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private apiUrl = 'http://localhost:8080/api/v1/';

    constructor(private http: HttpClient, private authService: AuthService) {
    }

    // Authentication: Sign in
    signin(email: string, password: string): Observable<SigninResponse> {
        return this.http.post<SigninResponse>(this.apiUrl + 'auth/signin', {email, password}).pipe(
            tap((response: SigninResponse) => {
                // Store tokens and user details using AuthService
                this.authService.storeTokens(response.token, response.refreshToken, response.userDetails);
            }),
            catchError(error => {
                console.error('Signin error:', error);
                return throwError(error);
            })
        );
    }

    // Authentication: Sign up
    register(user: UserModel): Observable<any> {
        return this.http.post(this.apiUrl + 'auth/signup', user).pipe(
            tap(response => console.log('Signup response:', response)),
            catchError(error => {
                console.error('Signup error:', error);
                return throwError(error);
            })
        );
    }

    // Users: Get all users
    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'user/getAllUsers').pipe(
            catchError(error => {
                console.error('Get Users error:', error);
                return throwError(error);
            })
        );
    }

    // Product: Create a new product
    createProduct(product: any): Observable<any> {
        return this.http.post(this.apiUrl + 'products/create', product).pipe(
            tap(response => console.log('Create product response:', response)),
            catchError(error => {
                console.error('Create product error:', error);
                return throwError(error);
            })
        );
    }

    // Product: Get all products
    getProducts(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'products/getAllProducts').pipe(
            catchError(error => {
                console.error('Get products error:', error);
                return throwError(error);
            })
        );
    }

    // Product: Get a product by ID
    getProductById(id: string): Observable<any> {
        return this.http.get<any>(this.apiUrl + `products/${id}`).pipe(
            catchError(error => {
                console.error('Get product by ID error:', error);
                return throwError(error);
            })
        );
    }

    // Product: Update a product
    /* updateProduct(id: number, product: Product): Observable<any> {
       return this.http.put(this.apiUrl + `products/${id}`, product).pipe(
         tap(response => console.log('Update product response:', response)),
         catchError(error => {
           console.error('Update product error:', error);
           return throwError(error);
         })
       );
     }*/
    updateProduct(id: number, data: any): Observable<any> {
        return this.http.put(this.apiUrl + `products/${id}`, data);
    }


    // Product: Delete a product
    deleteProduct(id: number): Observable<any> {
        return this.http.delete(this.apiUrl + `products/${id}`).pipe(
            catchError(error => {
                console.error('Delete product error:', error);
                return throwError(error);
            })
        );
    }

    // Category: Create a new category
    createCategory(category: any): Observable<any> {
        return this.http.post(this.apiUrl + 'categories/create', category).pipe(
            catchError(error => {
                console.error('Create category error:', error);
                return throwError(error);
            })
        );
    }

    // Category: Get all categories
    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'categories/listAllCategory').pipe(
            catchError(error => {
                console.error('Get categories error:', error);
                // Handle the error here, e.g., display an error message to the user
                return throwError('An error occurred while fetching categories.');
            })
        );
    }

    // Category: Get a category by ID
    getCategoryById(id: string): Observable<any> {
        return this.http.get<any>(this.apiUrl + `categories/${id}`).pipe(
            catchError(error => {
                console.error('Get category by ID error:', error);
                return throwError(error);
            })
        );
    }

    // Category: Update a category
    updateCategory(id: number, category: any): Observable<any> {
        return this.http.put(this.apiUrl + `categories/${id}`, category).pipe(
            tap(response => console.log('Update category response:', response)),
            catchError(error => {
                console.error('Update category error:', error);
                return throwError(error);
            })
        );
    }

    // Category: Delete a category
    deleteCategory(id: number): Observable<any> {
        return this.http.delete(this.apiUrl + `categories/${id}`).pipe(
            tap(response => console.log('Delete category response:', response)),
            catchError(error => {
                console.error('Delete category error:', error);
                return throwError(error);
            })
        );
    }
}
