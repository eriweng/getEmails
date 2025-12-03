document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll("[data-slider]");

  // 定義每個 slider 的卡片資料
  const sliderCardSets = [
    // 第一個 slider：S3
    Array.from({ length: 12 }, (_, i) => ({
      front: `/img/material3/AnyConv.com__選手卡_正面_${i + 1}.webp`,
      back: `/img/material3/AnyConv.com__選手卡_背面_${i + 1}.webp`,
    })),
    // 第二個 slider：S4（新卡片）
    Array.from({ length: 15 }, (_, i) => ({
      front: `/img/material3/AnyConv.com__新卡_正面_${i + 1}.webp`,
      back: `/img/material3/AnyConv.com__新卡_背面_${i + 1}.webp`,
    })),
  ];

  sliders.forEach((slider, sliderIdx) => {
    const track = slider.querySelector("[data-slider-track]");
    const prevBtn = slider.querySelector("[data-prev]");
    const nextBtn = slider.querySelector("[data-next]");

    // 取得對應的卡片資料
    const cards = sliderCardSets[sliderIdx] || sliderCardSets[0];

    // ❌【已拿掉】一次預載所有卡片，這會讓每個訪客一進站就下載全部圖片
    // cards.forEach((card) => {
    //   const f = new Image();
    //   f.src = card.front;
    //   const b = new Image();
    //   b.src = card.back;
    // });

    let index = 0;

    function getVisibleCount() {
      const w = window.innerWidth;
      if (w >= 550) return 3;
      return 1;
    }

    function buildSlides(visible) {
      track.innerHTML = "";
      for (let i = 0; i < visible; i++) {
        track.insertAdjacentHTML(
          "beforeend",
          `
          <div class="slide-item mx-auto flex-shrink-0 w-[300px] m:w-1/3 l:w-1/3">
            <div class="slide-3d h-[300px]">
              <div class="flip-inner rounded-xl shadow-lg">
                <div class="flip-face flip-front">
                  <img 
                    class="slide-img-front w-full h-full scale-[70%] object-contain" 
                    src="" 
                    alt="Slide front"
                    loading="lazy"
                  />
                </div>
                <div class="flip-face flip-back flex flex-col items-center justify-center gap-2 p-6">
                  <img 
                    class="slide-img-back w-full h-full scale-[70%] object-contain" 
                    src="" 
                    alt="Slide back"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        `
        );
      }
    }

    function update() {
      const visible = getVisibleCount();
      const maxIndex = cards.length - 1;

      if (index < 0) index = maxIndex;
      if (index > maxIndex) index = 0;

      // 視窗寬度改變時，重新產生對應張數的 slide
      if (track.children.length !== visible) {
        buildSlides(visible);
      }

      let indices = [];
      if (visible === 1) {
        indices = [index];
      } else {
        for (
          let i = -Math.floor(visible / 2);
          i <= Math.floor(visible / 2);
          i++
        ) {
          const idx = (index + i + cards.length) % cards.length;
          indices.push(idx);
        }
      }

      const slideItems = track.querySelectorAll(".slide-item");

      slideItems.forEach((slideEl, i) => {
        const cardIdx = indices[i];
        const card = cards[cardIdx];
        const frontImg = slideEl.querySelector(".slide-img-front");
        const backImg = slideEl.querySelector(".slide-img-back");
        const flipInner = slideEl.querySelector(".flip-inner");

        // ⭐ 只在需要顯示時，才設定圖片 src
        if (frontImg && backImg && card) {
          if (frontImg.src !== location.origin + card.front) {
            frontImg.src = card.front;
          }
          if (backImg.src !== location.origin + card.back) {
            backImg.src = card.back;
          }
          frontImg.alt = `Slide ${cardIdx + 1} front`;
          backImg.alt = `Slide ${cardIdx + 1} back`;
        }

        const isCenter = i === Math.floor(indices.length / 2);
        slideEl.classList.toggle("is-center", isCenter);

        // 每次切換卡片時，把翻面狀態重置
        if (flipInner) {
          flipInner.classList.remove("is-flipped");
        }
      });

      if (prevBtn) {
        prevBtn.style.opacity = "";
        prevBtn.style.pointerEvents = "";
      }
      if (nextBtn) {
        nextBtn.style.opacity = "";
        nextBtn.style.pointerEvents = "";
      }
    }

    // 手機版點擊翻面
    track.addEventListener("click", (e) => {
      if (window.innerWidth >= 550) return;
      const flipInner = e.target.closest(".flip-inner");
      if (!flipInner) return;
      flipInner.classList.toggle("is-flipped");
    });

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
}); // DOMContentLoaded 結束
