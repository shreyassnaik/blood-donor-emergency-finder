from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Blood Donor Emergency Finder API")

# CORS configuration to allow the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Blood Donor Emergency Finder API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include routers here as they are implemented
from .routers import auth, donors, requests, notifications, stats
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(donors.router, prefix="/api/donors", tags=["Donors"])
app.include_router(requests.router, prefix="/api/requests", tags=["Blood Requests"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(stats.router, prefix="/api/stats", tags=["Stats"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
