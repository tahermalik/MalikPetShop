from database.db import get_connection

conn = get_connection()
cur = conn.cursor()

cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")

conn.commit()
cur.close()
conn.close()

print("pgvector enabled ✅")