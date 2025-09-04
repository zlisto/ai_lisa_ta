#!/usr/bin/env python3
"""
Simple script to test MongoDB connection and list databases/collections.
This script only shows what's available without downloading any data.
"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
load_dotenv()

def test_mongodb_connection():
    """Test MongoDB connection and list databases/collections."""
    try:
        # Get MongoDB URI
        mongodb_uri = os.getenv('MONGODB_URI')
        if not mongodb_uri:
            print("❌ MONGODB_URI not found in environment variables")
            print("   Please create a .env file with your MongoDB connection string")
            return
        
        print(f"🔌 Connecting to MongoDB...")
        print(f"   URI: {mongodb_uri}")
        
        # Connect to MongoDB
        client = MongoClient(mongodb_uri)
        
        # Test connection
        client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
        
        # List all databases
        print("\n📋 Available databases:")
        for db_name in client.list_database_names():
            print(f"   - {db_name}")
        
        # Try to detect database name from URI
        from urllib.parse import urlparse
        parsed_uri = urlparse(mongodb_uri)
        if parsed_uri.path and len(parsed_uri.path) > 1:
            detected_db = parsed_uri.path[1:]  # Remove leading slash
            print(f"\n🔍 Database name found in URI: {detected_db}")
            
            # Show collections in the detected database
            db = client[detected_db]
            print(f"\n📋 Collections in '{detected_db}':")
            for collection_name in db.list_collection_names():
                doc_count = db[collection_name].count_documents({})
                print(f"   - {collection_name} ({doc_count} documents)")
        else:
            print("\n🔍 No database name found in URI")
            print("   You may need to specify the database name in your .env file")
        
        # Also check the ai_lisa_probability database specifically
        print(f"\n📋 Collections in 'ai_lisa_probability' database:")
        try:
            ai_db = client['ai_lisa_probability']
            for collection_name in ai_db.list_collection_names():
                doc_count = ai_db[collection_name].count_documents({})
                print(f"   - {collection_name} ({doc_count} documents)")
        except Exception as e:
            print(f"   ❌ Error accessing ai_lisa_probability database: {str(e)}")
        
        # Close connection
        client.close()
        print("\n🔌 Connection closed")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("\n💡 Troubleshooting tips:")
        print("   1. Check your MONGODB_URI in the .env file")
        print("   2. Make sure your MongoDB cluster is accessible")
        print("   3. Verify your username/password are correct")
        print("   4. Check if your IP is whitelisted in MongoDB Atlas")

if __name__ == "__main__":
    test_mongodb_connection()
