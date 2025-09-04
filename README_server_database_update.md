# Server Database Configuration Update

## 🎯 **Changes Made**

The React app server has been updated to save chats to the correct database and collection:

- **Database**: `ai-lisa-probability`
- **Collection**: `chats`

## 🔧 **Files Modified**

### 1. **`server/models/ChatSession.js`**
- Updated to use `chats` collection instead of default `chatsessions`
- Added explicit collection name: `mongoose.model('ChatSession', ChatSessionSchema, 'chats')`

### 2. **`server/index.js`**
- Added database name configuration
- Uses `MONGODB_DATABASE` environment variable (defaults to `ai-lisa-probability`)
- Automatically appends database name to MongoDB URI

### 3. **`server/seed-agents.js`**
- Updated to use the same database configuration
- Ensures agents are seeded to the correct database

## 🚀 **How to Use**

### 1. **Set Environment Variables**
Create a `.env` file in the project root:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
MONGODB_DATABASE=ai-lisa-probability
```

### 2. **Test the Connection**
```bash
node test_server_connection.js
```

### 3. **Start the Server**
```bash
cd server
npm start
```

### 4. **Start the React App**
```bash
npm start
```

## 🔍 **Verification**

The server will now:
- ✅ Connect to `ai-lisa-probability` database
- ✅ Save chat sessions to `chats` collection
- ✅ Display connection info on startup
- ✅ Work with the Python download script

## 📊 **Data Structure**

Chat sessions are saved as:
```javascript
// Collection: chats
{
  sessionId: "username_member_uuid",
  username: "zlisto",
  member: "Lisa", 
  createdAt: Date,
  messages: [
    {
      role: "user",
      content: "Hello!",
      timestamp: Date
    },
    {
      role: "assistant",
      content: "Hi there!",
      timestamp: Date
    }
  ]
}
```

## 🐛 **Troubleshooting**

If you see connection errors:
1. Check your `.env` file has the correct `MONGODB_URI`
2. Ensure your MongoDB cluster allows connections from your IP
3. Verify the database name is correct
4. Run `node test_server_connection.js` to test the connection

The React app will now save all chats to the `ai-lisa-probability` database in the `chats` collection! 🎯
