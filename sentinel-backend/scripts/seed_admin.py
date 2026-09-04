import asyncio
import sys
import os

# Add root project path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.role import Role
from app.models.user import User
from app.core.security import hash_password


async def seed_roles_and_admin():
    print("Seeding initial RBAC roles and default admin user...")
    async with AsyncSessionLocal() as session:
        roles_data = [
            ("ADMIN", "System administrator with full privileges"),
            ("OPERATOR", "CCTV Operator with camera and alert management permissions"),
            ("INVESTIGATOR", "Forensic investigator with video analytics search access"),
            ("VIEWER", "Read-only viewer access")
        ]

        role_objs = {}
        for r_name, r_desc in roles_data:
            stmt = select(Role).where(Role.name == r_name)
            res = await session.execute(stmt)
            existing = res.scalar_one_or_none()
            if not existing:
                role = Role(name=r_name, description=r_desc)
                session.add(role)
                await session.flush()
                role_objs[r_name] = role
                print(f"  Created Role: {r_name}")
            else:
                role_objs[r_name] = existing

        # Create Default Admin
        admin_email = "admin@example.com"
        stmt = select(User).where(User.email == admin_email)
        admin_exists = (await session.execute(stmt)).scalar_one_or_none()
        if not admin_exists:
            admin_user = User(
                email=admin_email,
                username="admin",
                password_hash=hash_password("Admin123!"),
                full_name="System Administrator",
                role_id=role_objs["ADMIN"].id,
                is_active=True
            )
            session.add(admin_user)
            await session.commit()
            print("  Created Default Admin User:")
            print("    Email: admin@example.com")
            print("    Password: Admin123!")
        else:
            print("  Admin user already exists.")


if __name__ == "__main__":
    asyncio.run(seed_roles_and_admin())
