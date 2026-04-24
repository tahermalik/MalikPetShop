from services.embedding import createEmbedding
class Recommender:
    def __init__(self,vs):
        self.e=createEmbedding()
        self.vs=vs
    
    def ingest_products(self,payload : list):
        if (len(payload)==0):
            return {"status": "no products to ingest"}
        key_list=[]
        value_list=[]
        for obj in payload:
            key_list.append(obj["_id"])
            combinedData=f"DESCRIPTION:{obj["description"]}. USP:{obj["usp"]}"
            value_list.append(combinedData)
            
        # result is an list of list whereas each inner list is of length 1536
        result=self.e.get_embeddings(value_list)
        # print(len(result),len(result[0])) # n,1536
        
        self.vs.addProductsEmbedding(result,payload)
        return {"status": "Products inserted"}
    
    
    # in this case payload will be an object
    def ingest_product(self,payload):
        if (len(payload.keys())==0):
            return {"status": "no product to ingest"}
        key_list=[payload["_id"]]
        combinedData=f"DESCRIPTION:{payload["description"]}. USP:{payload["usp"]}"
        value_list=[combinedData]
            
        # result is an list of list whereas each inner list is of length 1536
        result=self.e.get_embedding(value_list[0])
        # print(len(result),len(result[0])) # n,1536
        
        self.vs.add_product_embedding(payload["_id"],payload["description"],payload["usp"],result)
        return {"status": "Product Inserted"}
    
    def recommend_products(self,userQuery: str):
        embedding=self.e.get_embedding(userQuery)
        # will return the list of dictionary
        return self.vs.search_similar_products(embedding,top_k=5)
        
    
    