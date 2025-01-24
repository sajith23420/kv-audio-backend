import Product from "../models/product";

export function addProduct(req,res){
    const data = req.body;
    const newProduct = new Product(data);
    newProduct.save()
    .then(()=>{
        res.json({message:"Product added succsessfully"})
    })
    .catch((error)=>{
        res.status(500).json({error:"Product addision faild"})
    })
}