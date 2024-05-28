import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/modules/product/model';
import { ProductService } from 'src/app/modules/product/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit{
  products:Product[]=[];
  skeletons:number[]=[...new Array(6)];
  error!:string;
  isLoading=true;
  images:string[]=[

"https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074076.jpg"

  ];
  currentImageIndex = 0; 
  constructor(private _productService:ProductService){
  }
  ngOnInit(): void {
   this.newArrivalProducts();
  }
  newArrivalProducts(){
    this.isLoading=true;
    const startIndex=Math.round(Math.random()*20);
    const lastIndex=startIndex+6;
    this._productService.get.subscribe(data=>{
      this.isLoading=false;
      this.products=data.slice(startIndex,lastIndex);
    },
    error=>this.error=error.message
    );
  }
  changeImage(index: number): void {
    this.currentImageIndex = index;
  }
}
