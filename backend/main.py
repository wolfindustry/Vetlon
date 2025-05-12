from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from bson import ObjectId  # ObjectId bilan ishlash

# MongoDB bilan bog'lanish
client = MongoClient("mongodb://localhost:27017/")
db = client["services_db"]
services_collection = db["services"]
udb = client["users_db"]
users_collection = udb["users"]
costs_collection = db["costs"]  # costlar uchun yangi kolleksiya

app = FastAPI()

# CORS qo'shish
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Pydantic modellari
class Users(BaseModel):
    name: str
    phone: str
    email: str

class Service(BaseModel):
    name: str
    description: str
    img_url: str

class Cost(BaseModel):
    id: int  # Bu yerda `id`ni integer sifatida qabul qilamiz
    amount: float


# Default ma'lumotlarni baza bilan to'ldirish
@app.on_event("startup")
async def startup_db():
    # Default costlarni qo'shish
    if costs_collection.count_documents({}) == 0:
        default_costs = [
            {"_id": ObjectId(), "id": 1, "name": "Service 1", "amount": 200.000},
            {"_id": ObjectId(), "id": 2, "name": "Service 2", "amount": 200.000},
            {"_id": ObjectId(), "id": 3, "name": "Service 3", "amount": 200.000}
        ]
        costs_collection.insert_many(default_costs)


# **1. Costlarni olish (GET)**
@app.get("/api/costs", response_model=List[Cost])
async def get_costs():
    costs = list(costs_collection.find({}, {"_id": 0}))  # costlarni olish
    return costs


# **2. Costlarni yangilash (POST)**
@app.post("/api/costs/update", response_model=Cost)
async def update_cost(cost: Cost):
    try:
        # Faqat id=1, 2 yoki 3 bo'lgan costlarni yangilaymiz
        if cost.id not in [1, 2, 3]:
            raise HTTPException(status_code=400, detail="Invalid cost ID. Only ID 1, 2, or 3 are allowed.")

        result = costs_collection.update_one(
            {"id": cost.id},  # costning `id`ga mos kelganini yangilash
            {"$set": {"amount": cost.amount}}  # amountni yangilash
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Cost not found")

        return cost  # yangilangan costni qaytarish

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating cost: {str(e)}")


# **3. Services va Userlarni qo'shish (yuzaga keltirish)**
@app.get("/api/services", response_model=List[Service])
async def get_services():
    services = list(services_collection.find({}, {"_id": 0}))
    return services

@app.post("/api/services", response_model=Service)
async def add_service(service: Service):
    service_dict = service.dict()
    services_collection.insert_one(service_dict)
    return service

@app.post('/user')
async def add_users(user: Users):
    try:
        user_dict = user.dict()
        users_collection.insert_one(user_dict)
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inserting user: {str(e)}")
