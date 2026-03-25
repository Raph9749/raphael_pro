from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.setting import Setting

router = APIRouter()


@router.get("/")
async def list_settings(
    category: Optional[str] = None,
    is_public: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all settings."""
    query = db.query(Setting)
    if category:
        query = query.filter(Setting.category == category)
    if is_public is not None:
        query = query.filter(Setting.is_public == is_public)

    settings_list = query.order_by(Setting.category, Setting.key).all()
    result = []
    for s in settings_list:
        result.append({
            "id": str(s.id),
            "key": s.key,
            "value": s.value,
            "value_type": s.value_type,
            "category": s.category,
            "description": s.description,
            "is_public": s.is_public,
            "updated_at": str(s.updated_at),
        })
    return result


@router.get("/{key}")
async def get_setting(
    key: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a setting by key."""
    setting = db.query(Setting).filter(Setting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Paramètre introuvable")
    return {
        "id": str(setting.id),
        "key": setting.key,
        "value": setting.value,
        "value_type": setting.value_type,
        "category": setting.category,
        "description": setting.description,
        "is_public": setting.is_public,
    }


@router.put("/{key}")
async def update_setting(
    key: str,
    value: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a setting value."""
    setting = db.query(Setting).filter(Setting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Paramètre introuvable")

    setting.value = value
    db.commit()
    db.refresh(setting)
    return {
        "message": "Paramètre mis à jour avec succès",
        "success": True,
        "key": setting.key,
        "value": setting.value,
    }


@router.post("/")
async def create_setting(
    key: str,
    value: str,
    value_type: str = "string",
    category: str = "general",
    description: Optional[str] = None,
    is_public: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new setting."""
    existing = db.query(Setting).filter(Setting.key == key).first()
    if existing:
        raise HTTPException(status_code=400, detail="Un paramètre avec cette clé existe déjà")

    setting = Setting(
        key=key,
        value=value,
        value_type=value_type,
        category=category,
        description=description,
        is_public=is_public,
    )
    db.add(setting)
    db.commit()
    db.refresh(setting)
    return {
        "message": "Paramètre créé avec succès",
        "success": True,
        "id": str(setting.id),
        "key": setting.key,
    }


@router.delete("/{key}")
async def delete_setting(
    key: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a setting."""
    setting = db.query(Setting).filter(Setting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Paramètre introuvable")

    db.delete(setting)
    db.commit()
    return {"message": "Paramètre supprimé avec succès", "success": True}
