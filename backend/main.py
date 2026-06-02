import sys
import os

# Add backend directory to path so imports work from any working directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, leaves, salaries, policies

app = FastAPI(title="Employee Management Agent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router,     prefix="/api",          tags=["Chat"])
app.include_router(leaves.router,   prefix="/api/leaves",   tags=["Leaves"])
app.include_router(salaries.router, prefix="/api/salaries", tags=["Salaries"])
app.include_router(policies.router, prefix="/api/policies", tags=["Policies"])


@app.get("/")
async def root():
    return {"message": "Employee Management Agent API", "docs": "/docs"}
