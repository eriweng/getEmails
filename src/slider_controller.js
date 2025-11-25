
document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll("[data-slider]");

  sliders.forEach((slider) => {
    const track = slider.querySelector("[data-slider-track]");
    const slides = Array.from(track.children); // 這些就是 .slide-item
    const prevBtn = slider.querySelector("[data-prev]");
    const nextBtn = slider.querySelector("[data-next]");

    let index = 0;

    function getVisibleCount() {
      const w = window.innerWidth;
      // 對應你的自訂 screens：
      // s: 320–549   → 1 張
      // m: 550–1024  → 2 張
      // l: 1025–1512 → 3 張
      // xlup: 1513+  → 3 張（你要 4 張也可以自己改）
      if (w >= 1025) return 3;
      return 1;
    }

    function getMaxIndex() {
      const visible = getVisibleCount();
      const total = slides.length;
      if (visible >= total) return 0;  // 一次看完所有 → 不需要滑到空白
      return total - visible;
    }

    // 標記「中間那張」
    function updateCenter() {
      const visible = getVisibleCount();
      const total = slides.length;
      let centerIndex = index + Math.floor(visible / 2);
      if (centerIndex > total - 1) centerIndex = total - 1;
      if (centerIndex < 0) centerIndex = 0;

      slides.forEach((slide, i) => {
        slide.classList.toggle("is-center", i === centerIndex);
      });
        console.log("center", centerIndex);
    }

    function update() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const maxIndex = getMaxIndex();

      if (index > maxIndex) index = maxIndex;
      if (index < 0) index = 0;

      track.style.transform = `translateX(-${index * slideWidth}px)`;

      // 控制按鈕透明度
      if (prevBtn) {
        prevBtn.style.opacity = index === 0 ? '0.3' : '1';
        prevBtn.style.pointerEvents = index === 0 ? 'none' : 'auto';
      }
      if (nextBtn) {
        nextBtn.style.opacity = index === maxIndex ? '0.3' : '1';
        nextBtn.style.pointerEvents = index === maxIndex ? 'none' : 'auto';
      }

      updateCenter();
    }


    prevBtn?.addEventListener("click", () => {
      index -= 1;
      update();
    });

    nextBtn?.addEventListener("click", () => {
      index += 1;
      update();
    });

    window.addEventListener("resize", update);

    // 初始化
    update();
  });
});

