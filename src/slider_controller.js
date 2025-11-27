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

    // ✅ 預先載入圖片，減少第一次看到的閃動
    cards.forEach((card) => {
      const f = new Image();
      f.src = card.front;
      const b = new Image();
      b.src = card.back;
    });

    let index = 0;

    // 計算可見數
    function getVisibleCount() {
      const w = window.innerWidth;
      if (w >= 550) return 3; // M & L 顯示 3
      return 1; // S
    }

    // 建立固定數量的 slide DOM，只做一次或在可見數改變時重建
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
                  />
                </div>
                <div class="flip-face flip-back flex flex-col items-center justify-center gap-2 p-6">
                  <img 
                    class="slide-img-back w-full h-full scale-[70%] object-contain" 
                    src="" 
                    alt="Slide back"
                  />
                </div>
              </div>
            </div>
          </div>
        `
        );
      }
    }

    // 重新渲染當前要顯示的卡片（只更新內容，不砍 DOM）
    function update() {
      const visible = getVisibleCount();
      const maxIndex = cards.length - 1;

      // index 邊界控制（無限循環）
      if (index < 0) index = maxIndex;
      if (index > maxIndex) index = 0;

      // 如果目前 DOM 裡的 slide 數量跟 visible 不同，重新建一次
      if (track.children.length !== visible) {
        buildSlides(visible);
      }

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

      const slideItems = track.querySelectorAll(".slide-item");

      slideItems.forEach((slideEl, i) => {
        const cardIdx = indices[i];
        const card = cards[cardIdx];

        const frontImg = slideEl.querySelector(".slide-img-front");
        const backImg = slideEl.querySelector(".slide-img-back");
        const flipInner = slideEl.querySelector(".flip-inner");

        // 設定圖片路徑
        if (frontImg && backImg) {
          frontImg.src = card.front;
          backImg.src = card.back;
          frontImg.alt = `Slide ${cardIdx + 1} front`;
          backImg.alt = `Slide ${cardIdx + 1} back`;
        }

        // 中間那張加上 is-center
        const isCenter = i === Math.floor(indices.length / 2);
        slideEl.classList.toggle("is-center", isCenter);

        // 每次切換時，重置翻面狀態
        flipInner.classList.remove("is-flipped");
      });

      // 控制按鈕狀態（無限輪播就維持可點）
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
      if (window.innerWidth >= 550) return; // 只給手機用

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
}); // DOMContentLoaded 結束
