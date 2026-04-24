from fastapi import FastAPI
from recommend import Recommender
from services.vector_service import VectorServices

app = FastAPI(
    title="MalikPetShop Recommender",
    version="1.0.0"
)
vs=VectorServices()
recommender=Recommender(vs)
@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/ingest")
def ingest_endpoint(payload: dict):
    # print(payload["products"])
    products_data=payload["products"]   # products_data will be an array of objects
    return recommender.ingest_products(products_data)

@app.post("/ingestSingleProduct")
def ingestSingleProduct(payload: dict):
    # print(payload["products"])
    
    product_data=payload["product"]   # product_data will be an object
    
    # print(f"Product Data {product_data}")
    return recommender.ingest_product(product_data)



@app.post("/recommend")
def recommendProducts(query: dict):
    try:
        print("Inside product recommendation")
        userQuery=query["userQuery"] # userQuery python variable will have the string in it
        return recommender.recommend_products(userQuery)
    except Exception as e:
        print(e)

    
    
