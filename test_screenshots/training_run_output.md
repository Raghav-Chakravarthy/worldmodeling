
# **inria_3dgs**

```
\n$ python train.py -s '/content/drive/MyDrive/worldmodeling/scenes/gerrard-hall_undistorted' -m '/content/drive/MyDrive/worldmodeling/sota_runs/inria_3dgs/gerrard-hall' --iterations 10000 --eval
------------LLFF HOLD------------- [16/05 21:33:16]

Reading camera 1/100
Reading camera 2/100
Reading camera 3/100
Reading camera 4/100
Reading camera 5/100
Reading camera 6/100
Reading camera 7/100
Reading camera 8/100
Reading camera 9/100
Reading camera 10/100
Reading camera 11/100
Reading camera 12/100
Reading camera 13/100
Reading camera 14/100
Reading camera 15/100
Reading camera 16/100
Reading camera 17/100
Reading camera 18/100
Reading camera 19/100
Reading camera 20/100
Reading camera 21/100
Reading camera 22/100
Reading camera 23/100
Reading camera 24/100
Reading camera 25/100
Reading camera 26/100
Reading camera 27/100
Reading camera 28/100
Reading camera 29/100
Reading camera 30/100
Reading camera 31/100
Reading camera 32/100
Reading camera 33/100
Reading camera 34/100
Reading camera 35/100
Reading camera 36/100
Reading camera 37/100
Reading camera 38/100
Reading camera 39/100
Reading camera 40/100
Reading camera 41/100
Reading camera 42/100
Reading camera 43/100
Reading camera 44/100
Reading camera 45/100
Reading camera 46/100
Reading camera 47/100
Reading camera 48/100
Reading camera 49/100
Reading camera 50/100
Reading camera 51/100
Reading camera 52/100
Reading camera 53/100
Reading camera 54/100
Reading camera 55/100
Reading camera 56/100
Reading camera 57/100
Reading camera 58/100
Reading camera 59/100
Reading camera 60/100
Reading camera 61/100
Reading camera 62/100
Reading camera 63/100
Reading camera 64/100
Reading camera 65/100
Reading camera 66/100
Reading camera 67/100
Reading camera 68/100
Reading camera 69/100
Reading camera 70/100
Reading camera 71/100
Reading camera 72/100
Reading camera 73/100
Reading camera 74/100
Reading camera 75/100
Reading camera 76/100
Reading camera 77/100
Reading camera 78/100
Reading camera 79/100
Reading camera 80/100
Reading camera 81/100
Reading camera 82/100
Reading camera 83/100
Reading camera 84/100
Reading camera 85/100
Reading camera 86/100
Reading camera 87/100
Reading camera 88/100
Reading camera 89/100
Reading camera 90/100
Reading camera 91/100
Reading camera 92/100
Reading camera 93/100
Reading camera 94/100
Reading camera 95/100
Reading camera 96/100
Reading camera 97/100
Reading camera 98/100
Reading camera 99/100
Reading camera 100/100 [16/05 21:33:16]
Converting point3d.bin to .ply, will happen only the first time you open the scene. [16/05 21:33:16]
Loading Training Cameras [16/05 21:33:17]
[ INFO ] Encountered quite large input images (>1.6K pixels width), rescaling to 1.6K.
 If this is not desired, please explicitly specify '--resolution/-r' as 1 [16/05 21:33:17]
Loading Test Cameras [16/05 21:34:09]
Number of points at initialisation :  43188 [16/05 21:34:16]

[ITER 7000] Evaluating test: L1 0.0721431331565747 PSNR 19.01283674973708 [16/05 21:47:48]

[ITER 7000] Evaluating train: L1 0.04949562102556229 PSNR 20.91423225402832 [16/05 21:48:00]

[ITER 7000] Saving Gaussians [16/05 21:48:00]

[ITER 10000] Saving Gaussians [16/05 21:57:12]

Training complete. [16/05 21:57:20]

7696, Depth Loss=0.0000000]
Training progress:  99%|█████████▊| 9870/10000 [22:25<00:26,  4.99it/s, Loss=0.0998106, Depth Loss=0.0000000]
Training progress:  99%|█████████▉| 9880/10000 [22:25<00:24,  4.91it/s, Loss=0.0998106, Depth Loss=0.0000000]
Training progress:  99%|█████████▉| 9880/10000 [22:27<00:24,  4.91it/s, Loss=0.1024364, Depth Loss=0.0000000]
Training progress:  99%|█████████▉| 9890/10000 [22:27<00:22,  4.98it/s, Loss=0.1024364, Depth Loss=0.0000000]
Training progress:  99%|█████████▉| 9890/10000 [22:29<00:22,  4.98it/s, Loss=0.0931878, Depth Loss=0.0000000]
Training progress:  99%|█████████▉| 9900/10000 [22:29<00:20,  4.84it/s, Loss=0.0931878, Depth Loss=0.0000000]
Training progress:  99%|█████████▉| 9900/10000 [22:31<00:20,  4.84it/s, Loss=0.0908117, Depth Loss=0.0000000]
Training progress:  99%|█████████▉| 9910/10000 [22:31<00:18,  4.79it/s, Loss=0.0908117, Depth Loss=0.0000000]
Training progress:  99%|█████████▉| 9910/10000 [22:33<00:18,  4.79it/s, Loss=0.0829791, Depth Loss=0.0000000]
Training progress:  99%|█████████▉| 9920/10000 [22:33<00:16,  4.77it/s, Loss=0.0829791, Depth Loss=0.0000000]
Training progress:  99%|█████████▉| 9920/10000 [22:35<00:16,  4.77it/s, Loss=0.0881838, Depth Loss=0.0000000]
Training progress:  99%|█████████▉| 9930/10000 [22:35<00:14,  4.82it/s, Loss=0.0881838, Depth Loss=0.0000000]
Training progress:  99%|█████████▉| 9930/10000 [22:37<00:14,  4.82it/s, Loss=0.1003458, Depth Loss=0.0000000]
Training progress:  99%|█████████▉| 9940/10000 [22:37<00:12,  4.84it/s, Loss=0.1003458, Depth Loss=0.0000000]
Training progress:  99%|█████████▉| 9940/10000 [22:39<00:12,  4.84it/s, Loss=0.0722835, Depth Loss=0.0000000]
Training progress: 100%|█████████▉| 9950/10000 [22:39<00:10,  4.81it/s, Loss=0.0722835, Depth Loss=0.0000000]
Training progress: 100%|█████████▉| 9950/10000 [22:41<00:10,  4.81it/s, Loss=0.1045501, Depth Loss=0.0000000]
Training progress: 100%|█████████▉| 9960/10000 [22:41<00:08,  4.82it/s, Loss=0.1045501, Depth Loss=0.0000000]
Training progress: 100%|█████████▉| 9960/10000 [22:43<00:08,  4.82it/s, Loss=0.1243926, Depth Loss=0.0000000]
Training progress: 100%|█████████▉| 9970/10000 [22:43<00:06,  4.85it/s, Loss=0.1243926, Depth Loss=0.0000000]
Training progress: 100%|█████████▉| 9970/10000 [22:45<00:06,  4.85it/s, Loss=0.1021856, Depth Loss=0.0000000]
Training progress: 100%|█████████▉| 9980/10000 [22:45<00:04,  4.89it/s, Loss=0.1021856, Depth Loss=0.0000000]
Training progress: 100%|█████████▉| 9980/10000 [22:47<00:04,  4.89it/s, Loss=0.1005381, Depth Loss=0.0000000]
Training progress: 100%|█████████▉| 9990/10000 [22:47<00:02,  4.84it/s, Loss=0.1005381, Depth Loss=0.0000000]
Training progress: 100%|█████████▉| 9990/10000 [22:49<00:02,  4.84it/s, Loss=0.0998685, Depth Loss=0.0000000]
Training progress: 100%|██████████| 10000/10000 [22:49<00:00,  4.89it/s, Loss=0.0998685, Depth Loss=0.0000000]
Training progress: 100%|██████████| 10000/10000 [22:49<00:00,  7.30it/s, Loss=0.0998685, Depth Loss=0.0000000]

Training time: 24.26 minutes
Peak GPU memory: 8.94 GB
```


```
\n$ python render.py -m '/content/drive/MyDrive/worldmodeling/sota_runs/inria_3dgs/gerrard-hall' --iteration 10000 --skip_train
Looking for config file in /content/drive/MyDrive/worldmodeling/sota_runs/inria_3dgs/gerrard-hall/cfg_args
Config file found: /content/drive/MyDrive/worldmodeling/sota_runs/inria_3dgs/gerrard-hall/cfg_args
Rendering /content/drive/MyDrive/worldmodeling/sota_runs/inria_3dgs/gerrard-hall
Loading trained model at iteration 10000 [16/05 21:59:34]
------------LLFF HOLD------------- [16/05 21:59:35]

Reading camera 1/100
Reading camera 2/100
Reading camera 3/100
Reading camera 4/100
Reading camera 5/100
Reading camera 6/100
Reading camera 7/100
Reading camera 8/100
Reading camera 9/100
Reading camera 10/100
Reading camera 11/100
Reading camera 12/100
Reading camera 13/100
Reading camera 14/100
Reading camera 15/100
Reading camera 16/100
Reading camera 17/100
Reading camera 18/100
Reading camera 19/100
Reading camera 20/100
Reading camera 21/100
Reading camera 22/100
Reading camera 23/100
Reading camera 24/100
Reading camera 25/100
Reading camera 26/100
Reading camera 27/100
Reading camera 28/100
Reading camera 29/100
Reading camera 30/100
Reading camera 31/100
Reading camera 32/100
Reading camera 33/100
Reading camera 34/100
Reading camera 35/100
Reading camera 36/100
Reading camera 37/100
Reading camera 38/100
Reading camera 39/100
Reading camera 40/100
Reading camera 41/100
Reading camera 42/100
Reading camera 43/100
Reading camera 44/100
Reading camera 45/100
Reading camera 46/100
Reading camera 47/100
Reading camera 48/100
Reading camera 49/100
Reading camera 50/100
Reading camera 51/100
Reading camera 52/100
Reading camera 53/100
Reading camera 54/100
Reading camera 55/100
Reading camera 56/100
Reading camera 57/100
Reading camera 58/100
Reading camera 59/100
Reading camera 60/100
Reading camera 61/100
Reading camera 62/100
Reading camera 63/100
Reading camera 64/100
Reading camera 65/100
Reading camera 66/100
Reading camera 67/100
Reading camera 68/100
Reading camera 69/100
Reading camera 70/100
Reading camera 71/100
Reading camera 72/100
Reading camera 73/100
Reading camera 74/100
Reading camera 75/100
Reading camera 76/100
Reading camera 77/100
Reading camera 78/100
Reading camera 79/100
Reading camera 80/100
Reading camera 81/100
Reading camera 82/100
Reading camera 83/100
Reading camera 84/100
Reading camera 85/100
Reading camera 86/100
Reading camera 87/100
Reading camera 88/100
Reading camera 89/100
Reading camera 90/100
Reading camera 91/100
Reading camera 92/100
Reading camera 93/100
Reading camera 94/100
Reading camera 95/100
Reading camera 96/100
Reading camera 97/100
Reading camera 98/100
Reading camera 99/100
Reading camera 100/100 [16/05 21:59:35]
Loading Training Cameras [16/05 21:59:35]
[ INFO ] Encountered quite large input images (>1.6K pixels width), rescaling to 1.6K.
 If this is not desired, please explicitly specify '--resolution/-r' as 1 [16/05 21:59:35]
Loading Test Cameras [16/05 22:00:25]


Rendering progress:   0%|          | 0/13 [00:00<?, ?it/s]
Rendering progress:   8%|▊         | 1/13 [00:02<00:25,  2.14s/it]
Rendering progress:  15%|█▌        | 2/13 [00:03<00:19,  1.78s/it]
Rendering progress:  23%|██▎       | 3/13 [00:05<00:16,  1.65s/it]
Rendering progress:  31%|███       | 4/13 [00:06<00:14,  1.60s/it]
Rendering progress:  38%|███▊      | 5/13 [00:08<00:12,  1.56s/it]
Rendering progress:  46%|████▌     | 6/13 [00:09<00:10,  1.54s/it]
Rendering progress:  54%|█████▍    | 7/13 [00:11<00:09,  1.50s/it]
Rendering progress:  62%|██████▏   | 8/13 [00:12<00:07,  1.48s/it]
Rendering progress:  69%|██████▉   | 9/13 [00:14<00:06,  1.53s/it]
Rendering progress:  77%|███████▋  | 10/13 [00:15<00:04,  1.55s/it]
Rendering progress:  85%|████████▍ | 11/13 [00:17<00:03,  1.58s/it]
Rendering progress:  92%|█████████▏| 12/13 [00:18<00:01,  1.45s/it]
Rendering progress: 100%|██████████| 13/13 [00:19<00:00,  1.41s/it]
Rendering progress: 100%|██████████| 13/13 [00:19<00:00,  1.53s/it]

\n$ python metrics.py -m '/content/drive/MyDrive/worldmodeling/sota_runs/inria_3dgs/gerrard-hall'

Scene: /content/drive/MyDrive/worldmodeling/sota_runs/inria_3dgs/gerrard-hall
Method: ours_10000
Downloading: "https://download.pytorch.org/models/vgg16-397923af.pth" to /root/.cache/torch/hub/checkpoints/vgg16-397923af.pth
Downloading: "https://raw.githubusercontent.com/richzhang/PerceptualSimilarity/master/lpips/weights/v0.1/vgg.pth" to /root/.cache/torch/hub/checkpoints/vgg.pth
  SSIM :    0.6825939
  PSNR :   19.3773518
  LPIPS:    0.3812913




  7%|▋         | 36.0M/528M [00:00<00:03, 129MB/s]

  9%|▉         | 48.6M/528M [00:00<00:03, 130MB/s]

 12%|█▏        | 61.5M/528M [00:00<00:03, 132MB/s]

 14%|█▍        | 74.1M/528M [00:00<00:03, 129MB/s]

 17%|█▋        | 88.0M/528M [00:00<00:03, 134MB/s]

 19%|█▉        | 101M/528M [00:00<00:03, 124MB/s] 

 21%|██▏       | 113M/528M [00:00<00:03, 125MB/s]

 24%|██▍       | 126M/528M [00:01<00:03, 128MB/s]

 26%|██▌       | 138M/528M [00:01<00:03, 127MB/s]

 29%|██▊       | 150M/528M [00:01<00:03, 121MB/s]

 31%|███       | 162M/528M [00:01<00:03, 113MB/s]

 33%|███▎      | 175M/528M [00:01<00:03, 118MB/s]

 35%|███▌      | 186M/528M [00:01<00:03, 111MB/s]

 38%|███▊      | 199M/528M [00:01<00:02, 116MB/s]

 40%|████      | 213M/528M [00:01<00:02, 124MB/s]

 43%|████▎     | 226M/528M [00:01<00:02, 128MB/s]

 45%|████▌     | 239M/528M [00:02<00:02, 131MB/s]

 48%|████▊     | 252M/528M [00:02<00:02, 126MB/s]

 51%|█████     | 268M/528M [00:02<00:01, 138MB/s]

 54%|█████▍    | 287M/528M [00:02<00:01, 156MB/s]

 57%|█████▋    | 303M/528M [00:02<00:01, 160MB/s]

 60%|██████    | 319M/528M [00:02<00:01, 162MB/s]

 63%|██████▎   | 335M/528M [00:02<00:01, 162MB/s]

 67%|██████▋   | 355M/528M [00:02<00:01, 176MB/s]

 71%|███████   | 374M/528M [00:02<00:00, 182MB/s]

 75%|███████▍  | 394M/528M [00:02<00:00, 193MB/s]

 78%|███████▊  | 413M/528M [00:03<00:00, 185MB/s]

 82%|████████▏ | 433M/528M [00:03<00:00, 191MB/s]

 86%|████████▌ | 452M/528M [00:03<00:00, 194MB/s]

 90%|████████▉ | 473M/528M [00:03<00:00, 201MB/s]

 93%|█████████▎| 492M/528M [00:03<00:00, 197MB/s]

 97%|█████████▋| 511M/528M [00:07<00:01, 15.4MB/s]

 99%|█████████▉| 524M/528M [00:07<00:00, 18.7MB/s]
100%|██████████| 528M/528M [00:07<00:00, 70.7MB/s]


  0%|          | 0.00/7.12k [00:00<?, ?B/s]
100%|██████████| 7.12k/7.12k [00:00<00:00, 24.4MB/s]

Metric evaluation progress:   8%|▊         | 1/13 [00:11<02:15, 11.29s/it]
Metric evaluation progress:  15%|█▌        | 2/13 [00:12<00:59,  5.44s/it]
Metric evaluation progress:  23%|██▎       | 3/13 [00:14<00:38,  3.83s/it]
Metric evaluation progress:  31%|███       | 4/13 [00:17<00:29,  3.30s/it]
Metric evaluation progress:  38%|███▊      | 5/13 [00:19<00:22,  2.83s/it]
Metric evaluation progress:  46%|████▌     | 6/13 [00:20<00:17,  2.46s/it]
Metric evaluation progress:  54%|█████▍    | 7/13 [00:22<00:13,  2.22s/it]
Metric evaluation progress:  62%|██████▏   | 8/13 [00:24<00:10,  2.07s/it]
Metric evaluation progress:  69%|██████▉   | 9/13 [00:25<00:07,  1.97s/it]
Metric evaluation progress:  77%|███████▋  | 10/13 [00:27<00:05,  1.89s/it]
Metric evaluation progress:  85%|████████▍ | 11/13 [00:30<00:04,  2.07s/it]
Metric evaluation progress:  92%|█████████▏| 12/13 [00:32<00:02,  2.18s/it]
Metric evaluation progress: 100%|██████████| 13/13 [00:34<00:00,  2.07s/it]
Metric evaluation progress: 100%|██████████| 13/13 [00:34<00:00,  2.65s/it]

Parsed metrics from console: {'PSNR': 19.0, 'SSIM': 0.0, 'LPIPS': 0.0}
```

```
Saved JSON: /content/drive/MyDrive/worldmodeling/sota_runs/metrics/inria_3dgs_gerrard-hall_10k.json
Appended CSV: /content/drive/MyDrive/worldmodeling/sota_runs/metrics/sota_metrics_10k.csv
{
  "model": "Inria_3DGS",
  "scene": "gerrard-hall",
  "iterations": 10000,
  "PSNR": 19.0,
  "SSIM": 0.0,
  "LPIPS": 0.0,
  "training_time_sec": 1455.425,
  "training_time_min": 24.257,
  "peak_gpu_gb": 8.938,
  "num_gaussians": 578669,
  "ply_file_size_mb": 143.511,
  "ply_path": "/content/drive/MyDrive/worldmodeling/sota_runs/inria_3dgs/gerrard-hall/point_cloud/iteration_10000/point_cloud.ply",
  "raw_metrics_file": {
    "ours_10000": {
      "SSIM": 0.6825939416885376,
      "PSNR": 19.377351760864258,
      "LPIPS": 0.38129132986068726
    }
  }
}

```



# **MIP_SPLATTING**




```
Saved: /content/drive/MyDrive/worldmodeling/sota_runs/metrics/mip_splatting_gerrard-hall_10k.json
Updated: /content/drive/MyDrive/worldmodeling/sota_runs/metrics/sota_metrics_10k.csv
{
  "model": "Mip_Splatting",
  "scene": "gerrard-hall",
  "iterations": 10000,
  "PSNR": null,
  "SSIM": null,
  "LPIPS": null,
  "training_time_sec": 587.954,
  "training_time_min": 9.799,
  "peak_gpu_gb": 16.753,
  "num_gaussians": 699425,
  "ply_file_size_mb": 176.257,
  "ply_path": "/content/drive/MyDrive/worldmodeling/sota_runs/mip_splatting/gerrard-hall_p5k_clean/point_cloud/iteration_10000/point_cloud.ply",
  "raw_metrics_file": {}
}
```

```
Loaded: /content/drive/MyDrive/worldmodeling/sota_runs/mip_splatting/gerrard-hall_p5k_clean/results.json
{'ours_10000': {'SSIM': 0.6794509291648865, 'PSNR': 19.39582061767578, 'LPIPS': 0.3846774697303772}}
```

```
/content/worldmodeling_mip/mip-splatting
Looking for config file in /content/drive/MyDrive/worldmodeling/sota_runs/mip_splatting/gerrard-hall_p5k_clean/cfg_args
Config file found: /content/drive/MyDrive/worldmodeling/sota_runs/mip_splatting/gerrard-hall_p5k_clean/cfg_args
Rendering /content/drive/MyDrive/worldmodeling/sota_runs/mip_splatting/gerrard-hall_p5k_clean
Loading trained model at iteration 10000 [17/05 00:59:06]
Reading camera 100/100 [17/05 00:59:41]
Loading Training Cameras [17/05 00:59:41]
[ INFO ] Encountered quite large input images (>1.6K pixels width), rescaling to 1.6K.
 If this is not desired, please explicitly specify '--resolution/-r' as 1 [17/05 00:59:41]
Loading Test Cameras [17/05 01:00:01]
Rendering progress: 100% 13/13 [00:18<00:00,  1.39s/it]
Setting up [LPIPS] perceptual loss: trunk [vgg], v[0.1], spatial [off]
/usr/local/lib/python3.12/dist-packages/torchvision/models/_utils.py:208: UserWarning: The parameter 'pretrained' is deprecated since 0.13 and may be removed in the future, please use 'weights' instead.
  warnings.warn(
/usr/local/lib/python3.12/dist-packages/torchvision/models/_utils.py:223: UserWarning: Arguments other than a weight enum or `None` for 'weights' are deprecated since 0.13 and may be removed in the future. The current behavior is equivalent to passing `weights=VGG16_Weights.IMAGENET1K_V1`. You can also use `weights=VGG16_Weights.DEFAULT` to get the most up-to-date weights.
  warnings.warn(msg)
Loading model from: /usr/local/lib/python3.12/dist-packages/lpips/weights/v0.1/vgg.pth

Scene: /content/drive/MyDrive/worldmodeling/sota_runs/mip_splatting/gerrard-hall_p5k_clean
Method: ours_10000
Metric evaluation progress: 100% 13/13 [00:00<00:00, 14.37it/s]
  SSIM :    0.6794509
  PSNR :   19.3958206
  LPIPS:    0.3846775

```
