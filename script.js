// script.js

document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video-player");
  const overlay = document.getElementById("cast-overlay");
  const container = document.querySelector(".video-container");
  let overlayTimeout;
  let lastTouchTime = 0;
  
  // Hard-coded movie data
  const movieData = {
    metadata: [
      {
        "timestamp": "0.0-30.0",
        "actors": [
          {
            "actor_id": 1,
            "name": "Eric Winter",
            "height": "6'2\"",
            "profile_picture": "https://images.hellomagazine.com/horizon/landscape/949a32d9f11b-eric-winter-close-up-monte-carlo-tv-festival.jpg?tx=c_limit,w_960"
          },
          {
            "actor_id": 2,
            "name": "Mekia Cox",
            "height": "5'5\"",
            "profile_picture": "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcRkt3GicScNXHapDEIIjNw15RCgBtZOpiSfrB-oowDeUzIJgJbhhzBpRaFvBfHEjrt90scg7xM6g56RfEE"
          },
          {
            "actor_id": 3,
            "name": "Mellisa O'Neil",
            "height": "5'4\"",
            "profile_picture": "https://images.hellomagazine.com/horizon/landscape/7e8b3becbe4c-the-rookie-melissa.jpg?tx=c_limit,w_960"
          },
          {
            "actor_id": 4,
            "name": "Nathan Fillion",
            "height": "6'2\"",
            "profile_picture": "https://static.wikia.nocookie.net/disney/images/c/c6/Nathan_Fillion.jpg/revision/latest?cb=20180724195130"
          }
        ]
      }
    ]
  };

  const scenes = movieData.metadata;

  // Show overlay
  function showOverlay() {
    clearTimeout(overlayTimeout);
    if (window.innerWidth <= 768) {
      overlay.style.transform = "translateY(0)";
    } else {
      overlay.style.transform = "translateX(0)";
    }
  }

  // Hide overlay
  function hideOverlay() {
    if (window.innerWidth <= 768) {
      overlay.style.transform = "translateY(100%)";
    } else {
      overlay.style.transform = "translateX(100%)";
    }
  }

  // Update overlay content
  function updateOverlay(scene) {
    overlay.innerHTML = `
      <h3>Cast in this scene:</h3>
      <div class="actor-list">
        ${scene.actors
          .map(
            (actor) => `
          <div class="actor-card">
            <img src="${actor.profile_picture}" alt="${actor.name}" class="actor-image">
            <div class="actor-info">
              <h4>${actor.name}</h4>
              <p>Height: ${actor.height}</p>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  // Toggle overlay visibility
  function toggleOverlay() {
    if (overlay.style.transform === "translateX(0px)" || overlay.style.transform === "translateY(0px)") {
      hideOverlay();
    } else {
      showOverlay();
    }
  }

  // Handle user interaction
  function handleInteraction(event) {
    if (event.type === "touchend") {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTouchTime;
      lastTouchTime = currentTime;

      if (tapLength < 500 && tapLength > 0) {
        toggleOverlay();
      }
    } else {
      if (video.paused) {
        showOverlay();
      } else {
        showOverlay();
        overlayTimeout = setTimeout(hideOverlay, 3000);
      }
    }
  }

  // Listen for time updates
  video.addEventListener("timeupdate", () => {
    const currentTime = video.currentTime;
    const scene = scenes.find((m) => {
      const [start, end] = m.timestamp.split("-").map(Number);
      return currentTime >= start && currentTime <= end;
    });

    if (scene) {
      updateOverlay(scene);
    }
  });

  // Add event listeners for both mouse and touch events
  container.addEventListener("mousemove", handleInteraction);
  container.addEventListener("touchend", handleInteraction);

  // Toggle play/pause on click/tap
  container.addEventListener("click", (event) => {
    if (event.target !== overlay && !overlay.contains(event.target)) {
      if (video.paused) {
        video.play();
        hideOverlay();
      } else {
        video.pause();
        showOverlay();
      }
    }
  });

  // Hide overlay when mouse/touch leaves the container (if video is playing)
  container.addEventListener("mouseleave", () => {
    if (!video.paused) {
      hideOverlay();
    }
  });

  // Hide overlay when video starts playing
  video.addEventListener("play", hideOverlay);

  // Show overlay when video is paused
  video.addEventListener("pause", showOverlay);

  // Initially update the overlay with the first scene
  updateOverlay(scenes[0]);

  // Handle window resize
  window.addEventListener("resize", () => {
    if (overlay.style.transform === "translateX(0px)" || overlay.style.transform === "translateY(0px)") {
      showOverlay();
    } else {
      hideOverlay();
    }
  });
});

// Add this at the end of your script.js file
setTimeout(() => {
  const overlay = document.getElementById("cast-overlay");
  overlay.textContent = "Test Overlay";
  overlay.style.display = "block";
}, 1000);
