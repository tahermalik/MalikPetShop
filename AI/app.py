from fastapi import FastAPI
from recommend import Recommender
from services.vector_service import VectorServices
from fastapi.middleware.cors import CORSMiddleware
import redis
import os
import json
import threading


app = FastAPI(
    title="MalikPetShop Recommender",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://malik-pet-shop-main.vercel.app",
        "malik-pet-shop-main-ovj0mol0i-taher-maliks-projects.vercel.app"
        
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

r = redis.Redis(host='localhost') ## for local host stuff
# r = redis.Redis(host=os.getenv("REDIS_URL"))

vs=VectorServices()
recommender=Recommender(vs)
@app.get("/health")
def health_check():
    return {"status": "ok"}



# this is the endpoint when server 1 is the one calls the server 2
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

    
    
def consume():
    while True:
        result = r.brpop("ToIngest", timeout=5)
        if result is None:
            continue
        _, data = result
        products = json.loads(data)
        recommender.ingest_products(products)

# start consumer in background
t = threading.Thread(target=consume, daemon=True)
t.start()

