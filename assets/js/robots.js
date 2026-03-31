document.addEventListener("DOMContentLoaded", () => {
    const robotCount = 30; // Twice the number of agents
    const gridSize = 40;   // Must match the CSS background grid block size
    const robots = [];
    
    // Create a container for the robots so they don't block clicks or overlap weirdly
    const container = document.createElement("div");
    container.id = "robot-network";
    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = document.documentElement.scrollHeight + "px";
    container.style.pointerEvents = "none";
    container.style.zIndex = "0";
    container.style.overflow = "hidden";
    // Insert at the VERY beginning so it renders behind text without breaking scrollspy offsets
    document.body.insertBefore(container, document.body.firstChild);

    const svgs = [
        // Orange AGV (Kiva-style)
        '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="15" width="70" height="70" rx="20" fill="#f59e0b"/><rect x="40" y="40" width="20" height="20" rx="10" fill="#fff"/><circle cx="25" cy="25" r="5" fill="#10b981"/><circle cx="75" cy="25" r="5" fill="#ef4444"/><rect x="25" y="85" width="50" height="10" rx="5" fill="#1e293b"/><rect x="25" y="5" width="50" height="10" rx="5" fill="#1e293b"/></svg>',
        // Blue Box Delivery Bot
        '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="20" width="60" height="60" rx="15" fill="#3b82f6"/><rect x="8" y="30" width="12" height="40" rx="6" fill="#1e293b"/><rect x="80" y="30" width="12" height="40" rx="6" fill="#1e293b"/><circle cx="50" cy="50" r="10" fill="#bfdbfe"/><rect x="35" y="20" width="30" height="10" fill="#1d4ed8"/></svg>',
        // Abstract Drone / Quadcopter
        '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="25" y1="25" x2="75" y2="75" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/><line x1="75" y1="25" x2="25" y2="75" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/><circle cx="50" cy="50" r="18" fill="#64748b"/><circle cx="20" cy="20" r="14" fill="#cbd5e1"/><circle cx="80" cy="20" r="14" fill="#cbd5e1"/><circle cx="20" cy="80" r="14" fill="#cbd5e1"/><circle cx="80" cy="80" r="14" fill="#cbd5e1"/><circle cx="50" cy="50" r="6" fill="#10b981"/></svg>'
    ];

    // Helper to get minimum Y coordinate (start of the About section so robots don't go into the top/hero part)
    function getMinY() {
        // Fallback to window height if section is not found
        const aboutSec = document.getElementById('about');
        return aboutSec ? aboutSec.offsetTop : window.innerHeight;
    }

    for (let i = 0; i < robotCount; i++) {
        let robot = document.createElement("div");
        let svgContent = svgs[Math.floor(Math.random() * svgs.length)];
        // Randomly select one of the warehouse robot SVGs
        robot.innerHTML = svgContent;
        robot.style.position = "absolute";
        // SVG styling to make them fit inside the 40px grid comfortably with a tiny margin
        robot.style.padding = "4px";
        robot.style.width = (gridSize * 2) + "px"; // Twice the size
        robot.style.height = (gridSize * 2) + "px";
        robot.style.display = "flex";
        robot.style.alignItems = "center";
        robot.style.justifyContent = "center";
        robot.style.transition = "top 0.5s linear, left 0.5s linear, transform 0.2s ease"; // smooth movement
        robot.style.opacity = "0.3"; // Increased visibility by 10% (from 0.2 to 0.3)

        // Initial random position aligned to the 40px grid
        let minY = getMinY();
        let x = Math.floor((Math.random() * document.body.scrollWidth) / gridSize) * gridSize;
        // place strictly below the hero section
        let y = Math.floor((Math.random() * (document.body.scrollHeight - minY) + minY) / gridSize) * gridSize;
        
        robot.style.left = x + "px";
        robot.style.top = y + "px";

        container.appendChild(robot);
        robots.push({ 
            el: robot, 
            x: x, 
            y: y, 
            originalSVG: svgContent, 
            isExploded: false 
        });
    }

    const dirs = [
        { dx: 0, dy: -gridSize, rotate: 0 },   // up
        { dx: 0, dy: gridSize, rotate: 180 },  // down
        { dx: -gridSize, dy: 0, rotate: -90 }, // left
        { dx: gridSize, dy: 0, rotate: 90 }    // right
    ];

    // Triggers an explosion when a collision is detected!
    function explode(r) {
        if (r.isExploded) return;
        r.isExploded = true;
        r.el.innerHTML = "💥";
        // make it fully visible so the user notices the accident
        r.el.style.opacity = "0.8";
        r.el.style.fontSize = "50px";
        r.el.style.transform = `scale(1.5) rotate(${Math.random() * 360}deg)`; // spin wildly
        
        setTimeout(() => {
            // Restore to normal robot
            r.el.innerHTML = r.originalSVG;
            r.el.style.opacity = "0.3";
            r.el.style.fontSize = "";
            r.el.style.transform = "scale(1)";
            r.isExploded = false;
        }, 1200);
    }

    setInterval(() => {
        // Update container height in case page resized
        container.style.height = document.documentElement.scrollHeight + "px";
        let minY = getMinY();

        // 1. Calculate and Execute Movement
        robots.forEach(r => {
            if (r.isExploded) return; // Wait until fixed after accident!

            // Pick a random valid direction
            const dir = dirs[Math.floor(Math.random() * dirs.length)];
            
            let newX = r.x + dir.dx;
            let newY = r.y + dir.dy;
            
            // Boundary checks: Only visible in the white parts starting from About section (not the top part hero section)
            if (newX >= 300 && newX < document.body.scrollWidth - (gridSize * 2) &&  // avoid sidebar (approx 300px left)
                newY >= minY && newY < document.body.scrollHeight - (gridSize * 2)) {
                
                r.x = newX;
                r.y = newY;
                r.el.style.left = r.x + "px";
                r.el.style.top = r.y + "px";
                // Optionally rotate the robot slightly towards its moving direction
                r.el.style.transform = `scale(1) rotate(${dir.rotate * 0.1}deg)`;
            } else {
               r.el.style.transform = `scale(1)`;
            }
        });

        // 2. Collision Detection
        for (let i = 0; i < robots.length; i++) {
            for (let j = i + 1; j < robots.length; j++) {
                if (robots[i].x === robots[j].x && robots[i].y === robots[j].y) {
                    explode(robots[i]);
                    explode(robots[j]);
                }
            }
        }

    }, 500); // 500ms is exactly the transition time, making it look like continuous grid movement
});
