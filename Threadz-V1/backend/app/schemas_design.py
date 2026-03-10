from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime

class DesignBase(BaseModel):
    design_name: Optional[str] = None
    is_public: Optional[bool] = False
    tags: Optional[str] = None

class DesignCreate(DesignBase):
    pass

class DesignResponse(DesignBase):
    design_id: str
    user_id: Optional[str] = None
    design_source: Optional[str] = None
    image_url: str
    thumbnail_url: Optional[str] = None
    ai_prompt: Optional[str] = None
    ai_style: Optional[str] = None
    width_px: Optional[int] = None
    height_px: Optional[int] = None
    dpi: Optional[int] = None
    file_size_kb: Optional[int] = None
    moderation_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class DesignPaginatedResponse(BaseModel):
    designs: List[DesignResponse]
    current_page: int
    total_pages: int
    total_designs: int
