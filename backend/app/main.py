from contextlib import asynccontextmanager
from .db import engine, Base, SessionLocal
from . import security, models
from .routers import (
    products, stock, suppliers, purchase_orders, 
    integrations, auth, admin_users, admin_logs, 
    reports, search, settings
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Create default admin if no admin exists
    db = SessionLocal()
    try:
        admin_exists = db.query(models.User).filter(models.User.role == "ADMIN").first()
        if not admin_exists:
            print("INFO: Criando usuário administrador padrão (admin@admin.com)...")
            hashed_pw = security.get_password_hash("123456")
            admin_user = models.User(
                name="Administrador",
                email="admin@admin.com",
                password_hash=hashed_pw,
                role="ADMIN",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
    except Exception as e:
        print(f"ERRO: Falha ao criar admin padrão: {e}")
    finally:
        db.close()
    
    yield

app = FastAPI(title="Gestão de Estoque ERP", lifespan=lifespan)

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
