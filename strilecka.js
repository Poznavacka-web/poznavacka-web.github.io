(() => {
  if (window.__dartPlayerEnhancedFixed) return;
  window.__dartPlayerEnhancedFixed = true;
  dart_count = 0

  // Player
  const player = document.createElement("div");
  player.id = "dart-player";
  document.body.appendChild(player);

  let px = innerWidth / 2;
  let py = innerHeight / 2;
  let angle = 0;
  const speed = 5;

  let moveX = 0, moveY = 0;

  // Touch joystick
  const joystick = document.createElement("div");
  joystick.id = "touch-joystick";
  const stick = document.createElement("div");
  stick.id = "touch-stick";
  joystick.appendChild(stick);
  document.body.appendChild(joystick);

  let dragging = false;
  let startX, startY;

  joystick.addEventListener("touchstart", e => {
    dragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });
  joystick.addEventListener("touchmove", e => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    const dist = Math.hypot(dx, dy);
    const maxDist = 40;
    const ratio = Math.min(dist, maxDist) / dist;
    stick.style.transform = `translate(${dx*ratio}px, ${dy*ratio}px)`;
    moveX = dx / maxDist;
    moveY = dy / maxDist;
  });
  joystick.addEventListener("touchend", e => {
    dragging = false;
    stick.style.transform = `translate(0px,0px)`;
    moveX = 0;
    moveY = 0;
  });

  // Multi-touch shooting for mobile
  const activeTouches = new Set();
  document.addEventListener("touchstart", e => {
    for (const t of e.changedTouches) activeTouches.add(t.identifier);
    for (const t of e.changedTouches) {
      const el = document.elementFromPoint(t.clientX, t.clientY);
      if (el === stick || el === joystick) continue;
      shoot();
    }
  });
  document.addEventListener("touchend", e => {
    for (const t of e.changedTouches) activeTouches.delete(t.identifier);
  });

  // Desktop keyboard controls fallback
  const keys = {};
  document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;

    // Prevent spacebar scroll and fire dart
    if (e.code === "Space") {
      e.preventDefault();
      shoot();
    }
  });
  document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

  function update() {
    let dx = moveX;
    let dy = moveY;

    if (keys["arrowup"] || keys["w"]) dy -= 1;
    if (keys["arrowdown"] || keys["s"]) dy += 1;
    if (keys["arrowleft"] || keys["a"]) dx -= 1;
    if (keys["arrowright"] || keys["d"]) dx += 1;

    if (dx || dy) {
      const len = Math.hypot(dx, dy);
      dy /= len;
      dx /= len;

      px += dx * speed;
      py += dy * speed;

      angle = Math.atan2(dy, dx);
    }

    // Keep player inside viewport
    px = Math.min(Math.max(0, px), innerWidth - 26);
    py = Math.min(Math.max(0, py), innerHeight - 26);

    player.style.left = px + "px";
    player.style.top = py + "px";
    player.style.transform = `rotate(${angle}rad)`;

    requestAnimationFrame(update);
  }

    function shoot() {
        max_dc = 50;
    dart_count = dart_count + 1;
    console.log(dart_count)
    if (dart_count >= max_dc) {
        dart_count = dart_count - 1;
        return;
    }
    const dart = document.createElement("div");
    dart.className = "dart-shot";
    dart.style.left = px + "px";
    dart.style.top = py + "px";
    dart.style.transform = `rotate(${angle}rad)`;
    document.body.appendChild(dart);

    const speedShot = 12;
    const vx = Math.cos(angle) * speedShot;
    const vy = Math.sin(angle) * speedShot;

    let posX = px;
    let posY = py;

    const anim = () => {
      posX += vx;
      posY += vy;
      dart.style.left = posX + "px";
      dart.style.top = posY + "px";
      if (dart_count >= max_dc) {
        dart.remove();
        dart_count = dart_count - 1;
        return;
      }
      const hit = document.elementFromPoint(posX + 10, posY + 2);
      if (
        hit &&
        hit !== dart &&
        hit !== player &&
        hit !== document.body &&
        hit !== document.documentElement &&
        hit !== joystick &&
        hit !== stick
      ) {
        hit.remove();
        createTrail(posX, posY);
        dart.remove()
        dart_count = dart_count - 1;
        return;
      }

      if (posX < 0 || posX > innerWidth || posY < 0 || posY > innerHeight) {
        posX = px;
        posY = py;
        dart.style.left = 0 + "px";
        dart.style.top = 0 + "px";
      }

      createTrail(posX, posY);
      requestAnimationFrame(anim);
    };
    anim();
    
  }

  function createTrail(x, y) {
    const trail = document.createElement("div");
    trail.className = "trail";
    trail.style.left = x + "px";
    trail.style.top = y + "px";
    document.body.appendChild(trail);
    const fade = () => {
      let op = parseFloat(trail.style.opacity);
      op -= 0.05;
      if (op <= 0) {
        trail.remove();
        return;
      }
      trail.style.opacity = op;
      requestAnimationFrame(fade);
    };
    fade();
  }

  update();
  console.log("%cDART PLAYER READY (SPACE TO SHOOT, MOVE JOYSTICK)", "color:#00ffcc;font-weight:bold;");
})();
