from typing import List
import os
from google import genai
from dotenv import load_dotenv
from google.genai import types

class createEmbedding:
    def __init__(self):
        load_dotenv()    # serches for .env from the root directory and thereby injects the first .env in the os enviroment
        # self.client=OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    def get_embedding(self,text: str) -> List[float]:
        """
        Generate embedding for a single text
        """
        response = self.client.models.embed_content(
            model="gemini-embedding-001",
            contents=[text],
            config=types.EmbedContentConfig(output_dimensionality=1536)
        )
        return response.embeddings[0].values


    def get_embeddings(self,texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts (batch)
        """
        response = self.client.models.embed_content(
            model="gemini-embedding-001",
            contents=texts,
            config=types.EmbedContentConfig(output_dimensionality=1536)
        )
        return [item.values for item in response.embeddings]
