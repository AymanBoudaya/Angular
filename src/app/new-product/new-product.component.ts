import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent {

  productFormGroup! : FormGroup;

  constructor(private router : Router ,private fb : FormBuilder, public productService : ProductService){}

  ngOnInit():void {
    this.productFormGroup = this.fb.group({
      name:this.fb.control(null, [Validators.required, Validators.minLength(4)] ),
      price:this.fb.control(null,  [Validators.required , Validators.min(200)]),
      promotion:this.fb.control(false,  [Validators.required])
    })
  }

  handleAddProduct(){
    let product = this.productFormGroup.value
    this.productService.addNewProduct(product).subscribe({
      next : () => {
        alert('Produit ajouté');
        this.productFormGroup.reset()
      },
      error : (err) => {console.log(err)},
    })
  }
}
