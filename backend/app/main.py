from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import engine, Base
from .routers import (
    products, stock, suppliers, purchase_orders, 
    integrations, auth, admin_users, admin_logs, 
    reports, search, settings, access_requests
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gestão de Estoque ERP")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok"}

# Include routers
app.include_router(auth.router)
app.include_router(access_requests.router)
app.include_router(admin_users.router)
app.include_router(admin_logs.router)
app.include_router(search.router)
app.include_router(reports.router)
app.include_router(settings.router)
app.include_router(products.router)
app.include_router(stock.router)
app.include_router(suppliers.router)
app.include_router(purchase_orders.router)
app.include_router(integrations.router)
