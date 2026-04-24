from database.db import get_connection

conn = get_connection()
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS product_embeddings (
    product_id TEXT PRIMARY KEY,
    description TEXT,
    usp TEXT,
    embedding VECTOR(1536)
);
""")

conn.commit()
cur.close()
conn.close()

print("Table created ✅")