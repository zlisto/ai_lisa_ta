#!/usr/bin/env python3
"""
Example usage of the VectorStoreManager for creating and managing OpenAI vector stores.
"""

from vector_store_manager import VectorStoreManager
import os

def example_create_and_upload():
    """Example of creating a vector store and uploading files."""
    
    # Initialize the manager
    manager = VectorStoreManager()
    
    # Create a vector store
    print("🚀 Creating vector store...")
    vector_store_id = manager.create_vector_store(
        name="AI Lisa TA Documents"
    )
    
    # Automatically find all files in the knowledge_base folder
    knowledge_base_folder = "knowledge_base"
    file_paths = []
    
    if os.path.exists(knowledge_base_folder):
        print(f"📁 Scanning folder: {knowledge_base_folder}")
        for root, dirs, files in os.walk(knowledge_base_folder):
            for file in files:
                file_path = os.path.join(root, file)
                file_paths.append(file_path)
                print(f"  Found: {file_path}")
        
        if not file_paths:
            print(f"⚠️  No files found in {knowledge_base_folder} folder")
    else:
        print(f"⚠️  Folder {knowledge_base_folder} does not exist")
        print("   Creating empty folder for you...")
        os.makedirs(knowledge_base_folder, exist_ok=True)
        print(f"   Please add your files to the {knowledge_base_folder} folder and run again")
    
    if file_paths:
        print(f"\n📁 Uploading {len(file_paths)} files...")
        file_ids = manager.upload_multiple_files(file_paths, vector_store_id)
        
        # Wait for processing to complete
        print("\n⏳ Waiting for file processing...")
        success = manager.wait_for_processing(vector_store_id)
        
        if success:
            print("✅ All files processed successfully!")
        else:
            print("❌ File processing failed or timed out")
    
    # Get and display vector store information
    print("\n📊 Vector Store Information:")
    info = manager.get_vector_store_info(vector_store_id)
    for key, value in info.items():
        print(f"  {key}: {value}")
    
    # Save vector store ID to environment
    print(f"\n💾 Saving vector store ID to .env file...")
    with open('.env', 'a') as f:
        f.write(f"\nOPENAI_VECTOR_STORE_ID={vector_store_id}\n")
    
    print("\n" + "="*60)
    print("🎯 VECTOR STORE ID FOR LISA:")
    print("="*60)
    print(f"OPENAI_VECTOR_STORE_ID={vector_store_id}")
    print("="*60)
    print("📋 Copy this ID and use it in your Lisa application!")
    print("🎉 Setup complete! You can now use this vector store ID in your applications.")
    print("="*60)
    
    return vector_store_id

def example_list_stores():
    """Example of listing all vector stores."""
    manager = VectorStoreManager()
    
    print("📋 Listing all vector stores...")
    stores = manager.list_vector_stores()
    
    if stores:
        for i, store in enumerate(stores, 1):
            print(f"\n{i}. {store['name']}")
            print(f"   ID: {store['id']}")
            print(f"   Status: {store['status']}")
            print(f"   Files: {store['file_counts']}")
    else:
        print("No vector stores found.")

def example_list_files_in_store(vector_store_id: str):
    """Example of listing files in a specific vector store."""
    manager = VectorStoreManager()
    
    print(f"📁 Listing files in vector store: {vector_store_id}")
    files = manager.list_files_in_vector_store(vector_store_id)
    
    if files:
        print(f"\n📋 Found {len(files)} files:")
        print("-" * 80)
        for i, file in enumerate(files, 1):
            print(f"{i}. {file['name']}")
            print(f"   Vector Store ID: {file['vector_store_id']}")
            print(f"   File ID: {file['file_id']}")
            print(f"   Status: {file['status']}")
            print(f"   Size: {file['size_bytes']} bytes")
            print(f"   Created: {file['created_at']}")
            print(f"   Purpose: {file['purpose']}")
            print("-" * 80)
    else:
        print("No files found in this vector store.")

def example_list_my_vector_stores():
    """Example of listing all vector stores with their IDs."""
    manager = VectorStoreManager()
    
    print("📋 Listing all your vector stores...")
    stores = manager.list_my_vector_stores()
    
    if stores:
        print(f"\n🎯 Found {len(stores)} vector stores:")
        print("=" * 80)
        for i, store in enumerate(stores, 1):
            print(f"{i}. {store['name']}")
            print(f"   Vector Store ID: {store['vector_store_id']}")
            print(f"   Status: {store['status']}")
            print(f"   Files: {store['file_counts']}")
            print(f"   Created: {store['created_at']}")
            print("=" * 80)
    else:
        print("No vector stores found.")

if __name__ == "__main__":
    print("🤖 OpenAI Vector Store Manager Example")
    print("=" * 50)
    
    try:
        # Create and upload example
        vector_store_id = example_create_and_upload()
        
        # List all stores with their IDs
        print("\n" + "=" * 50)
        example_list_my_vector_stores()
        
        # List files in the created vector store
        print("\n" + "=" * 50)
        example_list_files_in_store(vector_store_id)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("\n💡 Make sure you have:")
        print("   1. Set your OPENAI_API_KEY in a .env file")
        print("   2. Installed required packages: pip install -r requirements.txt")
        print("   3. Valid file paths if uploading files")
