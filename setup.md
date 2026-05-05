# Setup Guide

## 1. Python environment

```bash
conda create -n photowalk python=3.10 -y
conda activate photowalk
pip install -r requirements.txt
```

## 2. Install Nerfstudio (with Splatfacto + COLMAP)

Follow the official docs: https://docs.nerf.studio/quickstart/installation.html

Quick path for CUDA 11.8:
```bash
pip install torch==2.1.2+cu118 torchvision==0.16.2+cu118 --extra-index-url https://download.pytorch.org/whl/cu118
conda install -c "nvidia/label/cuda-11.8.0" cuda-toolkit -y
pip install nerfstudio
```

Verify:
```bash
ns-train --help
ns-process-data --help
```

COLMAP is bundled with Nerfstudio. If not, install separately:
```bash
conda install -c conda-forge colmap -y
```

## 3. Web landing page

```bash
cd web
npm install
npm run dev    # development server at http://localhost:5173
npm run build  # production build in web/dist/
```

## 4. GPU

- Minimum: 8 GB VRAM (RTX 3070 or equivalent)
- Recommended: 12+ GB VRAM
- No GPU? Use Google Colab with a T4 GPU (free tier)

## 5. iPhone HEIC images

iPhone saves in HEIC by default. Either:
- Change in Settings → Camera → Formats → Most Compatible (saves as JPEG)
- Or convert with: `pip install pillow-heif` (preprocess_images.py handles this if installed)
