from database.db import get_connection
from pgvector.psycopg2 import register_vector

class VectorServices:
    def add_product_embedding(self,product_id,productName, description, usp, embedding):
        conn = get_connection()
        register_vector(conn)
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO product_embeddings (product_id, description, usp, embedding)
            VALUES (%s,%s, %s, %s, %s::vector)
            ON CONFLICT (product_id) DO UPDATE SET
                productName= EXCLUDED.productName,
                description = EXCLUDED.description,
                usp = EXCLUDED.usp,
                embedding = EXCLUDED.embedding;
        """, (product_id,productName, description, usp, embedding))

        conn.commit()
        cur.close()
        conn.close()

        return {"message": "Embedding stored ✅"}

    def addProductsEmbedding(self,embeddings: list, payload: list):
        """Hard reset then bulk insert all product embeddings"""
        conn = get_connection()
        register_vector(conn)
        cur = conn.cursor()

        # mirror hard_reset — wipe everything first
        cur.execute("DELETE FROM product_embeddings;")

        for i, obj in enumerate(payload):
            cur.execute("""
                INSERT INTO product_embeddings (product_id, productName,description, usp, embedding)
                VALUES (%s, %s,%s, %s, %s::vector)
                ON CONFLICT (product_id) DO UPDATE SET
                    productName=EXCLUDED.productName,
                    description = EXCLUDED.description,
                    usp         = EXCLUDED.usp,
                    embedding   = EXCLUDED.embedding;
            """, (
                str(obj["_id"]),
                obj["productName"],
                obj["description"],
                obj["usp"],
                embeddings[i]
            ))

        conn.commit()
        cur.close()
        conn.close()

    def deleteProduct(self,product_id: str):
            """Mirror of rebuild_faiss — just delete the product by id"""
            conn = get_connection()
            cur = conn.cursor()

            cur.execute("""
                DELETE FROM product_embeddings
                WHERE product_id = %s;
            """, (product_id,))

            conn.commit()
            cur.close()
            conn.close()
        
    def hard_reset(self):
            """Wipe all embeddings"""
            conn = get_connection()
            cur = conn.cursor()
            cur.execute("DELETE FROM product_embeddings;")
            conn.commit()
            cur.close()
            conn.close()

    def search_similar_products(self,query_embedding, top_k=5):
        conn = get_connection()
        register_vector(conn)
        cur = conn.cursor()

        # <=> for cosine similarity and thereby array is converted into the vector so that comarison can be done
        cur.execute("""
            SELECT product_id, productName, description, usp
            FROM product_embeddings
            ORDER BY embedding <=> %s::vector   
            LIMIT %s;
        """, (query_embedding, top_k))

        results = cur.fetchall()

        cur.close()
        conn.close()

        # format output
        output = []
        for row in results:
            output.append({
                "product_id": row[0],
                "productName":row[1],
                "description": row[2],
                "usp": row[3]
            })

        return output

