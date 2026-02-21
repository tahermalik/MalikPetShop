from fastapi import FastAPI
from recommend import Recommender
from vector_store import VectorStore

app = FastAPI(
    title="MalikPetShop Recommender",
    version="1.0.0"
)
vs=VectorStore()
recommender=Recommender(vs)
@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/ingest")
def ingest_endpoint(payload: dict):
    # print(payload["products"])
    products_data=payload["products"]   # products_data will be an array of objects
    return recommender.ingest_products(products_data)

@app.post("/recommend")
def recommendProducts(query: dict):
    try:
        userQuery=query["userQuery"]
        return recommender.recommend_products(userQuery)
    except Exception as e:
        print(e)
    
@app.post("/rebuild_faiss")
def rebuild_faiss(productIdDict:dict):
    productId=str(productIdDict["productId"])
    vs.rebuild_faiss(productId)
    
    
