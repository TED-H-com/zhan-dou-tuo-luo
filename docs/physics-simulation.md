# 戰鬥陀螺物理與碰撞模擬指南

本文件記錄了戰鬥陀螺（Beyblade X）在虛擬或物理引擎中進行模擬時，所需考慮的物理運算、碰撞參數與模擬方程式。

## 1. 自旋物理與衰減 (Spin Physics and Decay)

陀螺在運動中，最重要的數值為轉速 (RPM)。轉速會因為與地面摩擦以及空氣阻力而持續衰減。

- **自旋衰減公式:**
  `RPM_new = RPM_current - (Friction_ground * W + Drag_air * V^2) * dt`
  其中：
  - `W` 是陀螺重量 (Weight)。
  - `V` 是當前線速度 (Velocity)。
  - `Friction_ground` 是軸心與競技場表面的摩擦係數。
  - `Drag_air` 是空氣阻力係數，通常與陀螺外圈形狀 (Blade shape) 有關。

- **離心力與穩定度:**
  高轉速會提供強大的陀螺儀效應，使陀螺能抵抗傾倒。當 RPM 低於特定閾值時，陀螺會失去穩定度並開始搖晃 (Wobble)，進而加速接地面積與摩擦力，導致轉速急遽下降。

## 2. 碰撞參數 (Collision Parameters)

當兩顆陀螺發生碰撞時，能量轉換與反彈方向由以下參數決定：

- **彈性係數 (Restitution Coefficient, e):** 決定碰撞後的反彈動能保留率。
- **接觸角 (Impact Angle):** 兩者刀刃接觸瞬間的相對角度。
- **動量守恆與能量轉移:**
  碰撞瞬間會發生動能 (Translational Kinetic Energy) 與旋轉動能 (Rotational Kinetic Energy) 的轉換。
  碰撞產生的衝力 (Impulse, J) 公式：
  `J = (-(1 + e) * V_rel) / (1/m1 + 1/m2 + (r1 x n)^2 / I1 + (r2 x n)^2 / I2)`
  其中 `m` 為質量，`I` 為轉動慣量，`r` 為接觸點至質心的向量，`n` 為碰撞法向量。

碰撞不僅會改變移動軌跡，也會造成雙方 RPM 瞬間下降。

## 3. X衝刺模擬方程式 (X Dash Simulation Equations)

Beyblade X 的核心機制「X衝刺」(Xtreme Dash)，發生在陀螺軸心齒輪與競技場外圈軌道 (X-Line) 咬合時。

- **觸發條件:**
  陀螺進入軌道區，且相對速度與咬合角度滿足齒輪接合條件。
- **加速度計算:**
  齒輪咬合時，旋轉動能會被強制轉換為直線動能。
  `Acceleration_X = (RPM_current * Gear_ratio) * Traction_efficiency`
  - `Gear_ratio`: 軸心齒輪的齒比。
  - `Traction_efficiency`: 軌道咬合的摩擦力與穩定度，若過高可能會導致失控飛出。
- **路徑預測:**
  在 X Dash 期間，陀螺將沿著軌道切線方向獲得極大向心加速度，模擬時需施加強大的引導力 (Guiding Force) 使其貼合軌道，並在脫離點以切線方向射出。

## 4. 爆裂閾值 (Burst Threshold)

爆裂機制 (Burst) 是當陀螺承受的瞬間衝擊力大於內部卡榫 (Bit/Ratchet) 的咬合力時發生。

- **抗爆裂阻力 (Burst Resistance):**
  由 Ratchet 齒數、形狀與 Bit 的彈簧強度共同決定。
- **爆裂判定公式:**
  當碰撞產生的瞬間衝擊力 `J_impact > Resistance_threshold` 時，會觸發一段「鬆脫」。
  若累計的鬆脫段數超過陀螺的卡榫上限，則判定為爆裂 (Burst Finish)。

在精確模擬中，連續的小碰撞也可能因為共振或反覆施壓，導致抗爆裂阻力暫時下降。
