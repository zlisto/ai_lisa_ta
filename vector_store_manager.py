import os
import openai
from dotenv import load_dotenv
import time
from typing import List, Optional

# Load environment variables from .env file
load_dotenv()

class VectorStoreManager:
    def __init__(self):
        """Initialize the VectorStoreManager with OpenAI API key."""
        self.api_key = os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        # Initialize OpenAI client
        self.client = openai.OpenAI(api_key=self.api_key)
        
    def create_vector_store(self, name: str, description: Optional[str] = None) -> str:
        """
        Create a new vector store on OpenAI.
        
        Args:
            name (str): Name for the vector store
            description (str, optional): Description for the vector store
            
        Returns:
            str: The vector store ID
        """
        try:
            print(f"Creating vector store: {name}")
            
            # Create the vector store
            vector_store = self.client.vector_stores.create(
                name=name,
                description=description
            )
            
            vector_store_id = vector_store.id
            print(f"✅ Vector store created successfully!")
            print(f"Vector Store ID: {vector_store_id}")
            print(f"Name: {vector_store.name}")
            print(f"Status: {vector_store.status}")
            
            return vector_store_id
            
        except Exception as e:
            print(f"❌ Error creating vector store: {str(e)}")
            raise
    
    def upload_file_to_vector_store(self, file_path: str, vector_store_id: str) -> str:
        """
        Upload a file to the specified vector store.
        
        Args:
            file_path (str): Path to the file to upload
            vector_store_id (str): ID of the vector store
            
        Returns:
            str: The file ID
        """
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")
            
            print(f"Uploading file: {file_path}")
            
            # Upload the file
            with open(file_path, 'rb') as file:
                uploaded_file = self.client.files.create(
                    file=file,
                    purpose='assistants'
                )
            
            file_id = uploaded_file.id
            print(f"✅ File uploaded successfully! File ID: {file_id}")
            
            # Add file to vector store
            print(f"Adding file to vector store...")
            vector_store_file = self.client.vector_stores.files.create(
                vector_store_id=vector_store_id,
                file_id=file_id
            )
            
            print(f"✅ File added to vector store successfully!")
            return file_id
            
        except Exception as e:
            print(f"❌ Error uploading file: {str(e)}")
            raise
    
    def upload_multiple_files(self, file_paths: List[str], vector_store_id: str) -> List[str]:
        """
        Upload multiple files to the vector store.
        
        Args:
            file_paths (List[str]): List of file paths to upload
            vector_store_id (str): ID of the vector store
            
        Returns:
            List[str]: List of file IDs
        """
        file_ids = []
        
        for file_path in file_paths:
            try:
                file_id = self.upload_file_to_vector_store(file_path, vector_store_id)
                file_ids.append(file_id)
                # Small delay to avoid rate limiting
                time.sleep(1)
            except Exception as e:
                print(f"❌ Failed to upload {file_path}: {str(e)}")
                continue
        
        print(f"✅ Successfully uploaded {len(file_ids)} out of {len(file_paths)} files")
        return file_ids
    
    def get_vector_store_info(self, vector_store_id: str) -> dict:
        """
        Get information about a vector store.
        
        Args:
            vector_store_id (str): ID of the vector store
            
        Returns:
            dict: Vector store information
        """
        try:
            vector_store = self.client.vector_stores.retrieve(vector_store_id)
            
            info = {
                'id': vector_store.id,
                'name': vector_store.name,
                'description': vector_store.description,
                'status': vector_store.status,
                'file_counts': vector_store.file_counts,
                'created_at': vector_store.created_at,
                'expires_after': vector_store.expires_after
            }
            
            return info
            
        except Exception as e:
            print(f"❌ Error retrieving vector store info: {str(e)}")
            raise
    
    def list_vector_stores(self) -> List[dict]:
        """
        List all vector stores.
        
        Returns:
            List[dict]: List of vector store information
        """
        try:
            vector_stores = self.client.vector_stores.list()
            
            stores_info = []
            for store in vector_stores.data:
                stores_info.append({
                    'id': store.id,
                    'name': store.name,
                    'description': store.description,
                    'status': store.status,
                    'file_counts': store.file_counts,
                    'created_at': store.created_at
                })
            
            return stores_info
            
        except Exception as e:
            print(f"❌ Error listing vector stores: {str(e)}")
            raise
    
    def wait_for_processing(self, vector_store_id: str, timeout: int = 300) -> bool:
        """
        Wait for vector store processing to complete.
        
        Args:
            vector_store_id (str): ID of the vector store
            timeout (int): Maximum time to wait in seconds
            
        Returns:
            bool: True if processing completed successfully
        """
        print("⏳ Waiting for vector store processing to complete...")
        
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                vector_store = self.client.vector_stores.retrieve(vector_store_id)
                
                if vector_store.status == 'completed':
                    print("✅ Vector store processing completed!")
                    return True
                elif vector_store.status == 'failed':
                    print("❌ Vector store processing failed!")
                    return False
                else:
                    print(f"Status: {vector_store.status} - Waiting...")
                    time.sleep(10)
                    
            except Exception as e:
                print(f"❌ Error checking vector store status: {str(e)}")
                return False
        
        print("⏰ Timeout reached while waiting for processing")
        return False


def main():
    """Example usage of the VectorStoreManager."""
    try:
        # Initialize the manager
        manager = VectorStoreManager()
        
        # Create a vector store
        vector_store_id = manager.create_vector_store(
            name="My Document Store",
            description="A vector store for document embeddings"
        )
        
        # Example: Upload files (replace with your actual file paths)
        # file_paths = [
        #     "path/to/your/document1.pdf",
        #     "path/to/your/document2.txt",
        #     "path/to/your/document3.md"
        # ]
        # 
        # file_ids = manager.upload_multiple_files(file_paths, vector_store_id)
        
        # Get vector store information
        info = manager.get_vector_store_info(vector_store_id)
        print("\n📊 Vector Store Information:")
        for key, value in info.items():
            print(f"{key}: {value}")
        
        # Save the vector store ID to .env file
        with open('.env', 'a') as f:
            f.write(f"\nOPENAI_VECTOR_STORE_ID={vector_store_id}\n")
        
        print(f"\n💾 Vector Store ID saved to .env file: {vector_store_id}")
        
        return vector_store_id
        
    except Exception as e:
        print(f"❌ Error in main: {str(e)}")
        return None


if __name__ == "__main__":
    main()
