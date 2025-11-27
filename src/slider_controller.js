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

    // 清空 track 並插入 slide-item
    track.innerHTML = "";
    cards.forEach((card, idx) => {
      track.innerHTML += `
        <div class="slide-item mx-auto flex-shrink-0 w-[300px] m:w-1/3 l:w-1/3">
          <div class="slide-3d h-[300px] l:h-[350px]">
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
      `;
    });

    const slides = Array.from(track.children);
    let index = 0;

    // 計算可見數
    function getVisibleCount() {
      const w = window.innerWidth;

      if (w >= 550) return 3; // M & L 都顯示 3
      return 1; // S
    }

    // 設定中央卡片樣式
    function updateCenter() {
      const visible = getVisibleCount();
      let centerIndex = index;
      let indices = [];
      if (visible === 1) {
        indices = [index];
      } else {
        // 取得畫面上要顯示的卡片 index，環狀排列
        for (
          let i = -Math.floor(visible / 2);
          i <= Math.floor(visible / 2);
          i++
        ) {
          let idx = (index + i + slides.length) % slides.length;
          indices.push(idx);
        }
        centerIndex = indices[Math.floor(indices.length / 2)];
      }
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-center", i === centerIndex);
      });
    }

    function update() {
      const visible = getVisibleCount();
      const maxIndex = cards.length - 1;

      // index 邊界控制（無限循環已處理）
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
          let idx = (index + i + cards.length) % cards.length;
          indices.push(idx);
        }
      }

      // 重新渲染 track
      track.innerHTML = "";
      indices.forEach((idx, i) => {
        const card = cards[idx];
        // 判斷是否為中間卡片
        const isCenter = i === Math.floor(indices.length / 2);
        track.innerHTML += `
          <div class="slide-item mx-auto flex-shrink-0 w-[300px] m:w-1/3 l:w-1/3${isCenter ? ' is-center' : ''}">
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
        `;
      });

      // 控制按鈕狀態（根據中間卡片）
      if (prevBtn) {
        prevBtn.style.opacity = "";
        prevBtn.style.pointerEvents = "";
      }
      if (nextBtn) {
        nextBtn.style.opacity = "";
        nextBtn.style.pointerEvents = "";
      }

      // 手機螢幕：移除 hover，改用點擊翻面
      if (window.innerWidth < 550) {
        const slideItems = track.querySelectorAll('.slide-item .flip-inner');
        slideItems.forEach(item => {
          item.onmouseenter = null;
          item.onmouseleave = null;
          item.onclick = null;
          // 點擊切換 is-flipped class
          item.addEventListener('click', function handler(e) {
            item.classList.toggle('is-flipped');
          });
        });
      }
    }

    // 綁定按鈕事件
    prevBtn?.addEventListener("click", () => {
      index -= 1;
      if (index < 0) index = slides.length - 1;
      update();
    });

    nextBtn?.addEventListener("click", () => {
      index += 1;
      if (index > slides.length - 1) index = 0;
      update();
    });

    // RWD 重新計算
    window.addEventListener("resize", update);

    // 初始渲染
    update();
  }); // <-- forEach 結束
}); // <-- DOMContentLoaded 結束
