"""Initial migration for Sentinel AI CCTV Platform

Revision ID: 0001_initial_migration
Revises: 
Create Date: 2026-09-04 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '0001_initial_migration'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Roles
    op.create_table(
        'roles',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    # Users
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('username', sa.String(length=100), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('role_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['role_id'], ['roles.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username')
    )

    # Cameras
    op.create_table(
        'cameras',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('camera_code', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.String(length=500), nullable=True),
        sa.Column('vendor', sa.String(length=100), nullable=True),
        sa.Column('model', sa.String(length=100), nullable=True),
        sa.Column('protocol', sa.String(length=20), nullable=False),
        sa.Column('rtsp_url', sa.String(length=500), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('location_name', sa.String(length=255), nullable=True),
        sa.Column('zone', sa.String(length=100), nullable=True),
        sa.Column('district', sa.String(length=100), nullable=True),
        sa.Column('state', sa.String(length=100), nullable=True),
        sa.Column('fps', sa.Integer(), nullable=False),
        sa.Column('resolution', sa.String(length=50), nullable=True),
        sa.Column('last_seen_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('camera_code')
    )

    # Streams
    op.create_table(
        'streams',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('camera_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('stream_url', sa.String(length=500), nullable=False),
        sa.Column('stream_type', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('last_connected_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_error', sa.String(length=500), nullable=True),
        sa.Column('reconnect_count', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['camera_id'], ['cameras.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Detections
    op.create_table(
        'detections',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('camera_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('frame_id', sa.String(length=100), nullable=True),
        sa.Column('object_type', sa.String(length=50), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('bounding_box', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('track_id', sa.String(length=100), nullable=True),
        sa.Column('model_name', sa.String(length=100), nullable=False),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['camera_id'], ['cameras.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Vehicles
    op.create_table(
        'vehicles',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('detection_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('camera_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('vehicle_type', sa.String(length=50), nullable=False),
        sa.Column('color', sa.String(length=50), nullable=True),
        sa.Column('make', sa.String(length=50), nullable=True),
        sa.Column('model', sa.String(length=50), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('track_id', sa.String(length=100), nullable=True),
        sa.Column('embedding_reference', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['camera_id'], ['cameras.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['detection_id'], ['detections.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # License Plates
    op.create_table(
        'license_plates',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('vehicle_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('camera_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('plate_number', sa.String(length=50), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('country', sa.String(length=50), nullable=True),
        sa.Column('state', sa.String(length=50), nullable=True),
        sa.Column('raw_text', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['camera_id'], ['cameras.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['vehicle_id'], ['vehicles.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )

    # Persons
    op.create_table(
        'persons',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('camera_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('track_id', sa.String(length=100), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('embedding_reference', sa.String(length=255), nullable=True),
        sa.Column('attributes', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['camera_id'], ['cameras.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Tracks
    op.create_table(
        'tracks',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('entity_type', sa.String(length=50), nullable=False),
        sa.Column('entity_reference', sa.String(length=100), nullable=False),
        sa.Column('camera_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('ended_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('trajectory', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['camera_id'], ['cameras.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Alerts
    op.create_table(
        'alerts',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('severity', sa.String(length=20), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('camera_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.String(length=1000), nullable=True),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('acknowledged_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('acknowledged_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['acknowledged_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['camera_id'], ['cameras.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )

    # Watchlists
    op.create_table(
        'watchlists',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('value', sa.String(length=100), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('priority', sa.String(length=20), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Events
    op.create_table(
        'events',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('event_type', sa.String(length=100), nullable=False),
        sa.Column('camera_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('severity', sa.String(length=20), nullable=False),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('detection_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('alert_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['alert_id'], ['alerts.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['camera_id'], ['cameras.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['detection_id'], ['detections.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )

    # Evidence
    op.create_table(
        'evidence',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('event_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('storage_path', sa.String(length=500), nullable=False),
        sa.Column('thumbnail_path', sa.String(length=500), nullable=True),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('checksum', sa.String(length=64), nullable=True),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['event_id'], ['events.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Locations
    op.create_table(
        'locations',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('district', sa.String(length=100), nullable=True),
        sa.Column('state', sa.String(length=100), nullable=True),
        sa.Column('zone', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Audit Logs
    op.create_table(
        'audit_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('action', sa.String(length=100), nullable=False),
        sa.Column('resource_type', sa.String(length=100), nullable=False),
        sa.Column('resource_id', sa.String(length=100), nullable=True),
        sa.Column('ip_address', sa.String(length=50), nullable=True),
        sa.Column('user_agent', sa.String(length=255), nullable=True),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('audit_logs')
    op.drop_table('locations')
    op.drop_table('evidence')
    op.drop_table('events')
    op.drop_table('watchlists')
    op.drop_table('alerts')
    op.drop_table('tracks')
    op.drop_table('persons')
    op.drop_table('license_plates')
    op.drop_table('vehicles')
    op.drop_table('detections')
    op.drop_table('streams')
    op.drop_table('cameras')
    op.drop_table('users')
    op.drop_table('roles')
