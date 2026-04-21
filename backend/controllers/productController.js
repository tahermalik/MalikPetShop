import Product from "../schema/productSchema.js";
import natural from "natural";
import User from "../schema/userSchema.js";
import { cartCleanUp } from "./cartController.js";
import { wishListCleanUp } from "./userController.js";
import mongoose from "mongoose";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import redisClient from "../config/redis.js";

//// working
export async function addProduct(req, res) {
    try {
        console.log("Adding the product --> message for the addProduct backend function")
        const productData = req.body

        // req.file all thanks to middleware
        const fileBuffer  = req.file ? req.file.buffer : null;
        // console.log("image Path --> ",fileBuffer,typeof(fileBuffer))
        
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

        let description=req?.body?.description || ""
        let usp=req?.body?.usp || ""

        /// just to avoid bugs in future
        brand = brand.toLowerCase()

        const number_regex = /^\d+(\.\d+)?$/

        //// cleaning productName
        const cleanProductName = productName
            .replace(/[^a-zA-Z0-9\s]/g, "") // keep letters + numbers + space
            .replace(/\s+/g, " ")           // replace multiple spaces → single space
            .trim();

        description=(description || "").trim().toLowerCase()
        usp=(usp || "").trim().toLowerCase()

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
        const product_db = await Product.findOne({ pet: pet, brand: brand, category: category, type: type, flavor: flavor, breed: breed, diet: diet })
        // console.log(product_db)

        // adding the variation of the product
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

            // ✅ upload image only when variation is actually being added
            const imagePath = fileBuffer ? await uploadToCloudinary(fileBuffer) : null;

            await Product.updateOne(
                { _id: product_db._id },
                { $push: { netWeight: Number(netWeight), discountType: discountType, discountValue: Number(discountValue), expiryDate: expiryDate, manufactureDate: manufactureDate, stock: Number(stock), reservedStock: 0, originalPrice: Number(originalPrice), image: imagePath ? imagePath : null, productString: productString } }
            );

            return res.status(200).json({ message: "Variation of existing item added" })
        }

         // ✅ upload image only when new product is actually being created
        const imagePath = fileBuffer ? await uploadToCloudinary(fileBuffer) : null;

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
            reservedStock: [0],
            height: Number(height),
            width: Number(width),
            length: Number(length),
            color: color,
            size: Number(size),
            material: material,
            productString: [productString.toLowerCase()],
            image: imagePath ? [imagePath] : [],
            cleanProductName: cleanProductName,
            description:description,
            usp:usp
        })

        return res.status(201).json({ message: "Product successfully added into the DB" })

    } catch (error) {
        console.log("wrong in addProduct", error)
        return res.status(500).json({ message: "Something went wrong at the server end" })
    }
}

/// working
export async function displayProduct(req, res) {
    let guestId,userId;
    try {
        console.log("inside display product")
        if(req?.userInfo===undefined){
            guestId = req?.cookies?.guestId;
        }else userId=req?.userInfo?.id;

        const isUser=!!userId
        const isGuest=!!guestId

        let userQuery = req?.body?.userQuery
        if (!userQuery) userQuery = ""
        userQuery = userQuery.trim().replace(/\s+/g, " ").toLowerCase();
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

        userQuery=uniqueQueryArray.join(" ")

        let hashKey;
        if(isUser) hashKey=`SearchFilterIds:${userId}:${userQuery}`
        else hashKey=`SearchFilterIds:${guestId}:${userQuery}`

        const limit = parseInt(req.body.limit) || 20;
        const page = parseInt(req.body.page) || 1;
        const skip = (page - 1) * limit;
        // console.log(limit,lastId)

        let redisResult=await redisClient.get(hashKey)


        let paginatedProducts   // array of objects that will be sent to the frontend

        // if there is a redis miss
        if(!redisResult){
    
            /// this userQuery can have multiple common words possible due to same word in search bar and filter
            // console.log("User query at the server side is " + userQuery)
            console.log("Loading data for the page ",page)
    
            
    
    
            const products = await Product.find().select("_id productString")
    
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


            const sortedIds = matchedProducts.map(p => p._id.toString());
            await redisClient.set(hashKey,JSON.stringify(sortedIds),"EX",300) // setting the expiry for 5 minutes

            // both start and end are the index positions
            let end=(page)*limit-1;
            end=(sortedIds.length-1)>=end ? end:sortedIds.length-1;
            let selectedIds=sortedIds.slice(skip,end+1)

            // ✅ use productMap to maintain order
            const productsData = await Product.find({_id:{$in:selectedIds}})
                .select("-wishList -cart")
                .lean()

            const productMap = new Map(productsData.map(p => [p._id.toString(), p]));
            paginatedProducts = selectedIds.map(id => productMap.get(id)).filter(Boolean);


            const hasMore = skip + limit < matchedProducts.length;
            // console.log(hasMore,"more products are there or not")
    
            return res.status(200).json({
                products: paginatedProducts,
                hasMore,
            });
            
        }else{      // if there is a redis hit
            // redisResult would be the array of productIds
            redisResult=JSON.parse(redisResult)

            // both start and end are the index positions
            let start=(page-1)*limit;
            let end=(page)*limit-1;

            // so that we dont go out of bound
            end=(redisResult.length-1)>=end ? end:redisResult.length-1;

            let selectedIds=redisResult.slice(start,end+1)

           // ✅ use productMap to maintain order
            const productsData = await Product.find({_id:{$in:selectedIds}})
                .select("-wishList -cart")
                .lean()

            const productMap = new Map(productsData.map(p => [p._id.toString(), p]));
            paginatedProducts = selectedIds.map(id => productMap.get(id)).filter(Boolean);

            const hasMore = skip + limit < redisResult.length;
            // console.log(hasMore,"more products are there or not")
    
            return res.status(200).json({
                products: paginatedProducts,
                hasMore,
            });

        }
    } catch (error) {
        console.log("wrong in displayProduct",error)
        return res.status(500).json({ message: "Wrong in displayProduct" })
    }
}

/// working
export async function deleteProduct(req, res) {
    const session = await mongoose.startSession()
    try {
        const productId = req?.params?.id;
        let { imgCounter } = req.body;
        if(imgCounter===undefined) return res.status(400).json({ message: "All the fields are mandatory" })
        
        imgCounter = Number(imgCounter)

        console.log("delete product", productId, imgCounter)

        if (!productId || imgCounter < 0 || imgCounter===undefined) {
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
        try {
            await Promise.all([
                cartCleanUp(productId, imgCounter, session), /// productId,productVariation
                wishListCleanUp(productId, imgCounter, session)
            ])
        } catch (error) {
            await session.abortTransaction()
            return res.status(500).json({ message: "Wrong in cart or wishlist cleanup" })
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
            await product.save({ session })
        }

        await session.commitTransaction()

        return res.status(200).json({ message: "product deleted successfully" })
    } catch (error) {
        console.log("wrong in deleteProduct", error);
        await session.abortTransaction()
        return res.status(500).json({ message: "Something went wrong at server side in deleteProduct" })
    } finally {
        await session.endSession()
    }
}

//// function specially created for cart as it stores product via their ID's ; ///working
export async function getProductsViaIds(req, res) {
    try {
        const { productIds,productVariationArray } = req?.body
        console.log("Inside backend",productIds,productVariationArray)

        const productData = await Product.find({ _id: { $in: productIds } }).select("-cleanProductName -category -expiryDate -manufactureDate -type -pet -stock -reservedStock -breed -diet -wishList -cart -productString -description -usp -createdAt -updatedAt") // will return the array of objects
        // console.log(productData) it is an array of objects

        // this is done in order to maintain the order in which frontend sends the id
        const productMap = new Map(productData.map(p => [p._id.toString(), p]));

        const foundIds=[];
        const missingIds=[]

        for(let i=0;i<productIds.length;i++){
            let id=productIds[i].toString()
            let product=productMap.get(id);

            if(product!==undefined){
                let length=product["netWeight"].length;
                let idx=productVariationArray[i]
                if(length<=idx || idx<0) return res.status(400).json({message:`Not proper variation for the product ${product["productName"]}`})
            }

            
            if(product===undefined) missingIds.push(id)
            else foundIds.push(id)
        }

        const orderedProducts = foundIds.map(id => productMap.get(id));

        // console.log("ordered",orderedProducts)

        return res.status(200).json({ productData: orderedProducts ,missingIds:missingIds})

    } catch (error) {
        console.log("server fucked up at getProductViaIds", error)
        return res.status(500).json({ message: "server fucked up at getProductViaIds", bool: false })
    }
}

// function written specifically for the postman
export async function bulkProductAddition(req, res) {
  try {
    console.log("Inside bulk product addition");

    const productsData = req.body?.["sampleProducts"]; // Expecting an array of product objects
    if (!Array.isArray(productsData) || productsData.length === 0) {
      return res.status(400).json({ message: "Please provide a list of products" });
    }

    const files = req.files || []; // array of images

    const results = [];

    let counter=0;

    for (let productData of productsData) {

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

      let description=req?.body?.description || ""
      let usp=req?.body?.usp || ""

      brand = brand.toLowerCase();
      const number_regex = /^\d+(\.\d+)?$/;

      const cleanProductName = productName
            .replace(/[^a-zA-Z0-9\s]/g, "") // keep letters + numbers + space
            .replace(/\s+/g, " ")           // replace multiple spaces → single space
            .trim();

      description=description.trim().toLowerCase()
      usp=usp.trim().toLowerCase()

      // Validate numeric fields
      if (!number_regex.test(Number(originalPrice)) ||
          !number_regex.test(Number(discountValue)) ||
          !number_regex.test(Number(netWeight))) {
        results.push({ productName, status: "failed", reason: "Numeric validation failed" });
        counter+=1;
        continue;
      }

      // Build product string
      const textFields = [pet, category, type, flavor, breed, diet, brand, productName, color, material];
      let productString = textFields.filter(Boolean).join(" ") + " " + netWeight + " ";
      productString = productString.trim().replace(/\s+/g, " ").toLowerCase();

      // Check if product exists
      const product_db = await Product.findOne({ pet, brand, category, type, flavor, breed, diet });

      // checking for the variation
      if (product_db) {
        // Check for similarity using Jaro-Winkler
        let name2 = cleanProductName.split(" ");
        let name1 = product_db.cleanProductName.split(" ");
        let matches = 0;
        for (let p = 0; p < name1.length; p++) {
          for (let j = 0; j < name2.length; j++) {
            const similarity = natural.JaroWinklerDistance(name1[p], name2[j]);
            if (similarity >= 0.8) {
              matches += 1;
              break;
            }
          }
        }
        const percentage = (matches / name1.length) * 100;

        // If variation exists
        if (product_db.netWeight.includes(Number(netWeight)) && percentage >= 90) {
          results.push({ productName, status: "skipped", reason: "Product already exists" });
          counter+=1;
          continue;
        }

        const imageUrl = files[counter] 
            ? await uploadToCloudinary(files[counter].buffer) 
            : null;


        // Update existing product variation
        await Product.updateOne(
          { _id: product_db._id },
          {
            $push: {
              netWeight: Number(netWeight),
              discountType: discountType,
              discountValue: Number(discountValue),
              expiryDate: expiryDate,
              manufactureDate: manufactureDate,
              stock: Number(stock),
              reservedStock: 0,
              originalPrice: Number(originalPrice),
              image: imageUrl ? imageUrl : null,
              productString: productString
            },
          }
        );

        results.push({ productName, status: "updated", reason: "Variation added" });
        counter+=1;
        continue;
      }

      // as the image is stored in the cloudainry so its URL
      const imageUrl = files[counter] 
        ? await uploadToCloudinary(files[counter].buffer) 
        : null;

      // Create new product
      await Product.create({
        productName,
        originalPrice: [Number(originalPrice)],
        brand,
        category,
        type,
        flavor,
        discountType: [discountType],
        breed,
        diet,
        discountValue: [Number(discountValue)],
        expiryDate: [expiryDate],
        manufactureDate: [manufactureDate],
        netWeight: [Number(netWeight)],
        pet,
        stock: [Number(stock)],
        reservedStock: [0],
        height: Number(height),
        width: Number(width),
        length: Number(length),
        color,
        size: Number(size),
        material,
        productString: [productString],
        image: imageUrl ? [imageUrl] : [],
        cleanProductName,
        description:description,
        usp:usp
      });

      results.push({ productName, status: "created", reason: "New product added" });
      counter+=1;
    }

    return res.status(201).json({ message: "Bulk product addition completed", results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Problem with bulk addition", error: error.message });
  }
}
