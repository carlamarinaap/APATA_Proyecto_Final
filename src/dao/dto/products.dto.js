export default class ProductDTO {
  constructor(product) {
    (this.title = product.title),
      (this.description = product.description),
      (this.price = product.price),
      (this.thumbnails = product.thumbnails ? product.thumbnails : []),
      (this.code = product.code),
      (this.stock = product.stock ? product.stock : 0),
      (this.category = product.category),
      (this.status = product.status ? product.status : true),
      (this.owner = product.owner ? product.owner : "admin");
  }
}
