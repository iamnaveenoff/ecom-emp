import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {Product} from "../model/product.model";
import {SelectItem} from "primeng/api";
import {DataView} from "primeng/dataview";
import {ApiService} from "../../service/api.service";

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit{
    products: Product[] = [];
    sortOptions: SelectItem[] = [];
    sortOrder: number = 0;

    sortField: string = '';
    constructor(public layoutService: LayoutService, public router: Router,private apiService: ApiService) { }

    ngOnInit(): void {
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

        this.sortOptions = [
            { label: 'Price High to Low', value: '!price' },
            { label: 'Price Low to High', value: 'price' }
        ];
    }
    onSortChange(event: any) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }
    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }
}
