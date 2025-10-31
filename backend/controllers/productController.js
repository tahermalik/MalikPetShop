import Product from "../schema/productSchema.js";
import fs from "fs";
import natural from "natural";


export async function addProduct(req,res){
    try{
        console.log("inside add Product")
        const productData=req.body
        const imagePath = req.file ? req.file.path : null;
        let productString=""

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
            manufactureDate,

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

        /// creating the product String
        console.log("product Data",productData)
        const textFields = [
            pet, category, type, flavor, breed, diet, brand, productName, color, material
        ];

        productString = textFields.filter(Boolean).join(" ") + " " + netWeight + " ";

        
        //// identifying the product uniquely on the basis of name, netWeight and company
        const product_db=await Product.findOne({productName:productName,brand:brand})
        // console.log(product_db)
        if(product_db){

            //// if the product satisfies my candidate key
            ///// for now if we want to update a variation then simply delete that variation and add the variation with updated fields again
            if(product_db.netWeight.includes(Number(netWeight))){
                // let counter=0;      /// fetching the index of the variation that is to be updated
                // for(let i=0;i<product_db.netWeight.length;i++){
                //     if(product_db.netWeight[i]===netWeight){
                //         counter=i;
                //         break;
                //     }
                // }

                // product_db["flavor"][counter]=flavor
                // product_db["expiryDate"][counter]=expiryDate
                // product_db["manufactureDate"][counter]=manufactureDate

                // product_db["discountValue"][counter]=discountValue
                // product_db["discountType"][counter]=discountType
                // product_db["originalPrice"][counter]=originalPrice

                // product_db["stock"][counter]=stock
                // product_db["image"][index] = imagePath;

                return res.status(200).json({message:"Product is alrasy present"})
            }
            productString = productString.trim().replace(/\s+/g, " ").toLowerCase();
            await Product.updateOne(
                { _id: product_db._id },
                { $push: { netWeight: Number(netWeight),discountType:discountType,discountValue:Number(discountValue),expiryDate:expiryDate,manufactureDate:manufactureDate,stock:Number(stock) ,originalPrice:Number(originalPrice),image: imagePath ? imagePath : null,productString:productString} }
            );
            
            return res.status(200).json({message:"Variation of existing item added"})
        }


        await Product.create({
            productName:productName,
            originalPrice:[Number(originalPrice)],
            brand:brand,
            category:category,
            type:type,
            flavor:flavor,
            discountType:[discountType],
            breed:breed,
            diet:diet,
            discountValue:[Number(discountValue)],
            expiryDate:[expiryDate],
            manufactureDate:[manufactureDate],
            netWeight:[Number(netWeight)],
            pet:pet,
            stock:[Number(stock)],
            height:Number(height),
            width:Number(width),
            length:Number(length),
            color:color,
            size:Number(size),
            material:material,
            productString:[productString.toLowerCase()],
            image: imagePath ? [imagePath] : [],
        })

        return res.status(201).json({message:"Product successfully added into the DB"})

    }catch(error){
        console.log("wrong in addProduct",error)
        return res.status(500).json({message:"SOmething went wrong at the server end"})
    }
}

export async function displayProduct(req,res){
    try{
        let userQuery=req?.body?.userQuery
        userQuery = userQuery.trim().replace(/\s+/g, " ").toLowerCase();

        let queryArray=userQuery.split(" ");

        const products=await Product.find()

        // Filter and calculate match percentage
        const matchedProducts = products.map((product) => {
            if (!product.productString || product.productString.length===0) return null;

            let maxPercentage=0
            for(let i=0;i<product.productString.length;i++){
                const productArray = product.productString[i]
                .toLowerCase()
                .split(" ")
                .filter(Boolean);

                // Count how many query words exist in product string
                let matches=0
                for(let p=0;p<productArray.length;p++){
                    for(let j=0;j<queryArray.length;j++){
                        const similarity = natural.JaroWinklerDistance(productArray[p], queryArray[j]);
                        if(similarity>=0.8){
                            matches+=1;
                            break;
                        }
                    }
                }
                const total = productArray.length;
                const percentage = (matches / total) * 100;

                if(percentage>=maxPercentage) maxPercentage=percentage
            }



            // Return product with score
            return { ...product._doc, matchPercentage: maxPercentage };
        })
        .filter((p) => p && p.matchPercentage >= 0) // keep only relevant ones
        .sort((a, b) => b.matchPercentage - a.matchPercentage); // sort by % desc


        console.log(queryArray,matchedProducts)

        return res.status(200).json({ products: matchedProducts });
        
    }catch(error){
        console.log("wrong in displayProduct")
        return res.status(500).json({message:"Wrong in displayProduct"})
    }
}

export async function deleteProduct(req,res){
    try{
        const productId=req?.params?.id;
        let {imgCounter}=req.body;
        imgCounter=Number(imgCounter)

        console.log("delete product",productId,imgCounter)

        if(!productId || imgCounter<0){
            return res.status(400).json({message:"All the fields are mandatory"})
        }

        const number_regex=/^\d+(\.\d+)?$/

        if(!number_regex.test(imgCounter)){
            return res.status(400).json({message:"only numbers are allowed"})
        }

        const product=await Product.findById(productId);
        if(!product) return res.status(404).json({message:"Product is not available"})

        //// if the product is available
        const productObj=product._doc
        let keyArray=Object.keys(productObj)
        console.log(productObj,keyArray)
        let hasUpdated=false

        for(let i=0;i<keyArray.length;i++){
            let value=productObj[keyArray[i]];
            if(Array.isArray(value)){
                if(value.length>1){
                    /// invalid stuff
                    if(imgCounter>=value.length) return res.status(400).json({message:"Dont mess with the system"})
    
                    /// valid stuff so remove the data from the index as mentioned
                    value.splice(imgCounter,1)
                    hasUpdated=true
                }else{
                    await Product.deleteOne({_id:productId})
                    console.log("Deleting the entire product")
                    return res.status(200).json({message:"Product got deleted"})
                }
            }
        }
        if(hasUpdated){
            await product.save()
        }

        return res.status(200).json({message:"product deleted successfully"})
    }catch(error){
        console.log("wrong in deleteProduct",error);
        return res.status(500).json({message:"Something went wrong at server side in deleteProduct"})
    }
}



