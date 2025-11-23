import Product from "../schema/productSchema.js";
import fs from "fs";
import natural from "natural";
import User from "../schema/userSchema.js";
import { cartCleanUp } from "./cartController.js";
import { wishListCleanUp } from "./userController.js";


export async function addProduct(req, res) {
    try {
        console.log("inside add Product")
        const productData = req.body
        const imagePath = req.file ? req.file.path : null;
        let productString = ""

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

        const number_regex = /^\d+(\.\d+)?$/

        //// cleaning productName
        const cleanProductName=productName.replace(/[^a-zA-Z\s]/g, "").replace(/\s+/g, " ").trim()

        if (!number_regex.test(Number(originalPrice))) {
            return res.status(400).json({ message: "only numbers are allowed" })
        }
        if (!number_regex.test(Number(discountValue))) {
            return res.status(400).json({ message: "only numbers are allowed" })
        }
        if (!number_regex.test(Number(netWeight))) {
            return res.status(400).json({ message: "only numbers are allowed" })
        }

        /// creating the product String
        console.log("product Data", productData)
        const textFields = [
            pet, category, type, flavor, breed, diet, brand, productName, color, material
        ];

        productString = textFields.filter(Boolean).join(" ") + " " + netWeight + " ";


        //// identifying the product uniquely on the basis of name, netWeight and company
        const product_db = await Product.findOne({ pet: pet, brand: brand })
        // console.log(product_db)
        if (product_db) {

            let name2=cleanProductName.split(" ")
            let name1=product_db?.cleanProductName.split(" ")
            let matches = 0
            for (let p = 0; p < name1.length; p++) {
                for (let j = 0; j < name2.length; j++) {
                    const similarity = natural.JaroWinklerDistance(name1[p], name2[j]);
                    if (similarity >= 0.8) {
                        matches += 1;
                        break;
                    }
                }
            }
            const total = name1.length;
            const percentage = (matches / total) * 100;

            //// if the product satisfies my candidate key
            ///// for now if we want to update a variation then simply delete that variation and add the variation with updated fields again
            if (product_db.netWeight.includes(Number(netWeight)) && percentage>=90) {
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

                return res.status(200).json({ message: "Product is already present" })
            }
            productString = productString.trim().replace(/\s+/g, " ").toLowerCase();
            await Product.updateOne(
                { _id: product_db._id },
                { $push: { netWeight: Number(netWeight), discountType: discountType, discountValue: Number(discountValue), expiryDate: expiryDate, manufactureDate: manufactureDate, stock: Number(stock), originalPrice: Number(originalPrice), image: imagePath ? imagePath : null, productString: productString } }
            );

            return res.status(200).json({ message: "Variation of existing item added" })
        }


        await Product.create({
            productName: productName,
            originalPrice: [Number(originalPrice)],
            brand: brand,
            category: category,
            type: type,
            flavor: flavor,
            discountType: [discountType],
            breed: breed,
            diet: diet,
            discountValue: [Number(discountValue)],
            expiryDate: [expiryDate],
            manufactureDate: [manufactureDate],
            netWeight: [Number(netWeight)],
            pet: pet,
            stock: [Number(stock)],
            height: Number(height),
            width: Number(width),
            length: Number(length),
            color: color,
            size: Number(size),
            material: material,
            productString: [productString.toLowerCase()],
            image: imagePath ? [imagePath] : [],
            cleanProductName:cleanProductName
        })

        return res.status(201).json({ message: "Product successfully added into the DB" })

    } catch (error) {
        console.log("wrong in addProduct", error)
        return res.status(500).json({ message: "Something went wrong at the server end" })
    }
}

export async function displayProduct(req, res) {
    try {
        let userQuery = req?.body?.userQuery
        if(!userQuery) return res.status(400).json({message:"You cant directly visit this web page"})
            
        userQuery = userQuery.trim().replace(/\s+/g, " ").toLowerCase();

        /// this userQuery can have multiple common words possible due to same word in search bar and filter
        console.log("User query at the server side is "+userQuery)

        let uniqueQueryArray=[]
        let queryArray = userQuery.split(" ");  //// some pre processing need to be done on this in order to remove the duplicate words
        for(let i=0;i<queryArray.length;i++){
            let flag=false;
            for(let j=0;j<uniqueQueryArray.length;j++){
                const similarity = natural.JaroWinklerDistance(uniqueQueryArray[j],queryArray[i]);
                if(similarity>=0.8){
                    flag=true;
                    break;
                }
            }

            if(flag==false) uniqueQueryArray.push(queryArray[i]);

        }
        

        const products = await Product.find()

        // Filter and calculate match percentage
        const matchedProducts = products.map((product) => {
            if (!product.productString || product.productString.length === 0) return null;

            let maxPercentage = 0
            for (let i = 0; i < product.productString.length; i++) {
                const productArray = product.productString[i]
                    .toLowerCase()
                    .split(" ")
                    .filter(Boolean);

                // Count how many query words exist in product string
                let matches = 0
                for (let p = 0; p < productArray.length; p++) {
                    for (let j = 0; j < uniqueQueryArray.length; j++) {
                        const similarity = natural.JaroWinklerDistance(productArray[p], uniqueQueryArray[j]);
                        if (similarity >= 0.8) {
                            matches += 1;
                            break;
                        }
                    }
                }
                const total = productArray.length;
                const percentage = (matches / total) * 100;

                if (percentage >= maxPercentage) maxPercentage = percentage
            }



            // Return product with score
            return { ...product._doc, matchPercentage: maxPercentage };
        })
            .filter((p) => p && p.matchPercentage >= 0) // keep only relevant ones
            .sort((a, b) => b.matchPercentage - a.matchPercentage); // sort by % desc


        // console.log(queryArray,matchedProducts)

        return res.status(200).json({ products: matchedProducts });

    } catch (error) {
        console.log("wrong in displayProduct")
        return res.status(500).json({ message: "Wrong in displayProduct" })
    }
}

/// working
export async function deleteProduct(req, res) {
    try {
        const productId = req?.params?.id;
        let { imgCounter } = req.body;
        imgCounter = Number(imgCounter)

        console.log("delete product", productId, imgCounter)

        if (!productId || imgCounter < 0) {
            return res.status(400).json({ message: "All the fields are mandatory" })
        }

        const number_regex = /^\d+(\.\d+)?$/

        if (!number_regex.test(imgCounter)) {
            return res.status(400).json({ message: "only numbers are allowed" })
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product is not available" })

        //// if the product is available
        const productObj = product._doc
        let keyArray = Object.keys(productObj)
        console.log(productObj, keyArray)
        let hasUpdated = false

        /// so that both can execute in parallel
        await Promise.all([
            cartCleanUp(productId,imgCounter), /// productId,productVariation
            wishListCleanUp(productId,imgCounter)
        ])

        for (let i = 0; i < keyArray.length; i++) {
            let value = productObj[keyArray[i]];

            //// condition is written to ensure the deletion of variation and not the complete product
            if (Array.isArray(value) && keyArray[i]!=="wishList" && keyArray[i]!="cart") {
                if (value.length > 1) {
                    /// invalid stuff
                    if (imgCounter >= value.length) return res.status(400).json({ message: "Dont mess with the system" })

                    /// valid stuff so remove the data from the index as mentioned
                    value.splice(imgCounter, 1)
                    hasUpdated = true
                } else {
                    const wishUserId = productObj["wishList"]
                    for (const userId of wishUserId) {
                        await User.findByIdAndUpdate(userId, { $pull: { wishList: productId } });
                    }
                    await Product.deleteOne({ _id: productId })
                    console.log("Deleting the entire product")
                }
            }
        }

        /// exceuted when the product variation is deleted
        if (hasUpdated) {
            await product.save()
        }

        return res.status(200).json({ message: "product deleted successfully" })
    } catch (error) {
        console.log("wrong in deleteProduct", error);
        return res.status(500).json({ message: "Something went wrong at server side in deleteProduct" })
    }
}

//// function specially created for cart; ///working
export async function getProductsViaIds(req,res){
    try{
        const {productIds}=req?.body
        const productData=await Product.find({ _id:{$in:productIds}})
        const productMap = new Map(productData.map(p => [p._id.toString(), p]));
        const orderedProducts = productIds.map(id => productMap.get(id));
        return res.status(200).json({productData:orderedProducts})

    }catch(error){
        console.log("server fucked up at getProductViaIds",error)
        return res.status(500).json({message:"server fucked up at getProductViaIds",bool:false})
    }
}



