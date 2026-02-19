from __future__ import annotations

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import admin, auth, catalog, health, orders, super_admin, image_generation, text_generation


def create_app() -> FastAPI:
    app = FastAPI(title="Flower Vendor API", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )

    # Handle OPTIONS requests explicitly for CORS preflight
    @app.options("/{full_path:path}")
    async def options_handler(request: Request, full_path: str):
        """Handle OPTIONS requests for CORS preflight."""
        origin = request.headers.get("origin")
        # Check if origin is allowed
        if origin and origin in settings.cors_origins_list:
            allow_origin = origin
        elif "*" in settings.cors_origins_list:
            allow_origin = "*"
        else:
            allow_origin = settings.cors_origins_list[0] if settings.cors_origins_list else "*"
        
        return Response(
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": allow_origin,
                "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Max-Age": "3600",
            },
        )

    app.include_router(health.router)
    app.include_router(auth.router)
    app.include_router(catalog.router)
    app.include_router(orders.router)
    app.include_router(admin.router)
    app.include_router(super_admin.router)
    app.include_router(image_generation.router)
    app.include_router(text_generation.router)
    return app


app = create_app()


