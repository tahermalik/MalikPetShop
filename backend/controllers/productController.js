import Product from "../schema/productSchema.js";
import natural from "natural";
import User from "../schema/userSchema.js";
import { cartCleanUp } from "./cartController.js";
import { wishListCleanUp } from "./userController.js";
import mongoose from "mongoose";

//// working
export async function addProduct(req, res) {
    try {
        console.log("inside add Product")
        const productData = req.body
        const imagePath = req.file ? req.file.path : null;
        let productString = ""

        let {
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

        /// just to avoid bugs in future
        brand=brand.toLowerCase()

        const number_regex = /^\d+(\.\d+)?$/

        //// cleaning productName
        const cleanProductName = productName.replace(/[^a-zA-Z\s]/g, "").replace(/\s+/g, " ").trim()

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
        // console.log("product Data", productData)
        const textFields = [
            pet, category, type, flavor, breed, diet, brand, productName, color, material
        ];

        productString = textFields.filter(Boolean).join(" ") + " " + netWeight + " ";


        //// identifying the product uniquely on the basis of followong field so that variations can be indentified like if the product is an variation or not
        const product_db = await Product.findOne({ pet: pet, brand: brand ,category:category, type:type, flavor:flavor, breed:breed, diet:diet})
        // console.log(product_db)
        if (product_db) {

            let name2 = cleanProductName.split(" ")
            let name1 = product_db?.cleanProductName.split(" ")
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

            /// this feature is currently under development as planned it will contain stuff for updating the product variation
            if (product_db.netWeight.includes(Number(netWeight)) && percentage >= 90) {
                return res.status(200).json({ message: "Product is already present" })
            }
            productString = productString.trim().replace(/\s+/g, " ").toLowerCase();
            await Product.updateOne(
                { _id: product_db._id },
                { $push: { netWeight: Number(netWeight), discountType: discountType, discountValue: Number(discountValue), expiryDate: expiryDate, manufactureDate: manufactureDate, stock: Number(stock),reservedStock:0, originalPrice: Number(originalPrice), image: imagePath ? imagePath : null, productString: productString } }
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
            reservedStock:[0],
            height: Number(height),
            width: Number(width),
            length: Number(length),
            color: color,
            size: Number(size),
            material: material,
            productString: [productString.toLowerCase()],
            image: imagePath ? [imagePath] : [],
            cleanProductName: cleanProductName
        })

        return res.status(201).json({ message: "Product successfully added into the DB" })

    } catch (error) {
        console.log("wrong in addProduct", error)
        return res.status(500).json({ message: "Something went wrong at the server end" })
    }
}

/// working
export async function displayProduct(req, res) {
    try {
        const limit = parseInt(req.body.limit) || 20;
        const page = parseInt(req.body.page) || 1;
        const skip = (page - 1) * limit;
        // console.log(limit,lastId)

        let userQuery = req?.body?.userQuery
        if (!userQuery) userQuery = ""

        userQuery = userQuery.trim().replace(/\s+/g, " ").toLowerCase();

        /// this userQuery can have multiple common words possible due to same word in search bar and filter
        console.log("User query at the server side is " + userQuery)

        let uniqueQueryArray = []
        let queryArray = userQuery.split(" ");  //// some pre processing need to be done on this in order to remove the duplicate words
        for (let i = 0; i < queryArray.length; i++) {
            let flag = false;
            for (let j = 0; j < uniqueQueryArray.length; j++) {
                const similarity = natural.JaroWinklerDistance(uniqueQueryArray[j], queryArray[i]);
                if (similarity >= 0.8) {
                    flag = true;
                    break;
                }
            }

            if (flag == false) uniqueQueryArray.push(queryArray[i]);

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


        // ---- PAGINATION HERE ✅ ----
        const paginatedProducts = matchedProducts.slice(
            skip,
            skip + limit
        );

        const hasMore = skip + limit < matchedProducts.length;

        return res.status(200).json({
            products: paginatedProducts,
            hasMore,
        });
        // console.log(queryArray,paginatedProducts)

    } catch (error) {
        console.log("wrong in displayProduct")
        return res.status(500).json({ message: "Wrong in displayProduct" })
    }
}

/// working
export async function deleteProduct(req, res) {
    const session=await mongoose.startSession()
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

        const product = await Product.findById(productId).session(session);
        if (!product) return res.status(404).json({ message: "Product is not available" })

        //// if the product is available
        const productObj = product._doc
        let keyArray = Object.keys(productObj)
        console.log(productObj, keyArray)
        let hasUpdated = false

        await session.startTransaction()

        /// so that both can execute in parallel
        try{
            await Promise.all([
                cartCleanUp(productId, imgCounter,session), /// productId,productVariation
                wishListCleanUp(productId, imgCounter,session)
            ])
        }catch(error){
            await session.abortTransaction()
            return res.status(500).json({message:"Wrong in cart or wishlist cleanup"})
        }

        for (let i = 0; i < keyArray.length; i++) {
            let value = productObj[keyArray[i]];
            // console.log(i,value)
            //// condition is written to ensure the deletion of variation and not the complete product
            if (Array.isArray(value) && keyArray[i] !== "wishList" && keyArray[i] != "cart") {
                if (value.length > 1) {
                    /// invalid stuff
                    if (imgCounter >= value.length) return res.status(400).json({ message: "Dont mess with the system" })

                    /// valid stuff so remove the data from the index as mentioned
                    value.splice(imgCounter, 1)
                    hasUpdated = true
                } else {
                    await Product.deleteOne({ _id: productId }).session(session)
                    console.log("Deleting the entire product")
                }
            }
        }

        /// exceuted when the product variation is deleted
        if (hasUpdated) {
            await product.save({session})
        }

        await session.commitTransaction()

        return res.status(200).json({ message: "product deleted successfully" })
    } catch (error) {
        console.log("wrong in deleteProduct", error);
        await session.abortTransaction()
        return res.status(500).json({ message: "Something went wrong at server side in deleteProduct" })
    }finally{
        await session.endSession()
    }
}

//// function specially created for cart as it stores product via their ID's ; ///working
export async function getProductsViaIds(req, res) {
    try {
        const { productIds } = req?.body
        const productData = await Product.find({ _id: { $in: productIds } })
        const productMap = new Map(productData.map(p => [p._id.toString(), p]));
        const orderedProducts = productIds.map(id => productMap.get(id));
        return res.status(200).json({ productData: orderedProducts })

    } catch (error) {
        console.log("server fucked up at getProductViaIds", error)
        return res.status(500).json({ message: "server fucked up at getProductViaIds", bool: false })
    }
}



