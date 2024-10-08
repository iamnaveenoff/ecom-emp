import {Component, OnInit} from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../../../service/api.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit {
    signinForm!: FormGroup;
    errorMsg: string = '';
    valCheck: string[] = ['remember'];

    password!: string;

    constructor(public layoutService: LayoutService, private apiService: ApiService, private router: Router) { }

    ngOnInit(): void {
        this.signinForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    onSubmit(): void {
        if (this.signinForm.valid) {
            const {username, password} = this.signinForm.value;

            this.apiService.signin(username, password).subscribe(
                response => {
                    console.log('Signin successful:', response);
                    // Navigate to the dashboard or home page
                    this.router.navigateByUrl('/landing');
                },
                error => {
                    console.error('Signin failed:', error);
                    this.errorMsg = 'Login failed. Please try again.';
                }
            );
        }
    }
}
