# MongoDB Conversation Downloader

This Python script downloads all chat conversations from your MongoDB database and exports them in a structured JSON format.

## Features

- Downloads all chat sessions from MongoDB
- Exports conversations in the requested JSON format
- Provides detailed statistics about conversations
- Supports filtering and analysis
- Handles errors gracefully
- Sorts conversations by datetime

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   Create a `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/your_database_name
   ```

## Usage

### Basic Usage

```python
from download_conversations import ConversationDownloader

# Initialize downloader
downloader = ConversationDownloader()

# Download all conversations
conversations_data = downloader.download_all_conversations()

# Save to file
filename = downloader.save_to_file(conversations_data)

# Close connection
downloader.close_connection()
```

### Command Line Usage

```bash
python download_conversations.py
```

This will:
- Download all conversations from MongoDB
- Save them to a timestamped JSON file
- Display statistics
- Save a separate statistics file

## Output Format

The script exports conversations in this JSON structure:

```json
{
  "conversations": [
    {
      "session_id": "session_123",
      "datetime": "2024-01-15T10:30:00.000Z",
      "conversation": [
        {
          "role": "user",
          "message": "Hello, how are you?",
          "timestamp": "2024-01-15T10:30:00.000Z"
        },
        {
          "role": "assistant", 
          "message": "I'm doing well, thank you!",
          "timestamp": "2024-01-15T10:30:05.000Z"
        }
      ],
      "username": "user123",
      "member": "lisa",
      "message_count": 2
    }
  ],
  "total_sessions": 1,
  "export_timestamp": "2024-01-15T12:00:00.000Z",
  "database_info": {
    "mongodb_uri": "mongodb://localhost:27017/your_database_name",
    "collection": "chatsessions"
  }
}
```

## Examples

See `example_download_usage.py` for various usage examples:

- Basic download of all conversations
- Filtered downloads (e.g., conversations with more than 5 messages)
- User-specific downloads
- Conversation analysis and statistics

## Database Schema

The script expects MongoDB collections with this structure (based on your Mongoose models):

**ChatSession Collection:**
```javascript
{
  sessionId: String,
  username: String,
  member: String,
  createdAt: Date,
  messages: [
    {
      role: String, // 'user' or 'assistant'
      content: String,
      timestamp: Date
    }
  ]
}
```

## Error Handling

The script includes comprehensive error handling:
- Missing environment variables
- MongoDB connection issues
- Individual session processing errors
- File writing errors

## Statistics

The script provides detailed statistics:
- Total number of sessions
- Total number of messages
- User vs assistant message counts
- Unique users and members
- Date range of conversations

## Files Generated

- `conversations_export_YYYYMMDD_HHMMSS.json` - Main conversation data
- `conversations_export_YYYYMMDD_HHMMSS_stats.json` - Statistics data

## Requirements

- Python 3.7+
- pymongo
- python-dotenv
- MongoDB database with chat sessions

## Troubleshooting

1. **Connection Error**: Check your `MONGODB_URI` in the `.env` file
2. **No Data**: Verify the collection name is `chatsessions` (case-sensitive)
3. **Permission Error**: Ensure you have read access to the MongoDB database
4. **Memory Issues**: For large datasets, consider processing in batches
