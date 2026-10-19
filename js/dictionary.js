// Tap-to-Translate & Instant Dictionary Engine (Free Dictionary API + KanjiAPI.dev + Furigana Toggle)
class InstantDictionaryEngine {
  constructor() {
    this.popupEl = null;
    this.furiganaHidden = false;
    this.initPopup();
    this.setupSelectionListener();
  }

  initPopup() {
    if (this.popupEl) return;
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', () => this.initPopup());
      return;
    }
    this.popupEl = document.createElement('div');
    this.popupEl.className = 'instant-dict-popup';
    this.popupEl.id = 'instant-dict-popup';
    this.popupEl.innerHTML = `
      <div class="dict-popup-header">
        <span class="dict-word" id="dict-word-term">word</span>
        <button class="dict-audio-btn" id="dict-audio-play" title="Phát âm">🔊</button>
        <button class="dict-close-btn" id="dict-popup-close">✕</button>
      </div>
      <div class="dict-phonetic" id="dict-word-phonetic">/ipa/</div>
      <div class="dict-body" id="dict-word-meaning">Đang tra cứu...</div>
      <div class="dict-footer">
        <button class="btn-subtle" id="dict-save-srs" style="font-size: 0.78rem; padding: 4px 10px; width: 100%; border-color: rgba(59, 130, 246, 0.4); color: #60a5fa;">
          ➕ Lưu Ngay Vào Sổ Thẻ SRS
        </button>
      </div>
    `;
    document.body.appendChild(this.popupEl);

    // Close button
    this.popupEl.querySelector('#dict-popup-close').addEventListener('click', () => {
      this.hide();
    });

    // Audio button
    this.popupEl.querySelector('#dict-audio-play').addEventListener('click', () => {
      const term = this.popupEl.querySelector('#dict-word-term').textContent;
      const isJp = !!term.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/);
      window.speechEngine.speak(term, isJp ? 'ja' : 'en', 1.0);
    });

    // Save to SRS button
    this.popupEl.querySelector('#dict-save-srs').addEventListener('click', () => {
      const term = this.popupEl.querySelector('#dict-word-term').textContent;
      const def = this.popupEl.querySelector('#dict-word-meaning').textContent;
      const isJp = !!term.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/);

      const newItem = {
        id: 'user_srs_' + Date.now(),
        word: isJp ? '' : term,
        kanji: isJp ? term : '',
        meaningVi: def.slice(0, 120),
        pos: isJp ? 'kanji' : 'vocab',
        collocations: `Tra cứu trực tiếp: ${term}`,
        exampleEn: isJp ? '' : `I just learned the word "${term}".`,
        exampleJp: isJp ? `「${term}」の意味を調べました。` : '',
        exampleVi: `Tôi vừa lưu từ này vào sổ thẻ SRS cá nhân.`
      };

      window.srsSystem.processReview(newItem.id, 1);
      if (isJp) window.JLPT_DATA.vocabBank.unshift(newItem);
      else window.TOEIC_DATA.vocabBank.unshift(newItem);

      window.soundEngine.playCorrect();
      const saveBtn = this.popupEl.querySelector('#dict-save-srs');
      saveBtn.textContent = '✓ Đã Lưu Vào Thẻ SRS!';
      setTimeout(() => this.hide(), 1200);
    });
  }

  setupSelectionListener() {
    // Listen for text selection or double tap
    document.addEventListener('mouseup', (e) => {
      // Don't trigger if click inside popup
      if (this.popupEl.contains(e.target)) return;

      const selection = window.getSelection().toString().trim();
      if (selection && selection.length > 0 && selection.length < 35) {
        this.lookupWord(selection, e.pageX, e.pageY);
      }
    });

    // Touch selection support for phones
    document.addEventListener('touchend', (e) => {
      if (this.popupEl.contains(e.target)) return;
      setTimeout(() => {
        const selection = window.getSelection().toString().trim();
        if (selection && selection.length > 0 && selection.length < 35) {
          const touch = e.changedTouches[0];
          this.lookupWord(selection, touch.pageX, touch.pageY);
        }
      }, 200);
    });
  }

  async lookupWord(rawWord, x, y) {
    const clean = rawWord.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "").trim();
    if (!clean) return;

    // Position popup near selection
    this.showAt(clean, x, y);

    const isJp = !!clean.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/);

    if (isJp) {
      await this.lookupJapanese(clean);
    } else {
      await this.lookupEnglish(clean);
    }
  }

  showAt(word, x, y) {
    const termEl = this.popupEl.querySelector('#dict-word-term');
    const phoEl = this.popupEl.querySelector('#dict-word-phonetic');
    const meanEl = this.popupEl.querySelector('#dict-word-meaning');
    const saveBtn = this.popupEl.querySelector('#dict-save-srs');

    termEl.textContent = word;
    phoEl.textContent = 'Đang tra cứu từ điển mở...';
    meanEl.textContent = 'Đang nạp dữ liệu từ Free Dictionary API & KanjiAPI...';
    saveBtn.textContent = '➕ Lưu Ngay Vào Sổ Thẻ SRS';

    // Calculate clamped screen position
    const popupWidth = 280;
    const posX = Math.max(10, Math.min(window.innerWidth - popupWidth - 20, x - 140));
    const posY = Math.max(10, y + 15);

    this.popupEl.style.left = `${posX}px`;
    this.popupEl.style.top = `${posY}px`;
    this.popupEl.classList.add('active');
  }

  hide() {
    this.popupEl.classList.remove('active');
  }

  async lookupEnglish(word) {
    const phoEl = this.popupEl.querySelector('#dict-word-phonetic');
    const meanEl = this.popupEl.querySelector('#dict-word-meaning');

    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      const entry = data[0];

      const phonetic = entry.phonetic || entry.phonetics?.find(p => p.text)?.text || '';
      phoEl.textContent = phonetic;

      const meanings = entry.meanings || [];
      if (meanings.length > 0) {
        const topDef = meanings[0].definitions?.[0]?.definition || '';
        const partOfSpeech = meanings[0].partOfSpeech || '';
        meanEl.innerHTML = `<strong>(${partOfSpeech})</strong>: ${topDef}`;
      } else {
        meanEl.textContent = "Không tìm thấy định nghĩa chi tiết.";
      }
    } catch (e) {
      phoEl.textContent = "";
      meanEl.textContent = `Từ vựng tiếng Anh: "${word}". Hãy lưu lại để học trong buổi tiếp theo!`;
    }
  }

  async lookupJapanese(charOrWord) {
    const phoEl = this.popupEl.querySelector('#dict-word-phonetic');
    const meanEl = this.popupEl.querySelector('#dict-word-meaning');

    // If single Kanji, query KanjiAPI.dev
    if (charOrWord.length === 1 && charOrWord.match(/[\u3400-\u4dbf\u4e00-\u9fff]/)) {
      try {
        const res = await fetch(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(charOrWord)}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();

        const on = (data.on_readings || []).join(', ');
        const kun = (data.kun_readings || []).join(', ');
        const meanings = (data.meanings || []).slice(0, 3).join(', ');

        phoEl.textContent = `Âm Ôn: ${on || '-'} • Âm Kun: ${kun || '-'}`;
        meanEl.innerHTML = `<strong>Nghĩa Kanji:</strong> ${meanings}<br><small style="color: #cbd5e1;">Cấp độ: N${data.jlpt || '3'}</small>`;
        return;
      } catch (err) {}
    }

    // Japanese word fallback lookup
    phoEl.textContent = "Từ vựng tiếng Nhật JLPT";
    meanEl.innerHTML = `Chữ: <strong>${charOrWord}</strong>. Bạn có thể nhấn icon loa để nghe phát âm và bấm Lưu vào SRS.`;
  }

  // Furigana Toggle Engine (あ/漢)
  toggleFurigana() {
    this.furiganaHidden = !this.furiganaHidden;
    document.body.classList.toggle('furigana-hidden', this.furiganaHidden);
    return this.furiganaHidden;
  }
}

window.instantDictionary = new InstantDictionaryEngine();
