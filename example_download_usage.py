#!/usr/bin/env python3
"""
Example usage of the conversation downloader.

This script demonstrates how to use the ConversationDownloader class
to download conversations from MongoDB in different ways.
"""

from download_conversations import ConversationDownloader
import json
import os

def example_basic_download():
    """Example: Basic download of all conversations."""
    print("=== Basic Download Example ===")
    
    try:
        # Initialize downloader
        # Option 1: Use environment variables (MONGODB_DATABASE and MONGODB_COLLECTION)
        downloader = ConversationDownloader()
        
        # Option 2: Specify database and collection names directly
        # downloader = ConversationDownloader(database_name="your_db_name", collection_name="your_collection_name")
        
        # Download all conversations
        conversations_data = downloader.download_all_conversations()
        
        # Save to file
        filename = downloader.save_to_file(conversations_data, "all_conversations.json")
        print(f"📁 File saved to: {os.path.abspath(filename)}")
        
        # Get statistics
        stats = downloader.get_conversation_stats(conversations_data)
        print(f"Downloaded {stats['total_sessions']} sessions with {stats['total_messages']} total messages")
        
        # Close connection
        downloader.close_connection()
        
        return filename
        
    except Exception as e:
        print(f"Error in basic download: {e}")
        return None



def main():
    """Run all examples."""
    print("🚀 Running Conversation Downloader Examples\n")
    
    # Run examples
    example_basic_download()
    
    print("\n✅ All examples completed!")

if __name__ == "__main__":
    main()
