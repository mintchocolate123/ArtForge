from fastapi import APIRouter
from fastapi.responses import FileResponse
from pathlib import Path

router = APIRouter()

RESOURCE_DIR = Path(__file__).parent.parent.parent / "resource"

@router.get("/list")
def list_files(path: str = ""):
    target = RESOURCE_DIR / path
    print(f"target: {target}, exists: {target.exists()}, is_dir: {target.is_dir()}")
    if not target.exists() or not target.is_dir():
        return {"error": "路徑不存在"}
    
    files = []
    for f in target.iterdir():
        files.append({
            "name": f.name,
            "path": str(f.relative_to(RESOURCE_DIR)),
            "is_dir": f.is_dir(),
            "suffix": f.suffix.lower(),
        })
    return {"files": sorted(files, key=lambda x: (not x["is_dir"], x["name"]))}

@router.get("/image")
def get_image(path: str):
    target = RESOURCE_DIR / path
    if not target.exists():
        return {"error": "檔案不存在"}
    return FileResponse(target)

@router.get("/read")
def read_file(path: str):
    target = RESOURCE_DIR / path
    if not target.exists():
        return {"error": "檔案不存在"}
    if target.suffix.lower() == ".json":
        return {"content": target.read_text(encoding="utf-8")}
    return {"error": "不支援的檔案類型"}