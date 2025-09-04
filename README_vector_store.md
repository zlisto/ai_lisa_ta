# OpenAI Vector Store Manager

This Python module provides a comprehensive solution for creating and managing OpenAI vector stores, including file uploads and processing.

## Features

- ✅ Create new vector stores
- ✅ Upload single or multiple files
- ✅ Monitor processing status
- ✅ Retrieve vector store information
- ✅ List all vector stores
- ✅ Automatic .env file management

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   Create a `.env` file in your project root with:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_VECTOR_STORE_ID=
   ```

3. **Run the example:**
   ```bash
   python example_usage.py
   ```

## Usage

### Basic Usage

```python
from vector_store_manager import VectorStoreManager

# Initialize manager
manager = VectorStoreManager()

# Create a vector store
vector_store_id = manager.create_vector_store(
    name="My Documents",
    description="Document storage for embeddings"
)

# Upload files
file_ids = manager.upload_multiple_files([
    "document1.pdf",
    "document2.txt"
], vector_store_id)

# Wait for processing
manager.wait_for_processing(vector_store_id)
```

### Advanced Usage

```python
# Get vector store information
info = manager.get_vector_store_info(vector_store_id)
print(f"Status: {info['status']}")
print(f"File count: {info['file_counts']}")

# List all vector stores
stores = manager.list_vector_stores()
for store in stores:
    print(f"Store: {store['name']} - {store['id']}")
```

## File Types Supported

The vector store supports various file types including:
- PDF documents
- Text files (.txt)
- Markdown files (.md)
- Word documents (.docx)
- And more...

## Error Handling

The module includes comprehensive error handling:
- API key validation
- File existence checks
- Rate limiting protection
- Processing timeout handling

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_VECTOR_STORE_ID`: Automatically set after creating a vector store

## Notes

- Files are processed asynchronously by OpenAI
- Use `wait_for_processing()` to ensure files are ready before querying
- The module automatically saves the vector store ID to your `.env` file
- Rate limiting is handled with automatic delays between uploads
