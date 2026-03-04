from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import engine, Base
from .routers import products, stock, suppliers, purchase_orders, integrations

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gestão de Estoque API")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok"}

# Include routers
app.include_router(products.router)
app.include_router(stock.router)
app.include_router(suppliers.router)
app.include_router(purchase_orders.router)
app.include_router(integrations.router)
