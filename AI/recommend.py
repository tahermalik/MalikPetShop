from embedding import createEmbedding
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
            value_list.append(obj["description"])
            
        # will be an list of embeddings
        result=self.e.get_embeddings(value_list)
        self.vs.addProductsEmbedding(result,payload)
        return {"status": "file created"}
    
    def recommend_products(self,userQuery: str):
        embedding=self.e.get_embedding(userQuery)
        # will return the list of dictionary
        return self.vs.search(embedding,top_k=5)
        
    
    