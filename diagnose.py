import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os

# 1. Define your Database URL
# Replace this with your actual local PostgreSQL URL if it's different.
# Format: postgresql+asyncpg://user:password@localhost:5432/dbname
DB_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres")

async def diagnose_database():
    print(f"🔍 Attempting to connect to: {DB_URL}")

    try:
        # Create an async engine
        engine = create_async_engine(DB_URL, echo=False)

        async with engine.begin() as conn:
            print("✅ Successfully connected to the database!")

            # 2. Check for existing tables
            print("\n📋 Checking for tables...")
            result = await conn.execute(text(
                "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
            ))
            tables = [row[0] for row in result.fetchall()]

            if not tables:
                print("⚠️  Connected, but no tables found. Did you run your migrations (Alembic) or Base.metadata.create_all()?")
            else:
                print(f"✅ Found {len(tables)} tables: {', '.join(tables)}")

                # 3. If tables exist, let's try to count rows in them
                for table in tables:
                    count_result = await conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    count = count_result.scalar()
                    print(f"   -> Table '{table}' has {count} rows.")

    except Exception as e:
        print("\n❌ DATABASE CONNECTION FAILED.")
        print("Here is the exact error:")
        print("-" * 40)
        print(str(e))
        print("-" * 40)
        print("\n💡 Troubleshooting Tips:")
        print("1. Is your Docker container running? (Run: docker ps)")
        print("2. Are the username and password correct?")
        print("3. Do you have the 'asyncpg' driver installed? (Run: pip install asyncpg)")

if __name__ == "__main__":
    # Run the async diagnostic function
    asyncio.run(diagnose_database())
