import faiss
import numpy as np
import os
import pickle

# Dimension of OpenAI text-embedding-3-small
EMBEDDING_DIM = 1536

class VectorStore:
    def __init__(self, index_path="data/faiss.index", meta_path="data/metadata.pkl"):
        self.index_path = index_path
        self.meta_path = meta_path
        os.makedirs("data", exist_ok=True)

        if os.path.exists(self.index_path) and os.path.exists(self.meta_path):
            self.index = faiss.read_index(self.index_path)
            with open(self.meta_path, "rb") as f:
                self.metadata = pickle.load(f)
        else:
            self.index = faiss.IndexFlatL2(EMBEDDING_DIM)
            self.metadata = []

    def addProductEmbedding(self, embedding: list, singleProduct:dict):
        vector = np.array([embedding]).astype("float32")
        faiss.normalize_L2(vector)
        self.index.add(vector)

        self.metadata.append({
            "product_id": singleProduct["_id"],
            "description":singleProduct["description"],
            "usp":singleProduct["usp"],
            "embedding":embedding
        })

        self._persist()

    def addProductsEmbedding(self, embedding, payload):
        self.hard_reset()
        vector = np.array(embedding).astype("float32")
        faiss.normalize_L2(vector)
        self.index.add(vector)

        counter=0
        for obj in payload:
            self.metadata.append({
                "product_id": obj["_id"],
                "description":obj["description"],
                "usp":obj["usp"],
                "embedding":embedding[counter],
            })
            counter+=1

        self._persist()
        
    def search(self, embedding: list, top_k: int = 5):
        if self.index.ntotal == 0:
            return []

        vector = np.array([embedding]).astype("float32")
        faiss.normalize_L2(vector)
        
        # as indices will be an 2D array
        distances, indices = self.index.search(vector, top_k)

        # this is going to be the list of dictionary
        results = []
        for idx in indices[0]:
            # print(idx)
            if idx < len(self.metadata):
                obj=self.metadata[idx]
                # print(obj["product_id"])
                results.append({"product_id":obj["product_id"],"description":obj["description"],"usp":obj["usp"]})

        return results

    def _persist(self):
        faiss.write_index(self.index, self.index_path)
        with open(self.meta_path, "wb") as f:
            pickle.dump(self.metadata, f)

    def rebuild_faiss(self,productId:str):
        self.hard_reset()
        counter=0
        flag=False
        embeddings=[]
        for obj in self.metadata:
            if(obj["product_id"]==productId):
                flag=True
            else:
                embeddings.append(obj["embedding"])   
                if(not flag):
                    counter+=1
        if(flag):
            del self.metadata[counter]
                
        if os.path.exists(self.index_path):
            os.remove(self.index_path)
        if os.path.exists(self.meta_path):
            os.remove(self.meta_path)
            
        if(len(embeddings)==0):
            return {"message":"All the products are being deleted"}
        
        vector = np.array(embeddings).astype("float32")
        faiss.normalize_L2(vector)
        self.index = faiss.IndexFlatL2(EMBEDDING_DIM)
        self.index.add(vector)
        
        faiss.write_index(self.index, self.index_path)
        with open(self.meta_path, "wb") as f:
            pickle.dump(self.metadata, f)
            
    def hard_reset(self):
        # reset memory
        self.index = faiss.IndexFlatL2(EMBEDDING_DIM)
        self.metadata = []

        # reset disk
        if os.path.exists(self.index_path):
            os.remove(self.index_path)
        if os.path.exists(self.meta_path):
            os.remove(self.meta_path)        
        
        