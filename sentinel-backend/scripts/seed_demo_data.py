import asyncio
import sys
import os
import random
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.models.camera import Camera
from app.models.stream import Stream
from app.models.detection import Detection
from app.models.vehicle import Vehicle
from app.models.license_plate import LicensePlate
from app.models.alert import Alert
from app.models.watchlist import Watchlist
from app.models.location import Location


async def seed_demo_dataset():
    print("Seeding Sentinel AI CCTV Platform Demo Dataset...")
    async with AsyncSessionLocal() as session:
        # Seed 5 Locations
        locations = [
            Location(name="SG Highway Junction", latitude=23.033, longitude=72.502, district="Ahmedabad", zone="North"),
            Location(name="Ashram Road Circle", latitude=23.025, longitude=72.571, district="Ahmedabad", zone="Central"),
            Location(name="Ring Road Toll Plaza", latitude=23.101, longitude=72.603, district="Gandhinagar", zone="East"),
            Location(name="Airport Entrance", latitude=23.077, longitude=72.634, district="Ahmedabad", zone="North"),
            Location(name="Railway Station Gate 1", latitude=23.021, longitude=72.601, district="Ahmedabad", zone="Central"),
        ]
        session.add_all(locations)
        await session.flush()

        # Seed 20 Cameras
        cameras = []
        for i in range(1, 21):
            cam_code = f"CAM-AHM-{i:03d}"
            loc = locations[(i - 1) % len(locations)]
            cam = Camera(
                camera_code=cam_code,
                name=f"CCTV Camera #{i} - {loc.name}",
                description=f"High definition traffic camera at {loc.name}",
                vendor="Hikvision" if i % 2 == 0 else "Dahua",
                model="DS-2CD2143G0-I",
                protocol="RTSP",
                rtsp_url=f"rtsp://admin:secret{i}@192.168.1.{100+i}:554/h264Preview_01_main",
                status="online" if i % 5 != 0 else "offline",
                latitude=loc.latitude + random.uniform(-0.005, 0.005),
                longitude=loc.longitude + random.uniform(-0.005, 0.005),
                location_name=loc.name,
                zone=loc.zone,
                district=loc.district,
                state="Gujarat",
                fps=25,
                resolution="1920x1080"
            )
            cameras.append(cam)
        session.add_all(cameras)
        await session.flush()

        # Seed Streams
        for cam in cameras:
            st = Stream(
                camera_id=cam.id,
                stream_url=cam.rtsp_url,
                stream_type="main",
                status="connected" if cam.status == "online" else "disconnected"
            )
            session.add(st)

        # Seed Watchlist
        sample_watchlist = [
            Watchlist(type="VEHICLE_PLATE", value="GJ01AB1234", description="Stolen White SUV", priority="CRITICAL"),
            Watchlist(type="VEHICLE_PLATE", value="MH12CD5678", description="Suspect Vehicle in Investigation", priority="HIGH")
        ]
        session.add_all(sample_watchlist)
        await session.flush()

        # Seed Detections, Vehicles, License Plates, and Alerts
        plates = ["GJ01AB1234", "MH12CD5678", "DL03EF9012", "KA05GH3456", "GJ18XY9999"]
        now = datetime.now(timezone.utc)

        for idx in range(30):
            cam = random.choice(cameras)
            t_offset = timedelta(minutes=random.randint(5, 500))
            t_stamp = now - t_offset
            
            det = Detection(
                camera_id=cam.id,
                timestamp=t_stamp,
                object_type="vehicle",
                confidence=round(random.uniform(0.85, 0.98), 2),
                bounding_box={"x1": 100, "y1": 150, "x2": 400, "y2": 350},
                track_id=str(random.randint(100, 999))
            )
            session.add(det)
            await session.flush()

            veh = Vehicle(
                detection_id=det.id,
                camera_id=cam.id,
                timestamp=t_stamp,
                vehicle_type=random.choice(["sedan", "suv", "truck", "motorcycle"]),
                color=random.choice(["white", "black", "silver", "blue", "red"]),
                make="Hyundai" if idx % 2 == 0 else "Toyota",
                model="Creta" if idx % 2 == 0 else "Fortuner",
                confidence=det.confidence,
                track_id=det.track_id
            )
            session.add(veh)
            await session.flush()

            plate_no = plates[idx % len(plates)]
            lp = LicensePlate(
                vehicle_id=veh.id,
                camera_id=cam.id,
                timestamp=t_stamp,
                plate_number=plate_no,
                confidence=round(random.uniform(0.90, 0.99), 2),
                country="IND",
                state="GJ"
            )
            session.add(lp)

            if plate_no in ["GJ01AB1234", "MH12CD5678"]:
                alt = Alert(
                    type="VEHICLE_WATCHLIST",
                    severity="CRITICAL" if plate_no == "GJ01AB1234" else "HIGH",
                    status="NEW",
                    camera_id=cam.id,
                    timestamp=t_stamp,
                    title=f"Watchlist vehicle detected: {plate_no}",
                    description=f"Camera {cam.camera_code} at {cam.location_name} spotted watchlist plate {plate_no}",
                    extra_metadata={"plate_number": plate_no, "confidence": lp.confidence}
                )
                session.add(alt)

        await session.commit()
        print("Demo dataset seeded successfully!")
        print("  - 5 Locations")
        print("  - 20 Cameras & Streams")
        print("  - 30 Detections, Vehicles, & ANPR Records")
        print("  - Active Watchlist & Generated Alerts")


if __name__ == "__main__":
    asyncio.run(seed_demo_dataset())
