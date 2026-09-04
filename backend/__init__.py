import os
import sys

# Automatically register backend folder path in sys.path to eliminate import errors
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
