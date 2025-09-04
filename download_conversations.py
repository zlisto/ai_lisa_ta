#!/usr/bin/env python3
"""
MongoDB Conversation Downloader

This script downloads all chat conversations from MongoDB and exports them
in the requested JSON format:
{
    'conversations': [
        {
            'session_id': session_id,
            'datetime': datetime_of_conversation,
            'conversation': [
                {'role': 'assistant', 'message': '...'},
                {'role': 'user', 'message': '...'}
            ]
        }
    ]
}
"""

import os
import json
from datetime import datetime
from typing import List, Dict, Any
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ConversationDownloader:
    def __init__(self, database_name=None, collection_name=None):
        """
        Initialize the conversation downloader with MongoDB connection.
        
        Args:
            database_name (str, optional): Name of the database. If not provided, will try to get from MONGODB_DATABASE env var or use 'chat_db'
            collection_name (str, optional): Name of the collection. If not provided, will try to get from MONGODB_COLLECTION env var or use 'chatsessions'
        """
        self.mongodb_uri = os.getenv('MONGODB_URI')
        if not self.mongodb_uri:
            raise ValueError("MONGODB_URI not found in environment variables")
        
        # Get database and collection names
        # Default to ailisaprobability database and chats collection
        self.database_name = database_name or os.getenv('MONGODB_DATABASE', 'ailisaprobability')
        self.collection_name = collection_name or os.getenv('MONGODB_COLLECTION', 'chats')
        
        # Connect to MongoDB
        self.client = MongoClient(self.mongodb_uri)
        self.db = self.client[self.database_name]
        self.chat_sessions = self.db[self.collection_name]
        
        print(f"🔌 Connected to MongoDB:")
        print(f"   Database: {self.database_name}")
        print(f"   Collection: {self.collection_name}")
        
        # Test the connection and show collection info
        try:
            # Check if collection exists and get document count
            doc_count = self.chat_sessions.count_documents({})
            print(f"   Documents in collection: {doc_count}")
        except Exception as e:
            print(f"   ⚠️  Warning: Could not access collection - {str(e)}")
    
    def download_all_conversations(self) -> Dict[str, Any]:
        """
        Download all conversations from MongoDB and format them as requested.
        
        Returns:
            Dict containing all conversations in the requested format
        """
        print("🔍 Fetching all chat sessions from MongoDB...")
        
        # Get all chat sessions
        sessions = list(self.chat_sessions.find({}))
        print(f"📊 Found {len(sessions)} chat sessions")
        
        conversations = []
        
        for session in sessions:
            try:
                # Extract session data
                session_id = session.get('sessionId', 'unknown')
                created_at = session.get('createdAt', datetime.now())
                messages = session.get('messages', [])
                
                # Format conversation messages
                conversation_messages = []
                for message in messages:
                    role = message.get('role', 'unknown')
                    content = message.get('content', '')
                    timestamp = message.get('timestamp', created_at)
                    
                    conversation_messages.append({
                        'role': role,
                        'message': content,
                        'timestamp': timestamp.isoformat() if isinstance(timestamp, datetime) else str(timestamp)
                    })
                
                # Create conversation entry
                conversation_entry = {
                    'session_id': session_id,
                    'datetime': created_at.isoformat() if isinstance(created_at, datetime) else str(created_at),
                    'conversation': conversation_messages,
                    'username': session.get('username'),
                    'member': session.get('member'),
                    'message_count': len(conversation_messages)
                }
                
                conversations.append(conversation_entry)
                
            except Exception as e:
                print(f"⚠️  Error processing session {session.get('sessionId', 'unknown')}: {str(e)}")
                continue
        
        # Sort conversations by datetime (newest first)
        conversations.sort(key=lambda x: x['datetime'], reverse=True)
        
        result = {
            'conversations': conversations,
            'total_sessions': len(conversations),
            'export_timestamp': datetime.now().isoformat(),
            'database_info': {
                'database': self.database_name,
                'collection': self.collection_name
            }
        }
        
        print(f"✅ Successfully processed {len(conversations)} conversations")
        return result
    
    def save_to_file(self, data: Dict[str, Any], filename: str = None) -> str:
        """
        Save the conversation data to a JSON file.
        
        Args:
            data: The conversation data to save
            filename: Optional filename (defaults to timestamped filename)
            
        Returns:
            str: The filename where data was saved
        """
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"conversations_export_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Conversations saved to: {os.path.abspath(filename)}")
        return filename
    
    def get_conversation_stats(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get statistics about the downloaded conversations.
        
        Args:
            data: The conversation data
            
        Returns:
            Dict containing conversation statistics
        """
        conversations = data.get('conversations', [])
        
        total_messages = sum(conv.get('message_count', 0) for conv in conversations)
        user_messages = 0
        assistant_messages = 0
        
        for conv in conversations:
            for msg in conv.get('conversation', []):
                if msg.get('role') == 'user':
                    user_messages += 1
                elif msg.get('role') == 'assistant':
                    assistant_messages += 1
        
        # Get unique users and members
        users = set(conv.get('username') for conv in conversations if conv.get('username'))
        members = set(conv.get('member') for conv in conversations if conv.get('member'))
        
        stats = {
            'total_sessions': len(conversations),
            'total_messages': total_messages,
            'user_messages': user_messages,
            'assistant_messages': assistant_messages,
            'unique_users': len(users),
            'unique_members': len(members),
            'users': list(users),
            'members': list(members),
            'date_range': {
                'earliest': min(conv.get('datetime', '') for conv in conversations) if conversations else None,
                'latest': max(conv.get('datetime', '') for conv in conversations) if conversations else None
            }
        }
        
        return stats
    
    def list_databases_and_collections(self):
        """List all available databases and collections."""
        try:
            print("\n📋 Available databases:")
            for db_name in self.client.list_database_names():
                print(f"   - {db_name}")
            
            print(f"\n📋 Collections in '{self.database_name}':")
            for collection_name in self.db.list_collection_names():
                doc_count = self.db[collection_name].count_documents({})
                print(f"   - {collection_name} ({doc_count} documents)")
                
        except Exception as e:
            print(f"❌ Error listing databases/collections: {str(e)}")
    
    def find_database_from_uri(self):
        """Try to extract database name from MongoDB URI."""
        try:
            from urllib.parse import urlparse
            parsed_uri = urlparse(self.mongodb_uri)
            if parsed_uri.path and len(parsed_uri.path) > 1:
                db_name = parsed_uri.path[1:]  # Remove leading slash
                print(f"🔍 Database name found in URI: {db_name}")
                return db_name
            else:
                print("🔍 No database name found in URI - using default database")
                return None
        except Exception as e:
            print(f"❌ Error parsing URI: {str(e)}")
            return None
    
    def close_connection(self):
        """Close the MongoDB connection."""
        self.client.close()
        print("🔌 MongoDB connection closed")


def main():
    """Main function to download and export conversations."""
    try:
        # Initialize downloader
        # You can specify database and collection names here, or they will be read from environment variables
        downloader = ConversationDownloader()
        
        # Try to detect database name from URI
        detected_db = downloader.find_database_from_uri()
        if detected_db and detected_db != downloader.database_name:
            print(f"💡 Tip: Your URI contains database '{detected_db}', but we're using '{downloader.database_name}'")
            print(f"   Consider setting MONGODB_DATABASE={detected_db} in your .env file")
        
        # Show available databases and collections (helpful for debugging)
        downloader.list_databases_and_collections()
        
        # Download all conversations
        conversations_data = downloader.download_all_conversations()
        
        # Get and display statistics
        stats = downloader.get_conversation_stats(conversations_data)
        
        print("\n📈 Conversation Statistics:")
        print(f"   Total Sessions: {stats['total_sessions']}")
        print(f"   Total Messages: {stats['total_messages']}")
        print(f"   User Messages: {stats['user_messages']}")
        print(f"   Assistant Messages: {stats['assistant_messages']}")
        print(f"   Unique Users: {stats['unique_users']}")
        print(f"   Unique Members: {stats['unique_members']}")
        print(f"   Date Range: {stats['date_range']['earliest']} to {stats['date_range']['latest']}")
        
        # Save to file
        filename = downloader.save_to_file(conversations_data)
        print(f"📁 Main conversations file saved to: {os.path.abspath(filename)}")
        
        # Also save statistics
        stats_filename = filename.replace('.json', '_stats.json')
        with open(stats_filename, 'w', encoding='utf-8') as f:
            json.dump(stats, f, indent=2, ensure_ascii=False)
        print(f"📊 Statistics file saved to: {os.path.abspath(stats_filename)}")
        
        # Close connection
        downloader.close_connection()
        
        print(f"\n🎉 Export completed successfully!")
        print(f"   Main file: {os.path.abspath(filename)}")
        print(f"   Stats file: {os.path.abspath(stats_filename)}")
        
        return filename
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None


if __name__ == "__main__":
    main()
