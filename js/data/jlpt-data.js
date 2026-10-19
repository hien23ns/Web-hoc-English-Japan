// JLPT N3 Master Knowledge Base (With Mondai 3 Star ★ Puzzles, Kanji Confusion Matrix & Dokkai)
window.JLPT_DATA = {
  info: {
    track: "JLPT",
    targetScore: "N3 Đỗ Cao (120+/180)",
    totalDays: 60,
    dailyTimeMinutes: 25,
    description: "Lộ trình 60 ngày chinh phục JLPT N3 với chiến lược né bẫy trợ từ, giải quyết triệt để kính ngữ và tăng tốc đọc hiểu."
  },

  trapCategories: [
    { id: "particles", name: "Bẫy Trợ từ (は/が, に/で, を/に)", count: 22, tip: "Trợ từ quyết định toàn bộ sắc thái câu. Ví dụ: に chỉ đích đến/thời điểm cụ thể, で chỉ phương tiện/địa điểm hành động." },
    { id: "similar_grammar", name: "Cặp Ngữ pháp Dễ Nhầm (わけがない vs わけではない)", count: 20, tip: "わけがない = 'tuyệt đối không thể', わけではない = 'không hẳn là/không phải là'." },
    { id: "keigo_passive", name: "Kính ngữ & Bị động sai khiến (~させられる)", count: 16, tip: "Kính ngữ (お/ご〜になる) tôn người nghe/người thứ 3; Khiêm nhường ngữ (お/ご〜する, 申す, 参る) hạ mình." },
    { id: "kanji_nuance", name: "Kanji Đồng âm khác nghĩa & Ma trận giống nhau", count: 18, tip: "Phân biệt các chữ Hán có bộ thủ giống nhau dễ nhầm như 待 - 持 - 侍 - 特." },
    { id: "star_puzzle", name: "Mondai 3 Dấu Sao (★) Sắp xếp câu", count: 15, tip: "Ghép từng cặp từ phụ thuộc (Trợ từ + Danh từ / Thể thông thường + Danh từ) rồi mới xác định vị trí dấu sao." }
  ],

  // Kanji Look-alike Confusion Matrix
  kanjiConfusionMatrix: {
    "待": [
      { kanji: "待", furigana: "まつ", hanViet: "ĐÃI", meaning: "Chờ đợi (招待 - chiêu đãi / 待ち合わせ)", tip: "Có bộ Xích 彳(bước chân đi)" },
      { kanji: "持", furigana: "もつ", hanViet: "TRÌ", meaning: "Cầm, duy trì (支持 - ủng hộ)", tip: "Có bộ Thủ 扌(bàn tay cầm nắm)" },
      { kanji: "侍", furigana: "さむらい", hanViet: "THỊ", meaning: "Võ sĩ Samurai", tip: "Có bộ Nhân đứng 亻(người)" },
      { kanji: "特", furigana: "とく", hanViet: "ĐẶC", meaning: "Đặc biệt (特別)", tip: "Có bộ Ngưu 牜(con trâu)" }
    ],
    "経": [
      { kanji: "経", furigana: "へる", hanViet: "KINH", meaning: "Trải qua, kinh tế (経済 - kinh tế / 経験)", tip: "Có bộ Mịch 糸 (sợi tơ)" },
      { kanji: "軽", furigana: "かるい", hanViet: "KHINH", meaning: "Nhẹ, coi nhẹ (気軽に)", tip: "Có bộ Xa 車 (xe cộ)" },
      { kanji: "径", furigana: "みち", hanViet: "KÍNH", meaning: "Đường kính (半径 - bán kính)", tip: "Có bộ Xích 彳" }
    ],
    "備": [
      { kanji: "備", furigana: "そなえる", hanViet: "BỊ", meaning: "Trang bị, phòng bị (準備, 設備)", tip: "Có bộ Thảo 艹 phía trên Thổ" },
      { kanji: "准", furigana: "じゅん", hanViet: "CHUẨN", meaning: "Phê chuẩn (批准)", tip: "Có bộ Băng 冫 (hai giọt nước)" }
    ],
    "割": [
      { kanji: "割", furigana: "わる", hanViet: "CÁT", meaning: "Chia nhỏ, giảm giá (割引)", tip: "Có bộ Đao 刂(con dao cắt)" },
      { kanji: "害", furigana: "がい", hanViet: "HẠI", meaning: "Tổn hại, nguy hiểm (公害, 被害)", tip: "Có bộ Miên 宀 và Khẩu 口" }
    ]
  },

  // Mondai 3 Star Puzzle (★) Bank
  starPuzzleBank: [
    {
      id: "j_star_01",
      sentenceLead: "どんなに ______  ______  __★__  ______ 、決して諦めないつもりです。",
      sentenceTail: "、決して諦めないつもりです。",
      fragments: [
        { id: 1, text: "困難な" },
        { id: 2, text: "ことが" },
        { id: 3, text: "あろうとも" },
        { id: 4, text: "状況で" }
      ],
      correctOrder: [1, 4, 2, 3], // どんなに [困難な] [状況で] ★[ことが] [あろうとも]
      starIndex: 2, // Fragment id: 2 ('ことが') is at the 3rd blank (Star position)
      starAnswerText: "ことが",
      trapType: "Mondai 3 Dấu Sao (★) - Cấu trúc どんなに〜うとも",
      ruleVi: "Cấu trúc 'どんなに + [Tính từ -na / Danh từ] であろうとも' -> Ghép: どんなに 困難な(1) 状況で(4) ★ことが(2) あろうとも(3).",
      explanationVi: "Vị trí dấu sao ★ là vị trí số 3 trong dãy 4 chỗ trống. Thứ tự hoàn chỉnh: 1 -> 4 -> 2 -> 3. Mảnh ghép ở dấu sao là 'ことが'."
    },
    {
      id: "j_star_02",
      sentenceLead: "健康のためには、 ______  ______  __★__  ______ ことが大切だと言われている。",
      sentenceTail: "ことが大切だと言われている。",
      fragments: [
        { id: 1, text: "運動を" },
        { id: 2, text: "毎日" },
        { id: 3, text: "少しずつでも" },
        { id: 4, text: "続ける" }
      ],
      correctOrder: [2, 3, 1, 4], // [毎日] [少しずつでも] ★[運動を] [続ける] こと
      starIndex: 1, // Fragment id: 1 ('運動を') is at the 3rd blank
      starAnswerText: "運動を",
      trapType: "Mondai 3 Dấu Sao (★) - Trợ từ và Động từ vị ngữ",
      ruleVi: "Thứ tự hợp logic nghĩa: [毎日] [少しずつでも] [運動を] [続ける] こと -> Dấu sao ★ ở vị trí số 3 là '運動を'.",
      explanationVi: "Ghép phó từ '毎日少しずつでも' bổ nghĩa cho hành động '運動を続ける'. Vị trí dấu sao là mảnh ghép số 1 (運動を)."
    }
  ],

  // Short Dokkai (Đọc hiểu N3 ngắn) with clue highlighting
  dokkaiPassages: [
    {
      id: "j_dokkai_01",
      title: "Thông Báo Quản Lý Tòa Nhà (マンションの掲示板)",
      passageHtml: `
        <strong>【全住民の皆様へ：定期配管清掃のお知らせ】</strong><br><br>
        下記の日程におきまして、排水管の定期高圧洗浄作業を実施いたします。<br>
        作業中は、一時的に断水となり、台所やお風呂場の水道はご使用いただけません。<br><br>
        <span class="passage-clue" data-clue="1">各戸の室内に入って点検を行いますので、作業時間帯は必ずご在宅いただきますようお願いいたします。</span><br>
        万が一、当日ご都合がつかない場合は、<span class="passage-clue" data-clue="2">前日正午までに管理事務所へご連絡の上、予備日（来週火曜）への変更手続きを行ってください。</span>
      `,
      questions: [
        {
          q: "清掃の当日、住民は何をしなければなりませんか。",
          options: [
            "部屋の中にいて作業に立ち会わなければならない。",
            "前日までに水道代を管理事務所へ支払わなければならない。",
            "作業中は台所でお湯を沸かしておかなければならない。",
            "事前に管理事務所へ行って予備日を予約しなければならない。"
          ],
          answer: 0,
          clueId: 1,
          explanationVi: "Đoạn văn ghi rõ: '各戸の室内に入って点検... 必ずご在宅いただきますよう' = Bắt buộc phải có mặt ở nhà (部屋の中にいて立ち会う)."
        }
      ]
    }
  ],

  vocabBank: [
    {
      id: "j_v01",
      kanji: "問い合わせる",
      furigana: "といあわせる",
      romaji: "toiawaseru",
      hanViet: "VẤN HỢP",
      pos: "v",
      meaningVi: "Hỏi thăm, liên hệ hỏi thông tin",
      collocations: "詳細をメールで問い合わせる (Hỏi chi tiết qua email)",
      exampleJp: "サービスの詳細については、カスタマーサポートへ直接お問い合わせください。",
      exampleVi: "Về chi tiết dịch vụ, xin quý khách vui lòng liên hệ trực tiếp đến bộ phận hỗ trợ khách hàng.",
      trapNote: "Rất hay gặp trong bài đọc thông báo tuyển dụng và email công việc (dạng lịch sự: お問い合わせください).",
      lookAlikes: ["問い (câu hỏi)", "合 (hợp)"]
    },
    {
      id: "j_v02",
      kanji: "思い切って",
      furigana: "おもいきって",
      romaji: "omoikitte",
      hanViet: "TƯ THIẾT",
      pos: "adv",
      meaningVi: "Quyết tâm, dứt khoát làm điều gì đó",
      collocations: "思い切って転職する (Dứt khoát chuyển việc)",
      exampleJp: "ずっとやりたかったことなので、思い切って自分の会社を立ち上げました。",
      exampleVi: "Vì đó là điều tôi luôn muốn làm, nên tôi đã quyết tâm dứt khoát thành lập công ty riêng.",
      trapNote: "Tránh nhầm với '思い付く' (chợt nảy ra ý tưởng) hoặc '思いやる' (thông cảm/quan tâm)."
    },
    {
      id: "j_v03",
      kanji: "慌てる",
      furigana: "あわてる",
      romaji: "awateru",
      hanViet: "HOẢNG",
      pos: "v",
      meaningVi: "Hốt hoảng, cuống cuồng, vội vàng",
      collocations: "慌てて家を出る (Cuống cuồng chạy ra khỏi nhà)",
      exampleJp: "地震が起きても、慌てて外に飛び出さないでください。",
      exampleVi: "Ngay cả khi có động đất, xin đừng hốt hoảng lao vội ra ngoài.",
      trapNote: "Chữ Hoảng (慌: có tâm đứng 忄). Tránh nhầm với '焦る' (aseru - sốt ruột vì thiếu thời gian)."
    },
    {
      id: "j_v04",
      kanji: "たまたま",
      furigana: "たまたま",
      romaji: "tamatama",
      hanViet: "Phó từ",
      pos: "adv",
      meaningVi: "Tình cờ, ngẫu nhiên",
      collocations: "たまたま駅で見かける (Tình cờ thấy ở ga)",
      exampleJp: "昨日、駅前のカフェでたまたま高校時代の親友と再会しました。",
      exampleVi: "Hôm qua ở quán cà phê trước ga, tôi tình cờ gặp lại người bạn thân thời cấp ba.",
      trapNote: "Đồng nghĩa với '偶然' (guuzen). Tránh nhầm với '時々' (tokidoki - thỉnh thoảng)."
    },
    {
      id: "j_v05",
      kanji: "遠慮する",
      furigana: "えんりょする",
      romaji: "enryo suru",
      hanViet: "VIỄN LỰ",
      pos: "v",
      meaningVi: "Ngại ngùng, khách khí, kiêng dè, xin phép từ chối",
      collocations: "遠慮なくどうぞ (Xin cứ tự nhiên đừng ngại)",
      exampleJp: "何か分からないことがあれば、遠慮なく質問してください。",
      exampleVi: "Nếu có điều gì chưa hiểu, xin hãy cứ tự nhiên đặt câu hỏi đừng ngại.",
      trapNote: "Cụm '遠慮なく' xuất hiện liên tục trong bài nghe Mondai 1 và kính ngữ giao tiếp."
    },
    {
      id: "j_v06",
      kanji: "延期する",
      furigana: "えんきする",
      romaji: "enki suru",
      hanViet: "DUYÊN KỲ",
      pos: "v",
      meaningVi: "Hoãn lại (lùi thời gian sang ngày khác)",
      collocations: "試合を来週に延期する (Hoãn trận đấu sang tuần sau)",
      exampleJp: "大雨のため、予定されていた運動会は来週の日曜日に延期となりました。",
      exampleVi: "Do mưa lớn, đại hội thể thao theo dự định đã bị hoãn sang chủ nhật tuần tới.",
      trapNote: "Chữ Duyên (延: kéo dài). Phân biệt với '中止' (chuushi - hủy bỏ hoàn toàn không tổ chức nữa)."
    }
  ],

  grammarReflexBank: [
    {
      id: "j_q01",
      category: "similar_grammar",
      question: "あんなに真面目な田中さんが、会社の機密情報を漏らす______。",
      options: ["わけがない", "わけではない", "ことになった", "ばかりだ"],
      answer: 0,
      trapType: "わけがない vs わけではない",
      quickTip3s: "Người nghiêm túc như Tanaka -> 'Tuyệt đối không thể có chuyện làm lộ' = わけがない.",
      formulaJp: "V-thường + わけがない (Tuyệt đối không thể nào...)",
      ruleVi: "'わけがない' biểu thị sự phủ định tuyệt đối dựa trên căn cứ rõ ràng (Người nghiêm túc như anh Tanaka thì KHÔNG THỂ NÀO làm lộ thông tin).",
      explanationVi: "田中さん rất nghiêm túc, nên việc cố ý tiết lộ bí mật là điều 'tuyệt đối không có chuyện đó' -> Chọn わけがない. Còn わけではない chỉ là 'không hẳn là'."
    },
    {
      id: "j_q02",
      category: "similar_grammar",
      question: "兄は社交的で友達が多いの______、弟は物静かで読書を好む。",
      options: ["に対して", "に関して", "について", "にとって"],
      answer: 0,
      trapType: "〜に対して vs 〜に関して",
      quickTip3s: "Hai vế so sánh tương phản (Anh năng động <-> Em trầm tính) -> Chọn 〜に対して.",
      formulaJp: "N / Mệnh đề + の + に対して (Trái ngược với / Đối lập với A thì B...)",
      ruleVi: "Dùng để so sánh sự đối lập tương phản giữa hai chủ thể (Anh hướng ngoại đối lập với em trầm tính).",
      explanationVi: "'〜に対して' diễn tả sự tương phản (Trong khi anh trai... thì em trai...). '〜に関して' mang nghĩa 'về vấn đề gì đó' (giống について nhưng trang trọng hơn)."
    },
    {
      id: "j_q03",
      category: "particles",
      question: "祖母は毎朝、近所の公園______散歩するのが日課です。",
      options: ["を", "に", "で", "へ"],
      answer: 0,
      trapType: "Bẫy Trợ từ chuyển động (〜を散歩する)",
      quickTip3s: "Động từ di chuyển trong không gian (散歩する, 歩く, 渡る) -> Luôn dùng trợ từ を.",
      formulaJp: "Địa điểm + を + Động từ di chuyển (散歩する, 走る, 渡る, 飛ぶ)",
      ruleVi: "Khi đi qua, dạo quanh một không gian hoặc băng qua địa điểm, dùng trợ từ 'を', KHÔNG dùng 'で'!",
      explanationVi: "Rất nhiều người nhầm 'ở công viên' chọn で. Nhưng với các động từ di chuyển trong không gian (散歩する, 歩く, 通る), tiếng Nhật chuẩn quy định dùng trợ từ を."
    },
    {
      id: "j_q04",
      category: "similar_grammar",
      question: "この古いアルバムを見る______、子供の頃の懐かしい思い出が蘇る。",
      options: ["たびに", "ついでに", "とたんに", "あいだに"],
      answer: 0,
      trapType: "〜たびに (Cứ mỗi lần...)",
      quickTip3s: "Cứ mỗi lần làm A thì cảm xúc B lại lặp lại -> Dùng たびに.",
      formulaJp: "V-ru / N + の + たびに (Cứ mỗi lần A thì lại B)",
      ruleVi: "Diễn tả hành động cứ lặp lại A thì luôn kéo theo cảm xúc hoặc hệ quả B lặp lại tương tự.",
      explanationVi: "'Cứ mỗi lần nhìn cuốn album này là kỷ niệm tuổi thơ ùa về' -> Dùng たびに. 'ついでに' là nhân tiện; 'とたんに' là vừa mới... thì ngay lập tức."
    },
    {
      id: "j_q05",
      category: "keigo_passive",
      question: "部長、先週お願いいたしました資料を、ただいまメールにて______。",
      options: ["お送りいたしました", "お送りになられました", "送ってあげました", "ご送付されました"],
      answer: 0,
      trapType: "Khiêm nhường ngữ (Kenjougo)",
      quickTip3s: "Mình gửi cho sếp -> Dùng khiêm nhường ngữ: お + V + いたし/しまし.",
      formulaJp: "お + V-bỏ-masu + いたす / する (Hành động của bản thân gửi cho sếp)",
      ruleVi: "Hành động của bản thân người nói (tôi gửi cho trưởng phòng) phải dùng KHIÊM NHƯỜNG NGỮ để thể hiện sự tôn trọng.",
      explanationVi: "'お送りいたしました' là khiêm nhường ngữ chuẩn. Phương án 'お送りになられました' là tôn kính ngữ (dùng cho hành động của sếp, không dùng cho mình)."
    }
  ],

  dictationBank: [
    {
      id: "j_d01",
      audioText: "会議の資料は明日までに全部コピーしておいてね。",
      keywords: ["資料", "明日までに", "コピーしておいて"],
      displayMask: "会議の______は______までに全部______ね。",
      translationVi: "Tài liệu cuộc họp nhớ photocopy sẵn trước ngày mai nhé.",
      tipAudio: "Văn nói: '〜しておいて' thường được rút gọn thành '〜しといて' trong giao tiếp tự nhiên."
    },
    {
      id: "j_d02",
      audioText: "何か分からないことがあれば、遠慮なく質問してください。",
      keywords: ["分からないこと", "遠慮なく", "質問して"],
      displayMask: "何か______があれば、______質問してください。",
      translationVi: "Nếu có điều gì không hiểu, xin đừng ngại đặt câu hỏi nhé.",
      tipAudio: "Cụm '遠慮なく' phát âm trôi chảy /en-ryo-naku/, ngữ điệu lịch sự nhẹ nhàng."
    }
  ],

  syllabus: [
    {
      day: 1,
      phase: 1,
      phaseTitle: "100 Kanji Cốt Lõi & Ngữ Pháp N3 Cơ Bản",
      title: "Chinh Phục Kanji Chủ Đề Kinh Tế & Đời Sống (経, 済, 備, 割)",
      vocabCount: 15,
      grammarFocus: "Cặp so sánh: 〜に対して vs 〜に関して / 〜について",
      listeningFocus: "Mondai 1: Kỹ năng nghe hiểu chủ đề và tóm tắt hành động tiếp theo",
      status: "unlocked",
      completed: true
    },
    {
      day: 2,
      phase: 1,
      phaseTitle: "100 Kanji Cốt Lõi & Ngữ Pháp N3 Cơ Bản",
      title: "Phân Biệt Cặp Ngữ Pháp Phủ Định (わけがない vs わけではない)",
      vocabCount: 16,
      grammarFocus: "Sự khác biệt giữa phủ định 100% và phủ định một phần",
      listeningFocus: "Mondai 2: Bắt từ khóa chi tiết (Số điện thoại, địa điểm, thứ tự ưu tiên)",
      status: "unlocked",
      completed: false
    },
    {
      day: 3,
      phase: 1,
      phaseTitle: "100 Kanji Cốt Lõi & Ngữ Pháp N3 Cơ Bản",
      title: "Kanji Chủ Đề Giao Thông & Phương Tiện (届, 替, 停, 乗)",
      vocabCount: 18,
      grammarFocus: "Mẫu câu lặp lại theo chu kỳ: 〜たびに / 〜ごとに",
      listeningFocus: "Phản xạ câu hỏi ngắn Mondai 4: Đáp lời tình huống hàng ngày",
      status: "unlocked",
      completed: false
    },
    {
      day: 15,
      phase: 1,
      phaseTitle: "100 Kanji Cốt Lõi & Ngữ Pháp N3 Cơ Bản",
      title: "Đánh Giá Giai Đoạn 1: 50 Mẫu Ngữ Pháp N3 Tần Suất Xuất Hiện Cao Nhất",
      vocabCount: 25,
      grammarFocus: "Xử lý tốc độ câu hỏi Mondai 1-2 Từ vựng chữ Hán trong 8 phút",
      listeningFocus: "Mondai 1-3 tốc độ người bản xứ 1.0x",
      status: "locked",
      completed: false
    },
    {
      day: 35,
      phase: 3,
      phaseTitle: "Kính Ngữ Thực Chiến & Tăng Tốc Đọc Hiểu N3",
      title: "Bảng So Sánh Kính Ngữ Đặc Biệt (いらっしゃる, おっしゃる, 申す, 参る)",
      vocabCount: 22,
      grammarFocus: "Phương pháp loại trừ phương án sai trong câu hỏi kính ngữ Mondai 3",
      listeningFocus: "Mondai 4 câu ứng đáp nhanh (即時応答) với kính ngữ khó",
      status: "locked",
      completed: false
    },
    {
      day: 60,
      phase: 4,
      phaseTitle: "Tổng Lực Về Đích 120+ N3 Chống Trượt",
      title: "Mô Phỏng 100% Đề Thi Thật N3 Với Đồng Hồ Đếm Ngược Nghiêm Ngặt",
      vocabCount: 40,
      grammarFocus: "Chiến thuật làm bài đọc hiểu trường văn và tìm kiếm thông tin trong 10 phút",
      listeningFocus: "Trọn bộ Nghe hiểu N3 chuông thi chính thức",
      status: "locked",
      completed: false
    }
  ]
};
