import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "blood_donor_db")

# Connection pool setup
try:
    connection_pool = mysql.connector.pooling.MySQLConnectionPool(
        pool_name="blood_donor_pool",
        pool_size=5,
        pool_reset_session=True,
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
except mysql.connector.Error as err:
    print(f"Error creating connection pool: {err}")
    connection_pool = None

def get_db_connection():
    """Returns a connection from the pool."""
    if connection_pool:
        return connection_pool.get_connection()
    else:
        # Fallback to direct connection if pool failed (not ideal for production)
        return mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )

def execute_query(query, params=None, fetch=False, commit=False):
    """Utility function to execute raw SQL queries."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(query, params or ())
        
        if commit:
            conn.commit()
            
        if fetch:
            return cursor.fetchall()
        
        return cursor.lastrowid
    finally:
        cursor.close()
        conn.close()
