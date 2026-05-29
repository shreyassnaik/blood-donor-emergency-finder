from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from ..database import execute_query
from ..schemas.user import UserCreate, UserResponse, Token, UserLogin
from ..utils.security import get_password_hash, verify_password, create_access_token
from datetime import timedelta

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    # Check if user already exists
    query = "SELECT id FROM users WHERE email = %s"
    existing_user = execute_query(query, (user.email,), fetch=True)
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and insert user
    hashed_password = get_password_hash(user.password)
    insert_query = """
        INSERT INTO users (email, password_hash, role)
        VALUES (%s, %s, %s)
    """
    try:
        user_id = execute_query(insert_query, (user.email, hashed_password, user.role), commit=True)
        
        # Fetch the created user to return
        user_query = "SELECT id, email, role, created_at FROM users WHERE id = %s"
        new_user = execute_query(user_query, (user_id,), fetch=True)
        return new_user[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    query = "SELECT * FROM users WHERE email = %s"
    users = execute_query(query, (user_data.email,), fetch=True)
    
    if not users:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = users[0]
    if not verify_password(user_data.password, user['password_hash']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user['email'], "id": user['id'], "role": user['role']}
    )
    return {"access_token": access_token, "token_type": "bearer"}
