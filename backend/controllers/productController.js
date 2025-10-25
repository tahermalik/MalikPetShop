import Product from "../schema/productSchema.js";


export async function addProduct(req,res){
    try{
        console.log("inside add Product")
        const productData=req.body

        const {
            pet,
            category,
            type,
            flavor,
            breed,
            diet,
            brand,
            productName,
            originalPrice,
            netWeight,
            discountValue,
            discountType,
            stock,
            color,
            material,
            size,
            height,
            length,
            width,
            expiryDate,
            manufactureDate
        } = productData;

        const number_regex=/^\d+(\.\d+)?$/

        if(!number_regex.test(Number(originalPrice))){
            return res.status(400).json({message:"only numbers are allowed"})
        }
        if(!number_regex.test(Number(discountValue))){
            return res.status(400).json({message:"only numbers are allowed"})
        }
        if(!number_regex.test(Number(netWeight))){
            return res.status(400).json({message:"only numbers are allowed"})
        }

        
        //// identifying the product uniquely on the basis of name, netWeight and company
        const product_db=await Product.findOne({productName:productName,netWeight:Number(netWeight),brand:brand})

        if(product_db){
            // console.log("Product is already there in the DB")
            return res.status(409).json({message:"Product is already there in the DB"})
        }

        const product=await Product.create({
            productName:productName,
            originalPrice:Number(originalPrice),
            brand:brand,
            category:category,
            type:type,
            flavor:flavor,
            discountType:discountType,
            breed:breed,
            diet:diet,
            discountValue:Number(discountValue),
            expiryDate:expiryDate,
            manufactureDate:manufactureDate,
            netWeight:Number(netWeight),
            pet:pet,
            stock:stock,
            height:Number(height),
            width:Number(width),
            length:Number(length),
            color:color,
            size:Number(size),
            material:material
        })

        return res.status(201).json({message:"Product successfully added into the DB"})

    }catch(error){
        console.log("wrong in addProduct",error)
        return res.status(500).json({message:"SOmething went wrong at the server end"})
    }
}

export async function updateProduct(req,res){
    try{
        //// find the product to update
        let {name,company,netWeight,originalPrice,discount,expiry,animal}=req.body;
        if(!name || !originalPrice || !company || !expiry || !discount || !netWeight || !animal){
            return res.status(400).json({message:"All the fields are mandatory"})
        }

        const number_regex=/^\d+(\.\d+)?$/

        if(!number_regex.test(Number(originalPrice))){
            return res.status(400).json({message:"only numbers are allowed"})
        }
        if(!number_regex.test(Number(discount))){
            return res.status(400).json({message:"only numbers are allowed"})
        }
        if(!number_regex.test(Number(netWeight))){
            return res.status(400).json({message:"only numbers are allowed"})
        }


        const string_regex=/^[A-Za-z]+$/
        if(!string_regex.test(animal)){
            return res.status(400).json({message:"only letter are allowed in animal"})
        }
        netWeight=Number(netWeight)
        originalPrice=Number(originalPrice)
        discount=Number(discount)



        const filter = { name, company, netWeight }; // find the product
        const update = { originalPrice, discount, expiry,animal }; // values to update

        const result = await Product.updateOne(filter, { $set: update });

        if(!result.modifiedCount){
            return res.status(400).json({message:"chnages are not been done"})
        }

        return res.status(200).json({message:"changes made succesffully"})



        
    }catch(error){
        console.log("wrong in updateProduct",error);
        return res.status(500).json({message:"Something went wrong at server side in updateProduct"})
    }
}

export async function deleteProduct(req,res){
    try{
        const {name,company,netWeight}=req.body;

        if(!name || !company || !netWeight){
            return res.status(400).json({message:"All the fields are mandatory"})
        }

        const number_regex=/^\d+(\.\d+)?$/

        if(!number_regex.test(Number(netWeight))){
            return res.status(400).json({message:"only numbers are allowed"})
        }

        const status=await Product.deleteOne({name:name,company:company,netWeight:Number(netWeight)})
        console.log("status",status)
        if(!status?.deletedCount){
            return res.status(404).json({message:"Item does not exists"})
        }


        return res.status(200).json({message:"product deleted successfully"})

    }catch(error){
        console.log("wrong in deleteProduct",error);
        return res.status(500).json({message:"Something went wrong at server side in deleteProduct"})
    }
}



