from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from routes import auth, health
from config.db import engine, Base

# ── CRITICAL: import ALL models before create_all so every table is registered ─
import models.user          # noqa: F401
import models.assessment    # noqa: F401

# Create DB tables (idempotent – safe to run every startup)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="PreventIQ Auth API")

# Connect the routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(health.router, prefix="/api/health", tags=["Health Assessment"])

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    error = errors[0] if errors else {}
    field = str(error["loc"][-1]) if error.get("loc") else None
    msg = error.get("msg", "Validation error")
    
    # Customize message for better readability if needed
    if msg.startswith("Value error, "):
        msg = msg.replace("Value error, ", "")

    return JSONResponse(
        status_code=400,
        content={
            "error": True,
            "message": msg,
            "code": "VALIDATION_ERROR",
            "field": field
        }
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if isinstance(exc.detail, dict) and "error" in exc.detail:
        return JSONResponse(
            status_code=exc.status_code,
            content=exc.detail
        )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": str(exc.detail),
            "code": "HTTP_ERROR",
            "field": None
        }
    )
