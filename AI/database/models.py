from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class ProductEmbedding(Base):
    __tablename__ = "product_embeddings"

    product_id = Column(String, primary_key=True)
    description = Column(String)
    usp = Column(String)
    embedding = Column(Vector(1536))  # matches Gemini embedding size