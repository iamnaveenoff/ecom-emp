import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {StyleClassModule} from "primeng/styleclass";
import {Router} from "@angular/router";
import {ApiService} from "../../service/api.service";
import {LayoutService} from "../../../layout/service/app.layout.service";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {DataView, DataViewModule} from "primeng/dataview";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {Product} from "../model/product.model";
import {SelectItem} from "primeng/api";

@Component({
  selector: 'app-product-list',
  standalone: true,
    imports: [
        ButtonModule,
        RippleModule,
        StyleClassModule,
        CurrencyPipe,
        DataViewModule,
        DropdownModule,
        InputTextModule,
        NgForOf
    ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit{

    products: Product[] = [];
    sortOptions: SelectItem[] = [];
    sortOrder: number = 0;

    sortField: string = '';

    constructor(public layoutService: LayoutService, public router: Router,private apiService: ApiService) {
    }
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
