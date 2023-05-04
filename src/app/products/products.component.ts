import { Component } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {

  products! : Product[]
  errMessage!:string;
  searchFormGroup! : FormGroup;
  currentPage:number=0;
  pageSize:number = 5;
  totalPages:number=0;
  currentAction : string ="all";

  constructor(private productService: ProductService, private fb : FormBuilder,
    public authService : AuthenticationService,
    private router : Router){}

  ngOnInit():void{
    this.searchFormGroup = this.fb.group({
      keyword : this.fb.control(null)
    })
    this.handleGetPageProducts()
    }

    handleNewProduct(){
      this.router.navigateByUrl('/admin/newProduct')
    }
    handleGetPageProducts(){
      this.productService.getPageProducts(this.currentPage,this.pageSize).subscribe({
        next : data=> {this.products = data.products;
        this.totalPages = data.totalPages;},
        error : err=> this.errMessage = err
      });
    }
    handleGetAllProducts(){
      this.productService.getAllProducts().subscribe({
        next : data=> this.products = data,
        error : err=> this.errMessage = err
      });
    }
  handleDeleteProduct(p:Product){
    let conf = confirm("Are you sure ?")
    if (conf == false) return ;
    this.productService.deleteProduct(p.id).subscribe({
      next : data =>{
        let index = this.products.indexOf(p);
        this.products.splice(index,1)
      }
    }
    )
  }
  handleSetPromotion(p: Product){
    let promo = p.promotion;
    this.productService.setPromotion(p.id).subscribe({
      next : data => p.promotion = !promo,
      error : err => this.errMessage = err
    })
  }

  handleSearchProducts(){
    this.currentAction = "search";
    let keyword = this.searchFormGroup.value.keyword;
    this.productService.searchProducts(keyword,this.currentPage, this.pageSize).subscribe({
      next : (data) => {
        this.products = data.products
        this.totalPages = data.totalPages
      }
    })
  }

  gotoPage(i:number){
    this.currentPage= i ;
    if (this.currentAction === "all")    
      this.handleGetPageProducts()
    else
      this.handleSearchProducts()
  }
}
