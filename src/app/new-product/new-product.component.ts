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

  constructor(private router : Router ,private fb : FormBuilder, private productService : ProductService){}

  ngOnInit():void {
    this.productFormGroup = this.fb.group({
      name:this.fb.control(null, [Validators.required, Validators.minLength(4)] ),
      price:this.fb.control(null,  [Validators.required , Validators.min(200)]),
      promotion:this.fb.control(false,  [Validators.required])
    })
  }

  getErrorMessage(fieldName:string, errors:ValidationErrors){
    if (errors['required']) {
      return fieldName + " is Required"
    }    
    else if (errors['minlength']) {
      return fieldName + " should have at least " + errors['minlength']['requiredLength']+ " Characters"
    }
    else if (errors['min']) {
      return fieldName + " should be at least " + errors['min']['min']
    }
    else return ""
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
