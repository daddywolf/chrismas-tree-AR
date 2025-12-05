
# Holographic AI Christmas Tree 🎄✨
# 全息 AI 圣诞树

[English Version](#english) | [中文版本](#chinese)

---

<a name="english"></a>
## 🇬🇧 English Version

### Project Overview
The **Holographic AI Christmas Tree** is a cutting-edge **WebAR (Augmented Reality)** application that creates a virtual, interactive 3D Christmas tree in your physical space using your webcam.

It utilizes **Google MediaPipe** for real-time AI computer vision to track both your **hands** and **face** simultaneously. You can control the tree's particles with hand gestures and navigate the scene by moving your head, creating a "holographic" illusion.

### ✨ Key Features
*   **Particle Simulation**: A volumetric tree composed of **45,000+ interactive particles**.
*   **Dual AI Tracking**: Simultaneous Hand and Face tracking logic.
*   **Memory Gallery**: Double-sided "Polaroid" style photos hanging on the tree.
*   **Gesture Interaction**:
    *   **Disperse/Assemble**: Explode the tree into snow or gather it back.
    *   **Smart Zoom**: Pinch to grab a photo; it flies to the top-center of your screen for reading.
*   **Head-Tracking Parallax**: Move your head to look around the tree (Holographic effect).
*   **Customizable**: Adjust colors, particle count, and speed via a holographic UI.
*   **Cinematic Effects**: Post-processing includes Bloom (glow), Noise, and Vignette.

### 🛠 Tech Stack
*   **Framework**: [React 18](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **3D Engine**: [Three.js](https://threejs.org/)
*   **React Renderer**: [React Three Fiber (R3F)](https://docs.pmnd.rs/react-three-fiber)
*   **AI / Computer Vision**: [Google MediaPipe Tasks Vision](https://developers.google.com/mediapipe)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Post-Processing**: [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)

### 🎮 Controls & User Guide

#### 1. Hand Gestures (Interaction)
Ensure your hand is visible to the camera.
*   **🖐 Open Palm**: **Disperse**. The tree explodes into a swirling storm of particles.
*   **✊ Closed Fist**: **Assemble**. The particles gather to form the tree shape.
*   **👌 Pinch (Thumb & Index)**: **Select & Zoom**.
    *   Hover your cursor over a hanging photo.
    *   Pinch and hold to bring the photo to the **top center** of your screen.
    *   Release to let it fly back to the tree.
*   **✋ Hovering**: Merely holding your hand up will **pause the tree's automatic rotation**, allowing you to look at details closely.

#### 2. Face Movements (Navigation)
*   **Look Left/Right**: Rotates the 3D scene left or right.
*   **Move Head (Position)**: Moves the tree slightly in X/Y axis (Parallax Effect), adding depth to the AR experience.

### 🚀 Installation & Deployment

**Prerequisites**: Node.js (v16+) and npm/yarn.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/holographic-xmas-tree.git
    cd holographic-xmas-tree
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Open in Browser**:
    *   Navigate to `http://localhost:5173`
    *   **Important**: You must allow **Camera Permissions** when prompted.

5.  **Build for Production**:
    ```bash
    npm run build
    ```

---

<a name="chinese"></a>
## 🇨🇳 中文版本

### 项目简介
**全息 AI 圣诞树** 是一款前沿的 **WebAR (增强现实)** 应用。它利用您的网络摄像头，在您的现实空间中投射出一棵虚拟的、可交互的 3D 圣诞树。

项目集成了 **Google MediaPipe** 实时 AI 视觉算法，能够同时追踪您的**手势**和**面部**动作。您可以通过手势控制树的形态，通过头部运动改变观察视角，从而获得仿佛置身于科幻电影中的“全息”体验。

### ✨ 核心功能
*   **粒子模拟**：由 **45,000+ 个发光粒子** 组成的体积化树身。
*   **双重 AI 追踪**：同时支持手部骨骼检测与面部特征点检测。
*   **记忆画廊**：树上悬挂着双面渲染的“拍立得”风格照片。
*   **手势交互**：
    *   **聚散控制**：张开手掌打散圣诞树，握拳将其聚合。
    *   **智能放大**：手指捏合即可抓取照片，照片会自动飞至屏幕**正上方居中**位置方便查看。
*   **头部视差**：随着您的头部移动，圣诞树会产生视差位移（全息效果）。
*   **高度定制**：通过全息控制面板调节树的颜色、粒子数量和动画速度。
*   **电影级特效**：包含辉光 (Bloom)、噪点 (Noise) 和暗角 (Vignette) 后期处理。

### 🛠 技术栈
*   **核心框架**: [React 18](https://react.dev/)
*   **构建工具**: [Vite](https://vitejs.dev/)
*   **3D 引擎**: [Three.js](https://threejs.org/)
*   **React 渲染器**: [React Three Fiber (R3F)](https://docs.pmnd.rs/react-three-fiber)
*   **AI / 计算机视觉**: [Google MediaPipe Tasks Vision](https://developers.google.com/mediapipe)
*   **状态管理**: [Zustand](https://github.com/pmndrs/zustand)
*   **后期处理**: [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing)
*   **样式库**: [Tailwind CSS](https://tailwindcss.com/)

### 🎮 操作指南

#### 1. 手势控制 (交互)
请确保您的手在摄像头画面内。
*   **🖐 张开五指**: **打散 (Disperse)**。圣诞树炸裂成漫天飞舞的粒子风暴。
*   **✊ 握紧拳头**: **聚合 (Assemble)**。所有元素瞬间聚合成完美的圣诞树。
*   **👌 捏合手指 (拇指与食指)**: **选中并放大**。
    *   移动手势光标悬停在照片上。
    *   捏住手指，照片会飞到屏幕**上方居中**位置，并自动校正角度面向您。
    *   松开手指，照片飞回树上。
*   **✋ 手部悬停**: 只要检测到手出现在画面中，圣诞树会自动**停止自转**，方便您仔细观察细节。

#### 2. 面部控制 (导航)
*   **向左/向右转头**: 旋转 3D 场景的视角。
*   **头部平移 (上下左右)**: 圣诞树会跟随头部位置产生轻微的位移 (视差效果)，增强 AR 的空间深度感。

### 🚀 安装与部署

**前置要求**: Node.js (v16+) 和 npm/yarn。

1.  **克隆项目**:
    ```bash
    git clone https://github.com/your-username/holographic-xmas-tree.git
    cd holographic-xmas-tree
    ```

2.  **安装依赖**:
    ```bash
    npm install
    # 或者
    yarn install
    ```

3.  **启动开发服务器**:
    ```bash
    npm run dev
    ```

4.  **在浏览器打开**:
    *   访问 `http://localhost:5173`
    *   **注意**: 浏览器提示时，必须允许**摄像头权限**。

5.  **打包部署**:
    ```bash
    npm run build
    ```
