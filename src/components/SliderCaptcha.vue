<template>
  <div class="slider-captcha">
    <div class="captcha-container">
      <canvas 
        ref="puzzleCanvas" 
        class="puzzle-canvas"
        :width="canvasWidth" 
        :height="canvasHeight"
      ></canvas>
      <canvas 
        ref="blockCanvas" 
        class="block-canvas"
        :width="blockSize" 
        :height="canvasHeight"
        :style="{ left: blockX + 'px' }"
      ></canvas>
      <div class="loading-overlay" v-if="loading">
        <div class="loading-spinner"></div>
      </div>
    </div>
    
    <div class="slider-track">
      <div class="slider-bg">
        <div 
          class="slider-fill" 
          :style="{ width: sliderWidth + 'px' }"
        ></div>
      </div>
      <div 
        class="slider-handle" 
        :class="{ 'dragging': isDragging, 'success': isSuccess }"
        :style="{ left: sliderWidth + 'px' }"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <svg v-if="!isSuccess" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div class="slider-text">
        <span v-if="!isSuccess">{{ sliderText }}</span>
        <span v-else class="success-text">验证成功</span>
      </div>
    </div>
    
    <div class="refresh-container">
      <button 
        type="button" 
        class="refresh-captcha-btn" 
        @click="refreshCaptcha"
        :disabled="loading"
        title="刷新验证码"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const emit = defineEmits(['success', 'fail'])

// Canvas 相关
const puzzleCanvas = ref()
const blockCanvas = ref()
const canvasWidth = 320
const canvasHeight = 160
const blockSize = 50
const blockRadius = 8
const tolerance = 10

// 滑块相关
const sliderWidth = ref(0)
const isDragging = ref(false)
const isSuccess = ref(false)
const loading = ref(false)
const sliderText = ref('向右拖动滑块完成验证')

// 拼图相关
const blockX = ref(0)
const blockY = ref(0)
const correctX = ref(0)
const puzzleShape = ref(0) // 记录当前拼图形状类型
const shapeParams = ref({}) // 记录形状参数

// 生成随机背景图案
const generateBackground = (ctx, width, height) => {
  // 增加更复杂的背景类型
  const backgroundTypes = ['gradient', 'geometric', 'dots', 'stripes', 'maze', 'circuit', 'hexagon', 'waves', 'noise', 'fractal']
  const bgType = backgroundTypes[Math.floor(Math.random() * backgroundTypes.length)]
  
  // 更多颜色主题，包括对比度更高的组合
  const colorThemes = [
    ['#667eea', '#764ba2'], // 紫蓝渐变
    ['#f093fb', '#f5576c'], // 粉红渐变
    ['#4facfe', '#00f2fe'], // 蓝色渐变
    ['#43e97b', '#38f9d7'], // 绿色渐变
    ['#fa709a', '#fee140'], // 橙粉渐变
    ['#a8edea', '#fed6e3'], // 浅色渐变
    ['#ff9a9e', '#fecfef'], // 温和粉色
    ['#96deda', '#50c9c3'], // 青绿渐变
    ['#2c3e50', '#3498db'], // 深蓝对比
    ['#e74c3c', '#f39c12'], // 红橙对比
    ['#9b59b6', '#8e44ad'], // 紫色系
    ['#1abc9c', '#16a085'], // 青色系
    ['#34495e', '#2c3e50'], // 深灰系
    ['#f39c12', '#d35400'], // 橙色系
    ['#27ae60', '#229954'], // 绿色系
    ['#8e44ad', '#9b59b6']  // 紫色系
  ]
  const theme = colorThemes[Math.floor(Math.random() * colorThemes.length)]
  
  switch (bgType) {
    case 'gradient':
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, theme[0])
      gradient.addColorStop(1, theme[1])
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      break
      
    case 'geometric':
      // 基础渐变
      const geoGradient = ctx.createLinearGradient(0, 0, width, height)
      geoGradient.addColorStop(0, theme[0])
      geoGradient.addColorStop(1, theme[1])
      ctx.fillStyle = geoGradient
      ctx.fillRect(0, 0, width, height)
      
      // 添加几何图形
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = Math.random() * 40 + 20
        const shape = Math.floor(Math.random() * 3)
        
        if (shape === 0) {
          // 矩形
          ctx.fillRect(x, y, size, size * 0.6)
        } else if (shape === 1) {
          // 圆形
          ctx.beginPath()
          ctx.arc(x, y, size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // 三角形
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + size, y + size)
          ctx.lineTo(x - size / 2, y + size)
          ctx.closePath()
          ctx.fill()
        }
      }
      break
      
    case 'dots':
      // 基础背景
      ctx.fillStyle = theme[0]
      ctx.fillRect(0, 0, width, height)
      
      // 点状图案
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const radius = Math.random() * 8 + 2
        const opacity = Math.random() * 0.4 + 0.1
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
      break
      
    case 'stripes':
      // 基础背景
      ctx.fillStyle = theme[0]
      ctx.fillRect(0, 0, width, height)
      
      // 条纹图案
      ctx.fillStyle = theme[1]
      const stripeWidth = Math.random() * 20 + 10
      for (let x = 0; x < width + height; x += stripeWidth * 2) {
        ctx.save()
        ctx.translate(width / 2, height / 2)
        ctx.rotate(Math.PI / 4)
        ctx.fillRect(x - width, -height, stripeWidth, height * 2)
        ctx.restore()
      }
      break
      
    case 'maze':
      // 迷宫样式背景
      ctx.fillStyle = theme[0]
      ctx.fillRect(0, 0, width, height)
      
      ctx.fillStyle = theme[1]
      const cellSize = 15 + Math.random() * 10
      for (let x = 0; x < width; x += cellSize) {
        for (let y = 0; y < height; y += cellSize) {
          if (Math.random() > 0.6) {
            const mazeType = Math.floor(Math.random() * 4)
            switch (mazeType) {
              case 0: // 水平线
                ctx.fillRect(x, y + cellSize/2, cellSize, 2)
                break
              case 1: // 垂直线
                ctx.fillRect(x + cellSize/2, y, 2, cellSize)
                break
              case 2: // L形
                ctx.fillRect(x, y + cellSize/2, cellSize/2, 2)
                ctx.fillRect(x + cellSize/2, y + cellSize/2, 2, cellSize/2)
                break
              case 3: // T形
                ctx.fillRect(x, y + cellSize/2, cellSize, 2)
                ctx.fillRect(x + cellSize/2, y, 2, cellSize/2)
                break
            }
          }
        }
      }
      break
      
    case 'circuit':
      // 电路板样式
      ctx.fillStyle = theme[0]
      ctx.fillRect(0, 0, width, height)
      
      ctx.strokeStyle = theme[1]
      ctx.lineWidth = 1.5
      
      // 绘制电路线
      for (let i = 0; i < 25; i++) {
        ctx.beginPath()
        const startX = Math.random() * width
        const startY = Math.random() * height
        ctx.moveTo(startX, startY)
        
        // 创建L形或Z形路径
        const segments = 2 + Math.floor(Math.random() * 3)
        let currentX = startX
        let currentY = startY
        
        for (let j = 0; j < segments; j++) {
          const direction = Math.floor(Math.random() * 4) // 0:右, 1:下, 2:左, 3:上
          const length = 20 + Math.random() * 40
          
          switch (direction) {
            case 0: currentX += length; break
            case 1: currentY += length; break
            case 2: currentX -= length; break
            case 3: currentY -= length; break
          }
          
          ctx.lineTo(Math.max(0, Math.min(width, currentX)), 
                    Math.max(0, Math.min(height, currentY)))
        }
        ctx.stroke()
        
        // 添加连接点
        ctx.fillStyle = theme[1]
        ctx.beginPath()
        ctx.arc(currentX, currentY, 3, 0, Math.PI * 2)
        ctx.fill()
      }
      break
      
    case 'hexagon':
      // 六边形蜂窝样式
      ctx.fillStyle = theme[0]
      ctx.fillRect(0, 0, width, height)
      
      const hexSize = 15 + Math.random() * 8
      const hexHeight = hexSize * Math.sin(Math.PI / 3)
      
      ctx.strokeStyle = theme[1]
      ctx.lineWidth = 1
      
      for (let row = 0; row < height / hexHeight + 2; row++) {
        for (let col = 0; col < width / (hexSize * 1.5) + 2; col++) {
          const x = col * hexSize * 1.5
          const y = row * hexHeight + (col % 2) * hexHeight / 2
          
          if (Math.random() > 0.3) {
            ctx.beginPath()
            for (let i = 0; i < 6; i++) {
              const angle = i * Math.PI / 3
              const hx = x + hexSize * Math.cos(angle)
              const hy = y + hexSize * Math.sin(angle)
              if (i === 0) ctx.moveTo(hx, hy)
              else ctx.lineTo(hx, hy)
            }
            ctx.closePath()
            
            if (Math.random() > 0.7) {
              ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`
              ctx.fill()
            }
            ctx.stroke()
          }
        }
      }
      break
      
    case 'waves':
      // 波浪干扰背景
      const waveGradient = ctx.createLinearGradient(0, 0, width, height)
      waveGradient.addColorStop(0, theme[0])
      waveGradient.addColorStop(1, theme[1])
      ctx.fillStyle = waveGradient
      ctx.fillRect(0, 0, width, height)
      
      // 添加多层波浪
      for (let layer = 0; layer < 5; layer++) {
        ctx.beginPath()
        const amplitude = 20 + Math.random() * 30
        const frequency = 0.02 + Math.random() * 0.03
        const phase = Math.random() * Math.PI * 2
        const yOffset = Math.random() * height
        
        ctx.moveTo(0, yOffset + amplitude * Math.sin(phase))
        for (let x = 0; x <= width; x += 2) {
          const y = yOffset + amplitude * Math.sin(x * frequency + phase)
          ctx.lineTo(x, y)
        }
        
        ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.4)`
        ctx.lineWidth = 1 + Math.random() * 2
        ctx.stroke()
      }
      break
      
    case 'noise':
      // 噪点干扰背景
      ctx.fillStyle = theme[0]
      ctx.fillRect(0, 0, width, height)
      
      // 密集噪点
      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 100
        if (Math.random() > 0.8) {
          data[i] = Math.floor(Math.random() * 255)     // R
          data[i + 1] = Math.floor(Math.random() * 255) // G
          data[i + 2] = Math.floor(Math.random() * 255) // B
          data[i + 3] = 100 + Math.random() * 100       // A
        }
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      // 叠加渐变
      const noiseGradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2)
      noiseGradient.addColorStop(0, theme[1] + '80')
      noiseGradient.addColorStop(1, theme[0] + '40')
      ctx.fillStyle = noiseGradient
      ctx.fillRect(0, 0, width, height)
      break
      
    case 'fractal':
      // 分形图案背景
      ctx.fillStyle = theme[0]
      ctx.fillRect(0, 0, width, height)
      
      const drawFractalTree = (x, y, angle, length, depth) => {
        if (depth === 0 || length < 2) return
        
        const x2 = x + length * Math.cos(angle)
        const y2 = y + length * Math.sin(angle)
        
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${0.3 + depth * 0.1})`
        ctx.lineWidth = depth * 0.5
        ctx.stroke()
        
        const branches = 2 + Math.floor(Math.random() * 2)
        for (let i = 0; i < branches; i++) {
          const newAngle = angle + (Math.random() - 0.5) * Math.PI / 2
          const newLength = length * (0.6 + Math.random() * 0.3)
          drawFractalTree(x2, y2, newAngle, newLength, depth - 1)
        }
      }
      
      // 绘制多个分形树
      for (let i = 0; i < 6; i++) {
        const startX = Math.random() * width
        const startY = Math.random() * height
        const startAngle = Math.random() * Math.PI * 2
        const startLength = 20 + Math.random() * 30
        drawFractalTree(startX, startY, startAngle, startLength, 4)
      }
      break
  }
  
  // 增加更多干扰噪点
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * 3 + 1
    const opacity = Math.random() * 0.6 + 0.2
    ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${opacity})`
    ctx.fillRect(x, y, size, size)
  }
  
  // 添加随机线条干扰
  for (let i = 0; i < 8; i++) {
    ctx.beginPath()
    ctx.moveTo(Math.random() * width, Math.random() * height)
    ctx.lineTo(Math.random() * width, Math.random() * height)
    ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.3)`
    ctx.lineWidth = Math.random() * 2 + 0.5
    ctx.stroke()
  }
}

// 创建随机化的拼图形状路径
const createPuzzlePath = (ctx, x, y, size, useStoredShape = false) => {
  let puzzleType, r, bumpSize, bumpPos, indentSize, indentPos
  
  if (useStoredShape && shapeParams.value.puzzleType !== undefined) {
    // 使用存储的参数
    puzzleType = shapeParams.value.puzzleType
    r = shapeParams.value.r
    bumpSize = shapeParams.value.bumpSize
    bumpPos = shapeParams.value.bumpPos
    indentSize = shapeParams.value.indentSize
    indentPos = shapeParams.value.indentPos
  } else {
    // 增加更多拼图类型 - 现在有6种不同的形状
    puzzleType = Math.floor(Math.random() * 6)
    r = blockRadius + Math.random() * 4 - 2
    bumpSize = size * 0.15 + Math.random() * (size * 0.15)
    bumpPos = 0.25 + Math.random() * 0.5
    indentSize = size * 0.1 + Math.random() * (size * 0.15)
    indentPos = 0.25 + Math.random() * 0.5
    
    // 存储参数
    shapeParams.value = {
      puzzleType, r, bumpSize, bumpPos, indentSize, indentPos
    }
    puzzleShape.value = puzzleType
  }
  
  ctx.beginPath()
  
  switch (puzzleType) {
    case 0: // 基础圆角矩形
      ctx.moveTo(x, y + r)
      ctx.arcTo(x, y, x + r, y, r)
      ctx.lineTo(x + size - r, y)
      ctx.arcTo(x + size, y, x + size, y + r, r)
      ctx.lineTo(x + size, y + size - r)
      ctx.arcTo(x + size, y + size, x + size - r, y + size, r)
      ctx.lineTo(x + r, y + size)
      ctx.arcTo(x, y + size, x, y + size - r, r)
      ctx.closePath()
      break
      
    case 1: // 带凸起的拼图块
      ctx.moveTo(x, y + r)
      ctx.arcTo(x, y, x + r, y, r)
      ctx.lineTo(x + size - r, y)
      ctx.arcTo(x + size, y, x + size, y + r, r)
      
      // 右侧凸起
      ctx.lineTo(x + size, y + size * bumpPos - bumpSize)
      ctx.arc(x + size + bumpSize, y + size * bumpPos, bumpSize, Math.PI, 0)
      ctx.lineTo(x + size, y + size * bumpPos + bumpSize)
      
      ctx.lineTo(x + size, y + size - r)
      ctx.arcTo(x + size, y + size, x + size - r, y + size, r)
      ctx.lineTo(x + r, y + size)
      ctx.arcTo(x, y + size, x, y + size - r, r)
      ctx.closePath()
      break
      
    case 2: // 带凹陷的拼图块
      ctx.moveTo(x, y + r)
      ctx.arcTo(x, y, x + r, y, r)
      
      // 顶部凹陷
      ctx.lineTo(x + size * indentPos - indentSize, y)
      ctx.arc(x + size * indentPos, y - indentSize, indentSize, 0, Math.PI)
      ctx.lineTo(x + size * indentPos + indentSize, y)
      
      ctx.lineTo(x + size - r, y)
      ctx.arcTo(x + size, y, x + size, y + r, r)
      ctx.lineTo(x + size, y + size - r)
      ctx.arcTo(x + size, y + size, x + size - r, y + size, r)
      ctx.lineTo(x + r, y + size)
      ctx.arcTo(x, y + size, x, y + size - r, r)
      ctx.closePath()
      break
      
    case 3: // 复杂十字形拼图块
      const crossSize = bumpSize * 0.8
      ctx.moveTo(x, y + r)
      ctx.arcTo(x, y, x + r, y, r)
      
      // 顶部凸起
      ctx.lineTo(x + size * indentPos - crossSize, y)
      ctx.lineTo(x + size * indentPos - crossSize, y - crossSize)
      ctx.lineTo(x + size * indentPos + crossSize, y - crossSize)
      ctx.lineTo(x + size * indentPos + crossSize, y)
      
      ctx.lineTo(x + size - r, y)
      ctx.arcTo(x + size, y, x + size, y + r, r)
      
      // 右侧凸起
      ctx.lineTo(x + size, y + size * bumpPos - crossSize)
      ctx.lineTo(x + size + crossSize, y + size * bumpPos - crossSize)
      ctx.lineTo(x + size + crossSize, y + size * bumpPos + crossSize)
      ctx.lineTo(x + size, y + size * bumpPos + crossSize)
      
      ctx.lineTo(x + size, y + size - r)
      ctx.arcTo(x + size, y + size, x + size - r, y + size, r)
      ctx.lineTo(x + r, y + size)
      ctx.arcTo(x, y + size, x, y + size - r, r)
      ctx.closePath()
      break
      
    case 4: // 锯齿状拼图块
      ctx.moveTo(x, y + r)
      ctx.arcTo(x, y, x + r, y, r)
      
      // 锯齿状顶部
      const toothCount = 3 + Math.floor(Math.random() * 2)
      const toothWidth = (size - 2 * r) / toothCount
      const toothHeight = indentSize
      
      for (let i = 0; i < toothCount; i++) {
        const toothX = x + r + i * toothWidth
        ctx.lineTo(toothX, y)
        ctx.lineTo(toothX + toothWidth * 0.3, y - toothHeight)
        ctx.lineTo(toothX + toothWidth * 0.7, y - toothHeight)
        ctx.lineTo(toothX + toothWidth, y)
      }
      
      ctx.lineTo(x + size - r, y)
      ctx.arcTo(x + size, y, x + size, y + r, r)
      ctx.lineTo(x + size, y + size - r)
      ctx.arcTo(x + size, y + size, x + size - r, y + size, r)
      ctx.lineTo(x + r, y + size)
      ctx.arcTo(x, y + size, x, y + size - r, r)
      ctx.closePath()
      break
      
    case 5: // 不规则多边形拼图块
      const vertices = []
      const centerX = x + size / 2
      const centerY = y + size / 2
      const baseRadius = size / 2 - 5
      const vertexCount = 6 + Math.floor(Math.random() * 3)
      
      // 生成不规则多边形顶点
      for (let i = 0; i < vertexCount; i++) {
        const angle = (i / vertexCount) * Math.PI * 2
        const radiusVariation = 0.7 + Math.random() * 0.6
        const radius = baseRadius * radiusVariation
        const vx = centerX + radius * Math.cos(angle)
        const vy = centerY + radius * Math.sin(angle)
        vertices.push({ x: vx, y: vy })
      }
      
      // 绘制不规则多边形
      ctx.moveTo(vertices[0].x, vertices[0].y)
      for (let i = 1; i < vertices.length; i++) {
        // 使用贝塞尔曲线创建平滑边缘
        const current = vertices[i]
        const next = vertices[(i + 1) % vertices.length]
        const controlX = current.x + (Math.random() - 0.5) * 10
        const controlY = current.y + (Math.random() - 0.5) * 10
        ctx.quadraticCurveTo(controlX, controlY, current.x, current.y)
      }
      ctx.closePath()
      break
  }
}

// 初始化拼图
const initPuzzle = () => {
  if (!puzzleCanvas.value || !blockCanvas.value) return
  
  loading.value = true
  
  setTimeout(() => {
    const puzzleCtx = puzzleCanvas.value.getContext('2d')
    const blockCtx = blockCanvas.value.getContext('2d')
    
    // 清空画布
    puzzleCtx.clearRect(0, 0, canvasWidth, canvasHeight)
    blockCtx.clearRect(0, 0, blockSize, canvasHeight)
    
    // 生成随机位置 - 确保每次都不同
    const minX = 30
    const maxX = canvasWidth - blockSize - 60
    const minY = 10
    const maxY = canvasHeight - blockSize - 20
    
    correctX.value = minX + Math.random() * (maxX - minX)
    blockY.value = minY + Math.random() * (maxY - minY)
    
    // 添加时间戳确保随机性
    const seed = Date.now() % 1000
    correctX.value = (correctX.value + seed / 10) % (maxX - minX) + minX
    blockY.value = (blockY.value + seed / 20) % (maxY - minY) + minY
    
    // 绘制背景
    generateBackground(puzzleCtx, canvasWidth, canvasHeight)
    
    // 保存拼图块区域的图像数据
    const imageData = puzzleCtx.getImageData(correctX.value, blockY.value, blockSize, blockSize)
    
    // 在主画布上创建拼图缺口
    puzzleCtx.save()
    puzzleCtx.globalCompositeOperation = 'destination-out'
    createPuzzlePath(puzzleCtx, correctX.value, blockY.value, blockSize) // 生成新形状
    puzzleCtx.fill()
    puzzleCtx.restore()
    
    // 绘制缺口边框
    puzzleCtx.save()
    puzzleCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    puzzleCtx.lineWidth = 2
    puzzleCtx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    puzzleCtx.shadowBlur = 2
    createPuzzlePath(puzzleCtx, correctX.value, blockY.value, blockSize, true) // 使用相同形状
    puzzleCtx.stroke()
    puzzleCtx.restore()
    
    // 在滑块画布上绘制拼图块
    blockCtx.save()
    blockCtx.putImageData(imageData, 0, blockY.value)
    blockCtx.globalCompositeOperation = 'destination-in'
    createPuzzlePath(blockCtx, 0, blockY.value, blockSize, true) // 使用相同形状
    blockCtx.fill()
    blockCtx.restore()
    
    // 给拼图块添加边框和阴影效果
    blockCtx.save()
    blockCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    blockCtx.lineWidth = 2
    blockCtx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    blockCtx.shadowBlur = 4
    createPuzzlePath(blockCtx, 0, blockY.value, blockSize, true) // 使用相同形状
    blockCtx.stroke()
    blockCtx.restore()
    
    loading.value = false
  }, 300)
}

// 刷新验证码
const refreshCaptcha = () => {
  reset()
  initPuzzle()
}

// 重置状态
const reset = () => {
  sliderWidth.value = 0
  blockX.value = 0
  isDragging.value = false
  isSuccess.value = false
  sliderText.value = '向右拖动滑块完成验证'
}

// 开始拖动
const startDrag = (e) => {
  if (isSuccess.value || loading.value) return
  
  e.preventDefault()
  isDragging.value = true
  
  const startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
  const startSliderWidth = sliderWidth.value
  
  const handleMove = (moveE) => {
    if (!isDragging.value) return
    
    moveE.preventDefault()
    const currentX = moveE.type.includes('touch') ? moveE.touches[0].clientX : moveE.clientX
    const deltaX = currentX - startX
    const newWidth = Math.max(0, Math.min(canvasWidth - blockSize, startSliderWidth + deltaX))
    
    sliderWidth.value = newWidth
    blockX.value = newWidth
  }
  
  const handleEnd = (endE) => {
    if (!isDragging.value) return
    
    endE?.preventDefault()
    isDragging.value = false
    checkResult()
    
    // 清理事件监听器
    document.removeEventListener('mousemove', handleMove, { passive: false })
    document.removeEventListener('mouseup', handleEnd)
    document.removeEventListener('touchmove', handleMove, { passive: false })
    document.removeEventListener('touchend', handleEnd)
  }
  
  // 添加事件监听器
  document.addEventListener('mousemove', handleMove, { passive: false })
  document.addEventListener('mouseup', handleEnd)
  document.addEventListener('touchmove', handleMove, { passive: false })
  document.addEventListener('touchend', handleEnd)
}

// 检查结果
const checkResult = () => {
  const distance = Math.abs(blockX.value - correctX.value)
  
  if (distance <= tolerance) {
    // 验证成功
    isSuccess.value = true
    sliderText.value = '验证成功'
    emit('success')
  } else {
    // 验证失败，给出视觉反馈
    const slider = document.querySelector('.slider-handle')
    if (slider) {
      slider.style.animation = 'shake 0.5s ease-in-out'
      setTimeout(() => {
        slider.style.animation = ''
      }, 500)
    }
    
    setTimeout(() => {
      sliderWidth.value = 0
      blockX.value = 0
      sliderText.value = `差距 ${Math.round(distance)}px，请重试`
      emit('fail')
      
      setTimeout(() => {
        sliderText.value = '向右拖动滑块完成验证'
      }, 1500)
    }, 800)
  }
}

onMounted(() => {
  nextTick(() => {
    initPuzzle()
  })
})

// 暴露给父组件的方法
defineExpose({
  refresh: refreshCaptcha,
  reset,
  isSuccess: () => isSuccess.value
})
</script>

<style lang="scss" scoped>
.slider-captcha {
  width: 100%;
  user-select: none;
}

.captcha-container {
  position: relative;
  width: 320px;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  margin-bottom: 16px;
}

.puzzle-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.block-canvas {
  position: absolute;
  top: 0;
  transition: left 0.1s ease-out;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.slider-track {
  position: relative;
  width: 320px;
  height: 40px;
  border-radius: 20px;
  background: #f1f5f9;
  border: 2px solid #e2e8f0;
  overflow: hidden;
}

.slider-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f1f5f9;
}

.slider-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  transition: width 0.1s ease-out;
  border-radius: 20px;
}

.slider-handle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  z-index: 10;
  
  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }
  
  &.dragging {
    cursor: grabbing;
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }
  
  &.success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-color: #059669;
    color: white;
    cursor: default;
    
    &:hover {
      border-color: #059669;
      color: white;
    }
  }
}

.slider-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  pointer-events: none;
  white-space: nowrap;
  
  .success-text {
    color: white;
    font-weight: 600;
  }
}

.refresh-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.refresh-captcha-btn {
  width: 32px;
  height: 32px;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    border-color: #3b82f6;
    color: #3b82f6;
    transform: rotate(90deg);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// 摇动动画
@keyframes shake {
  0%, 100% { transform: translateY(-50%) translateX(0); }
  25% { transform: translateY(-50%) translateX(-3px); }
  75% { transform: translateY(-50%) translateX(3px); }
}

// 优化滑块在移动端的体验
@media (max-width: 640px) {
  .captcha-container {
    width: 280px;
    height: 140px;
  }
  
  .slider-track {
    width: 280px;
    height: 44px;
  }
  
  .slider-handle {
    width: 40px;
    height: 40px;
  }
  
  .slider-text {
    font-size: 13px;
  }
}
</style>