import csv
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, security
from ..db import get_db
from ..security import get_current_user

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=schemas.Product, status_code=201)
def create_product(
    product: schemas.ProductCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    security.create_access_log(
        db=db,
        user_id=current_user.id,
        path="/products/",
        method="POST",
        event_type="CREATE_PRODUCT",
        status_code=201,
        details=f"Created product: {db_product.sku} - {db_product.name}"
    )
    
    return db_product

@router.get("/{product_id}", response_model=schemas.Product)
def read_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.put("/{product_id}", response_model=schemas.Product)
def update_product(
    product_id: int,
    product_in: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted"}

@router.post("/{product_id}/image")
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    import os
    import shutil
    
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    upload_dir = "/home/marialuiza/gestao-estoque/backend/static/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"product_{product_id}{file_extension}"
    file_path = os.path.join(upload_dir, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    db_product.image_url = f"/static/uploads/{file_name}"
    db.commit()
    
    return {"image_url": db_product.image_url}

@router.get("/", response_model=List[schemas.Product])
def read_products(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Product).offset(skip).limit(limit).all()

@router.get("/low-stock", response_model=List[schemas.Product])
def list_low_stock_products(db: Session = Depends(get_db)):
    return db.query(models.Product).filter(models.Product.stock <= models.Product.min_stock).all()

@router.get("/export/csv")
def export_products(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["SKU", "Nome", "Custo", "Preço", "Estoque", "Estoque Mínimo"])
    
    products = db.query(models.Product).all()
    for p in products:
        writer.writerow([p.sku, p.name, p.cost, p.price, p.stock, p.min_stock])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=produtos.csv"}
    )

@router.post("/import/csv")
async def import_products(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    content = await file.read()
    decoded = content.decode("utf-8")
    reader = csv.DictReader(io.StringIO(decoded))
    
    imported_count = 0
    for row in reader:
        # Simple mapping
        sku = row.get("SKU") or row.get("sku")
        if not sku: continue
        
        db_product = db.query(models.Product).filter(models.Product.sku == sku).first()
        if db_product:
            db_product.name = row.get("Nome") or row.get("name") or db_product.name
            db_product.cost = float(row.get("Custo") or row.get("cost") or db_product.cost)
            db_product.price = float(row.get("Preço") or row.get("price") or db_product.price)
            db_product.stock = int(row.get("Estoque") or row.get("stock") or db_product.stock)
            db_product.min_stock = int(row.get("Estoque Mínimo") or row.get("min_stock") or db_product.min_stock)
        else:
            new_product = models.Product(
                sku=sku,
                name=row.get("Nome") or row.get("name"),
                cost=float(row.get("Custo") or row.get("cost") or 0),
                price=float(row.get("Preço") or row.get("price") or 0),
                stock=int(row.get("Estoque") or row.get("stock") or 0),
                min_stock=int(row.get("Estoque Mínimo") or row.get("min_stock") or 0)
            )
            db.add(new_product)
        imported_count += 1
    
    db.commit()
    return {"message": f"Imported {imported_count} products"}
