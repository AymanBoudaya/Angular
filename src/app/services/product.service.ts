import { Injectable } from '@angular/core';
import { Observable, of, retry, throwError } from 'rxjs';
import { PageProduct, Product } from '../models/product';
import { UUID } from 'angular2-uuid';
import { ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products!: Product[];

  constructor() {
    this.products = [
      { id: UUID.UUID(), name: "pompe doseuse", price: 3600, promotion: true },
      { id: UUID.UUID(), name: "pompe centrifuge", price: 13600, promotion: false },
      { id: UUID.UUID(), name: "moteur 200kW", price: 30600, promotion: true },
    ];
    for (let i = 0; i < 10; i++) {
      this.products.push({ id: UUID.UUID(), name: "pompe doseuse", price: 3600, promotion: true })
      this.products.push({ id: UUID.UUID(), name: "pompe centrifuge", price: 13600, promotion: false })
      this.products.push({ id: UUID.UUID(), name: "moteur 200kW", price: 30600, promotion: true })
    }
  }

  getAllProducts(): Observable<Product[]> {
    let rnd = Math.random();
    if (rnd < 0.5) return throwError("Internet connexion error")
    else return of([...this.products])
  }

  getPageProducts(page: number, size: number): Observable<PageProduct> {
    let index = page * size;
    let totalPages = ~~(this.products.length / size)
    if (this.products.length % size != 0) totalPages++;
    let pageProducts = this.products.slice(index, index + size)
    return of({ page: page, size: size, totalPages: totalPages, products: pageProducts })
  }

  public deleteProduct(id: string): Observable<boolean> {
    this.products = this.products.filter(p => p.id != id)
    return of(true)
  }
  public setPromotion(id: string): Observable<boolean> {
    let product = this.products.find(p => p.id == id)
    if (product != undefined) {
      return of(true)
    }
    else { return throwError(() => new Error('Product not found')) }
  }

  public searchProducts(keyword: string, page: number, size: number): Observable<PageProduct> {
    let result = this.products.filter(p => p.name.includes(keyword))
    let index = page * size;
    let totalPages = ~~(result.length / size)
    if (result.length % size != 0) totalPages++;
    let pageProducts = result.slice(index, index + size)
    return of({ page: page, size: size, totalPages: totalPages, products: pageProducts })
  }

  public addNewProduct(product : Product) : Observable<Product> {
    product.id = UUID.UUID();
    this.products.push(product);
    return of (product)
  }

  public getProduct(id : string) : Observable<Product> {
    let product = this.products.find((p)=> (p.id == id))
    if (product == undefined) return throwError(()=> new Error('Product not found'))
    return of (product)
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

  public updateProduct(product : Product) : Observable<Product>{
    this.products = this.products.map( (p) => { 
      if (p.id === product.id) {
        return product;
      } else {
        return p;
      }
     })
    return of (product)
  }
}
