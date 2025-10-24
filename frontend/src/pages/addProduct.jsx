import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import Select from "react-select";
import { cat ,dog,hamster,birds,turtle,rabbit} from "./LandingPage";
import { items_flavor,items_brands,items_breed,items_diet } from "./Product";

export default function AddProduct() {
  const [path,setPath]=useState(
    {
      pet:"",
      category:"",
      type:"",
      flavor:"",
      breed:"",
      diet:"",
      productName:"",
      originalPrice:"",
      netWeight:"",
      discountValue:"",
      discountType:"",
      stock:"",
      color:"",
      material:"",
      size:"",
      height:"",
      length:"",
      width:""
    }
  ) // to know what the admin has selected
  const optionPets = [
      { value: "cat", label: "cat" },
      { value: "dog", label: "dog" },
      { value: "birds", label: "birds" },
      { value: "hamster", label: "hamster" },
      { value: "rabbit", label: "rabbit" },
      { value: "turtle", label: "turtle" },
      
  ];

  const [optionsFlavor,setOptionFlavor]=useState(items_flavor.map((item)=>({value:item,label:item})))
  const [optionsBreed,setOptionBreed]=useState(items_breed.map((item)=>({value:item,label:item})))
  const [optionsDiet,setOptionDiet]=useState(items_diet.map((item)=>({value:item,label:item})))
  const [optionsBrand,setOptionBrand]=useState(items_brands.map((item)=>({value:item,label:item})))
  const [options,setOptions]=useState(optionPets)
  const [optionsCategory,setOptionsCategory]=useState([])
  const [optionsType,setOptionsType]=useState([])

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#eff6ff", // light blue
      borderColor: "#60a5fa",
      borderRadius: "0.5rem",
      boxShadow: "none",
      padding: "2px 4px",
      "&:hover": { borderColor: "#3b82f6" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#dbeafe"
        : "white",
      color: state.isSelected ? "white" : "#1e3a8a",
      cursor: "pointer",
    }),
  };

  function generateOptionsFromObject(obj) {
    return Object.keys(obj).map((key) => ({ value: key, label: key }));
  }

  function generateOptionsFromArray(objArray,category="") {
    if(category==="") return objArray.map((key) => ({ value: key, label: key }));
    else return objArray[category].map((key) => ({ value: key, label: key }));
  } 

  function handlePetSelect(pet){
    pet=pet.toLowerCase();
    if(pet==="cat") setOptionsCategory(generateOptionsFromObject(cat))
    else if(pet==="dog") setOptionsCategory(generateOptionsFromObject(dog))
    else if(pet==="birds") setOptionsCategory(generateOptionsFromArray(birds))
    else if(pet==="rabbit") setOptionsCategory(generateOptionsFromArray(rabbit))
    else if(pet==="turtle") setOptionsCategory(generateOptionsFromArray(turtle))
    else setOptionsCategory(generateOptionsFromArray(hamster))
    setPath({...path,pet:pet,category:"",type:""})

    setOptionsType([])
  }

  function handleCategorySelect(category){
    if(path["pet"]==="cat") setOptionsType(generateOptionsFromArray(cat,category))
    else if(path["pet"]==="dog") setOptionsType(generateOptionsFromArray(dog,category))

    setPath({...path,category:category,type:"",flavor:"",breed:"",diet:""})
  }

  function handleTypeSelect(type){
    setPath({...path,type:type})
  }

  function handleFlavorSelect(flavor){
    setPath({...path,flavor:flavor})
  }

  function handleBreedSelect(breed){
    setPath({...path,breed:breed})
  }
  function handleDietSelect(diet){
    setPath({...path,diet:diet})
  }
  function handleBrandSelect(brand){
    setPath({...path,brand:brand})
  }

  function handleDiscountType(discountType){
    setPath({...path,discountType:discountType})
  }

  function handleReset() {
    setPath({
      pet:"",
      category:"",
      type:"",
      flavor:"",
      breed:"",
      diet:"",
      productName:"",
      originalPrice:"",
      netWeight:"",
      discountValue:"",
      discountType:"",
      stock:"",
      color:"",
      material:"",
      size:"",
      height:"",
      length:"",
      width:""
    });
    setOptionsCategory([]);
    setOptionsType([]);
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-2xl w-[80%] p-8"
      >
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
          Add New Product
        </h2>

        <form className="space-y-4">
            <Select
                options={options}
                onChange={(e)=>handlePetSelect(e.label)}
                placeholder="Select Pet"
                styles={customStyles}
                value={options.find(o => o.value === path.pet) || null}
            />

            <Select
                options={optionsCategory}
                onChange={(e)=>handleCategorySelect(e.label)}
                placeholder="Select Product Category"
                styles={customStyles}
                value={optionsCategory?.find(o => o.value === path.category) || null}
            />

            {(path["pet"]==="cat" || path["pet"]==="dog") && <Select
                options={optionsType}
                onChange={(e)=>handleTypeSelect(e.label)}
                placeholder="Select Product Type"
                styles={customStyles}
                value={optionsType?.find(o => o.value === path.type) || null}
            />
            }

            {(path["pet"]==="cat" || path["pet"]==="dog") && (path["category"]==="treats" || path["category"]==="dog food" || path["category"]==="cat food") && <Select
                options={optionsFlavor}
                onChange={(e)=>handleFlavorSelect(e.label)}
                placeholder="Select Product Flavor"
                styles={customStyles}
                value={optionsFlavor?.find(o => o.value === path.flavor) || null}
            />
            }

            {(path["pet"]==="cat" || path["pet"]==="dog") && <Select
                options={optionsBreed}
                onChange={(e)=>handleBreedSelect(e.label)}
                placeholder="Select Breed"
                styles={customStyles}
                value={optionsBreed?.find(o => o.value === path.breed) || null}
            />
            }

            {(path["pet"]==="cat" || path["pet"]==="dog") && path["category"]=="cage" && path["category"]!=="toys" && <Select
                options={optionsDiet}
                onChange={(e)=>handleDietSelect(e.label)}
                placeholder="Select Veg/Non-Veg"
                styles={customStyles}
                value={optionsDiet?.find(o => o.value === path.diet) || null}
            />
            }

            <Select
                options={optionsBrand}
                onChange={(e)=>handleBrandSelect(e.label)}
                placeholder="Select Brand"
                styles={customStyles}
                value={optionsBrand?.find(o => o.value === path.brand) || null}
            />

            <div className="border border-blue-500 rounded-xl p-2">
              <div className="text-blue-700 mb-2 underline">Product Details</div>
              <div className="productInfo w-full h-auto grid grid-cols-3 items-center gap-x-4 gap-y-4">
                <div className="flex justify-center"><input type="text" name="" id="" placeholder="Name of the product" value={path.productName} onChange={(e) => setPath({...path, productName: e.target.value})} className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none"/></div>
                <div className="flex justify-center"><input type="Number" name="" id="" placeholder="MRP" value={path.originalPrice} onChange={(e) => setPath({...path, originalPrice: e.target.value})} className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none"/></div>
                <div className="flex justify-center"><input type="Number" name="" id="" placeholder="Net Weight in KG" value={path.netWeight} onChange={(e) => setPath({...path, netWeight: e.target.value})}  className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none"/></div>
                <div className="flex justify-center"><input type="Number" name="" id="" placeholder="Discount Value" value={path.discountValue} onChange={(e) => setPath({...path, discountValue: e.target.value})}  className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none"/></div>
                <Select
                  options={[{label:"percent",value:"percent"},{label:"flat",value:"flat"}]}
                  onChange={(e)=>handleDiscountType(e.label)}
                  placeholder="Select Discount Type"
                  styles={customStyles}
                  value={[{label:"percent",value:"percent"},{label:"flat",value:"flat"}]?.find(o => o.value === path.discountType) || null}
                />
                <div className="flex justify-center"><input type="Number" name="" id="" placeholder="Enter the Quantity" value={path.stock} onChange={(e) => setPath({...path, stock: e.target.value})}   className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none"/></div>
              </div>
            </div>

            {path["category"]==="clothing" && <div className="border border-blue-500 rounded-xl p-2">
              <div className="text-blue-700 mb-2 underline">Cloth Details</div>
              <div className="productInfo w-full h-auto grid grid-cols-3 items-center gap-x-4 gap-y-4">
                <div className="flex justify-center"><input type="Number" name="" id="" placeholder="Size in CM" value={path.size} onChange={(e) => setPath({...path, size: e.target.value})}   className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none"/></div>
                <div className="flex justify-center"><input type="text" name="" id="" placeholder="Color"  value={path.color} onChange={(e) => setPath({...path, color: e.target.value})}  className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none"/></div>
                <div className="flex justify-center"><input type="text" name="" id="" placeholder="Material" value={path.material} onChange={(e) => setPath({...path, material: e.target.value})}   className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none"/></div>
              </div>
            </div>
            }

            {path["category"]==="cage" && <div className="border border-blue-500 rounded-xl p-2">
              <div className="text-blue-700 mb-2 underline">Cage Details</div>
              <div className="productInfo w-full h-auto grid grid-cols-3 items-center gap-x-4 gap-y-4">
                <div className="flex justify-center"><input type="Number" name="" id="" placeholder="Length" value={path.length} onChange={(e) => setPath({...path, length: e.target.value})}   className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none"/></div>
                <div className="flex justify-center"><input type="Number" name="" id="" placeholder="Width" value={path.width} onChange={(e) => setPath({...path, width: e.target.value})}   className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none"/></div>
                <div className="flex justify-center"><input type="Number" name="" id="" placeholder="Height" value={path.height} onChange={(e) => setPath({...path, height: e.target.value})}   className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none"/></div>
              </div>
            </div>
            }

            <div className="flex w-full justify-end gap-2">
              <button className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors duration-200">Submit</button>
              <button type="button" onClick={()=>handleReset()} className="border border-gray-400 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">Reset</button>

            </div>
        </form>
      </motion.div>
    </div>
  );
}
