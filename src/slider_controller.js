document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll("[data-slider]");

  sliders.forEach((slider) => {
    const track = slider.querySelector("[data-slider-track]");
    const prevBtn = slider.querySelector("[data-prev]");
    const nextBtn = slider.querySelector("[data-next]");

    // 產生 12 張卡片 slide
    const cards = Array.from({ length: 12 }, (_, i) => ({
      front: `/img/material/選手卡_正面_${i + 1}.png`,
      back: `/img/material/選手卡_背面_${i + 1}.png`,
    }));

    let index = 0;

    // 計算可見數
    function getVisibleCount() {
      const w = window.innerWidth;
      if (w >= 550) return 3; // M & L 顯示 3
      return 1; // S
    }

    // 重新渲染當前要顯示的卡片
    function update() {
      const visible = getVisibleCount();
      const maxIndex = cards.length - 1;

      // index 邊界控制（無限循環）
      if (index < 0) index = maxIndex;
      if (index > maxIndex) index = 0;

      // 取得要顯示的卡片 index（環狀排列）
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

      // 重新渲染 track
      track.innerHTML = "";
      indices.forEach((idx, i) => {
        const card = cards[idx];
        const isCenter = i === Math.floor(indices.length / 2);
        track.insertAdjacentHTML(
          "beforeend",
          `
          <div class="slide-item mx-auto flex-shrink-0 w-[300px] m:w-1/3 l:w-1/3${
            isCenter ? " is-center" : ""
          }">
            <div class="slide-3d h-[300px]">
              <div class="flip-inner rounded-xl shadow-lg">
                <div class="flip-face flip-front">
                  <img src="${card.front}" 
                       alt="Slide ${idx + 1}" 
                       class="w-full h-full scale-[70%] object-contain"/>
                </div>
                <div class="flip-face flip-back flex flex-col items-center justify-center gap-2 p-6">
                  <img src="${card.back}" 
                       alt="Slide ${idx + 1}" 
                       class="w-full h-full scale-[70%] object-contain"/>
                </div>
              </div>
            </div>
          </div>
        `
        );
      });

      // 控制按鈕狀態（依你原本邏輯，無限輪播就維持可點）
      if (prevBtn) {
        prevBtn.style.opacity = "";
        prevBtn.style.pointerEvents = "";
      }
      if (nextBtn) {
        nextBtn.style.opacity = "";
        nextBtn.style.pointerEvents = "";
      }
    }

    // ✅ 手機：用事件委派做點擊翻面（桌機 / 平板不受影響）
    track.addEventListener("click", (e) => {
      // 只在小於 550px 時啟用 click 翻面
      if (window.innerWidth >= 550) return;

      const flipInner = e.target.closest(".flip-inner");
      if (!flipInner) return;

      flipInner.classList.toggle("is-flipped");
    });

    // 綁定按鈕事件
    prevBtn?.addEventListener("click", () => {
      index -= 1;
      update();
    });

    nextBtn?.addEventListener("click", () => {
      index += 1;
      update();
    });

    // RWD 重新計算（寬度變動時重畫）
    window.addEventListener("resize", update);

    // 初始渲染
    update();
  }); // forEach 結束
  document.querySelector('.flip-inner').addEventListener('click', () => console.log('clicked'));
}); // DOMContentLoaded 結束



