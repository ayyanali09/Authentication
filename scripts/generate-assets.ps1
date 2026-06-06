$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot "..\apps\web\public\images"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function New-RoundRectPath {
  param(
    [float]$X,
    [float]$Y,
    [float]$W,
    [float]$H,
    [float]$R
  )

  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $d = $R * 2
  $path.AddArc($X, $Y, $d, $d, 180, 90)
  $path.AddArc($X + $W - $d, $Y, $d, $d, 270, 90)
  $path.AddArc($X + $W - $d, $Y + $H - $d, $d, $d, 0, 90)
  $path.AddArc($X, $Y + $H - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function Save-Bitmap {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [string]$Name
  )

  $path = Join-Path $outDir $Name
  $Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $Bitmap.Dispose()
}

function New-AgencyVisual {
  param(
    [string]$Name,
    [int]$Width,
    [int]$Height,
    [System.Drawing.Color]$Accent,
    [System.Drawing.Color]$AccentTwo,
    [int]$Seed
  )

  $random = [Random]::new($Seed)
  $bitmap = [System.Drawing.Bitmap]::new($Width, $Height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  $rect = [System.Drawing.Rectangle]::new(0, 0, $Width, $Height)
  $background = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $rect,
    [System.Drawing.Color]::FromArgb(255, 6, 7, 9),
    [System.Drawing.Color]::FromArgb(255, 15, 39, 71),
    35
  )
  $graphics.FillRectangle($background, $rect)

  $wash = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $rect,
    [System.Drawing.Color]::FromArgb(90, $Accent.R, $Accent.G, $Accent.B),
    [System.Drawing.Color]::FromArgb(70, $AccentTwo.R, $AccentTwo.G, $AccentTwo.B),
    130
  )
  $graphics.FillRectangle($wash, $rect)

  $gridPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(28, 245, 245, 245), 1)
  for ($x = 0; $x -lt $Width; $x += 56) {
    $graphics.DrawLine($gridPen, $x, 0, $x, $Height)
  }
  for ($y = 0; $y -lt $Height; $y += 56) {
    $graphics.DrawLine($gridPen, 0, $y, $Width, $y)
  }

  for ($i = 0; $i -lt 14; $i++) {
    $x = $random.Next(80, [Math]::Max(120, $Width - 240))
    $y = $random.Next(80, [Math]::Max(120, $Height - 180))
    $w = $random.Next(150, 320)
    $h = $random.Next(56, 130)
    $path = New-RoundRectPath $x $y $w $h 12
    $fill = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(34, 255, 255, 255))
    $stroke = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(64, $Accent.R, $Accent.G, $Accent.B), 2)
    $graphics.FillPath($fill, $path)
    $graphics.DrawPath($stroke, $path)
    $fill.Dispose()
    $stroke.Dispose()
    $path.Dispose()
  }

  for ($i = 0; $i -lt 18; $i++) {
    $penColor = if ($i % 3 -eq 0) { $AccentTwo } else { $Accent }
    $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(145, $penColor.R, $penColor.G, $penColor.B), $random.Next(2, 5))
    $x1 = $random.Next(-80, $Width)
    $y1 = $random.Next(0, $Height)
    $x2 = $x1 + $random.Next(160, 520)
    $y2 = $y1 + $random.Next(-160, 160)
    $graphics.DrawLine($pen, $x1, $y1, $x2, $y2)
    $pen.Dispose()
  }

  $yellowPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(210, 255, 212, 0), 4)
  $graphics.DrawLine($yellowPen, $Width * 0.12, $Height * 0.78, $Width * 0.48, $Height * 0.78)
  $graphics.DrawLine($yellowPen, $Width * 0.67, $Height * 0.18, $Width * 0.88, $Height * 0.18)

  $graphics.Dispose()
  $background.Dispose()
  $wash.Dispose()
  $gridPen.Dispose()
  $yellowPen.Dispose()
  Save-Bitmap $bitmap $Name
}

function New-TeamPortrait {
  param(
    [string]$Name,
    [System.Drawing.Color]$Accent,
    [System.Drawing.Color]$AccentTwo,
    [int]$Seed
  )

  $width = 720
  $height = 900
  $random = [Random]::new($Seed)
  $bitmap = [System.Drawing.Bitmap]::new($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  $rect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
  $background = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $rect,
    [System.Drawing.Color]::FromArgb(255, 7, 7, 8),
    [System.Drawing.Color]::FromArgb(255, 15, 39, 71),
    55
  )
  $graphics.FillRectangle($background, $rect)

  $linePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(90, $Accent.R, $Accent.G, $Accent.B), 3)
  for ($i = 0; $i -lt 12; $i++) {
    $x = $random.Next(-80, $width)
    $graphics.DrawLine($linePen, $x, 0, $x + $random.Next(80, 260), $height)
  }

  $skin = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 206, 210, 220))
  $shadow = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 24, 29, 38))
  $jacket = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, $Accent.R / 3, $Accent.G / 3, $Accent.B / 3))
  $glowPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(180, $AccentTwo.R, $AccentTwo.G, $AccentTwo.B), 5)

  $graphics.FillEllipse($shadow, 235, 174, 250, 260)
  $graphics.FillEllipse($skin, 250, 150, 220, 238)
  $graphics.DrawEllipse($glowPen, 246, 146, 228, 246)

  $body = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $body.AddBezier(132, 820, 170, 548, 268, 470, 360, 470)
  $body.AddBezier(452, 470, 550, 548, 588, 820, 588, 820)
  $body.CloseFigure()
  $graphics.FillPath($jacket, $body)

  $panel = New-RoundRectPath 196 650 328 74 16
  $panelFill = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(50, 255, 255, 255))
  $panelStroke = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(130, 255, 212, 0), 3)
  $graphics.FillPath($panelFill, $panel)
  $graphics.DrawPath($panelStroke, $panel)

  $graphics.Dispose()
  $background.Dispose()
  $linePen.Dispose()
  $skin.Dispose()
  $shadow.Dispose()
  $jacket.Dispose()
  $glowPen.Dispose()
  $body.Dispose()
  $panel.Dispose()
  $panelFill.Dispose()
  $panelStroke.Dispose()
  Save-Bitmap $bitmap $Name
}

$blue = [System.Drawing.Color]::FromArgb(255, 30, 144, 255)
$purple = [System.Drawing.Color]::FromArgb(255, 124, 58, 237)
$yellow = [System.Drawing.Color]::FromArgb(255, 255, 212, 0)

New-AgencyVisual "hero-command-center.png" 1600 900 $blue $purple 101
New-AgencyVisual "project-neon-retail.png" 1200 750 $yellow $blue 202
New-AgencyVisual "project-content-studio.png" 1200 750 $purple $blue 303
New-AgencyVisual "project-launch-system.png" 1200 750 $blue $yellow 404
New-AgencyVisual "blog-growth-systems.png" 1200 750 $blue $purple 505

New-TeamPortrait "team-maya.png" $purple $yellow 11
New-TeamPortrait "team-noah.png" $blue $yellow 22
New-TeamPortrait "team-amara.png" $yellow $purple 33
New-TeamPortrait "team-julian.png" $blue $purple 44

Write-Host "Generated image assets in $outDir"
