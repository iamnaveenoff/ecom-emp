import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ProductDetailsComponent} from "./product-details/product-details.component";
import {CategoryDetailsComponent} from "./category-details/category-details.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'productDetails', component: ProductDetailsComponent },
        { path: 'categoryDetails', component: CategoryDetailsComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ProductManagementRoutingModule { }
