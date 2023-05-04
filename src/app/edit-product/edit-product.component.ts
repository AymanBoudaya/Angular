import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent {
  productId! : string;
  product!: Product ;
  productFormGroup! : FormGroup;

  constructor( private fb : FormBuilder, private route : ActivatedRoute, public productService : ProductService){
    this.productId = this.route.snapshot.params['id'];
    this.productService.getProduct(this.productId).subscribe({
      next : (product) => {
        this.product = product;
        this.productFormGroup = this.fb.group({
          name:this.fb.control(this.product.name, [Validators.required, Validators.minLength(4)] ),
          price:this.fb.control(this.product.price,  [Validators.required , Validators.min(200)]),
          promotion:this.fb.control(this.product.promotion,  [Validators.required])
        })
      },
      error : (err) => console.log(err)
    })
  }

  ngOnInit() : void {

  }

  handleUpdateProduct(){
    let p = this.productFormGroup.value;
    p.id = this.product.id;
    this.productService.updateProduct(p).subscribe({
      next : (prod) => {
        alert('Produit modifié')
      },
      error : (err) => {
        console.log(err);
      }
    })

  }
}
