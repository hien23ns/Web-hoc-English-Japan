// TOEIC 650+ Master Knowledge Base (With Part 2 Blind Listening, Part 7 Clue Highlighting & Paraphrase Map)
window.TOEIC_DATA = {
  info: {
    track: "TOEIC",
    targetScore: "650+",
    totalDays: 60,
    dailyTimeMinutes: 25,
    description: "Lộ trình tối ưu hóa 60 ngày bứt phá TOEIC 650+ với chiến thuật né bẫy Part 5-6 và làm chủ từ khóa Part 1-4."
  },

  trapCategories: [
    { id: "word_form", name: "Bẫy từ loại (Noun/Adj/Adv/Verb)", count: 24, tip: "Xác định nhanh vị trí chỗ trống đứng sau mạo từ/giới từ hay bổ nghĩa cho động từ." },
    { id: "conj_prep", name: "Bẫy Liên từ vs Giới từ", count: 18, tip: "Liên từ (Although, Because) đi với Mệnh đề (S+V); Giới từ (Despite, Due to) đi với Cụm danh từ (N/V-ing)." },
    { id: "voice_tense", name: "Bẫy Thì & Thể Bị động", count: 15, tip: "Xem chủ ngữ là người hay vật thực hiện hành động, và kiểm tra tân ngữ phía sau động từ." },
    { id: "reduced_rel", name: "Mệnh đề quan hệ rút gọn (V-ing / V-ed)", count: 14, tip: "Rút gọn chủ động dùng V-ing, rút gọn bị động dùng V-ed (thường có 'by' hoặc không có tân ngữ)." },
    { id: "subjunctive", name: "Thể giả định (Require/Suggest that...)", count: 8, tip: "Sau động từ khuyên bảo/yêu cầu thì mệnh đề 'that' luôn dùng V nguyên mẫu không 'to'." },
    { id: "linking_sound", name: "Bẫy nối âm / Nuốt âm Part 1-4", count: 16, tip: "Âm cuối phụ âm nối với nguyên âm đầu từ tiếp theo (ví dụ: 'check in' đọc là 'che-kin')." },
    { id: "indirect_part2", name: "Bẫy Part 2 Trả lời Gián tiếp / Né tránh", count: 15, tip: "Câu hỏi tìm người chịu trách nhiệm nhưng đáp án trả lời: 'I just arrived today' hoặc 'Check the bulletin board'." }
  ],

  // Paraphrase Map Master Bank
  paraphraseBank: [
    { inPassage: "postpone the seminar", inOption: "reschedule the workshop", trapNote: "postpone = put off = reschedule = delay" },
    { inPassage: "mandatory attendance", inOption: "required to participate", trapNote: "mandatory = compulsory = required = obligatory" },
    { inPassage: "held annually", inOption: "takes place once a year", trapNote: "annually = yearly = once a year" },
    { inPassage: "submit original receipts", inOption: "provide proof of purchase", trapNote: "receipts = proof of purchase / payment vouchers" },
    { inPassage: "subsequent to the merger", inOption: "following the acquisition", trapNote: "subsequent to = after = following" },
    { inPassage: "renovate the cafeteria", inOption: "remodel the dining area", trapNote: "renovate = remodel = refurbish" }
  ],

  vocabBank: [
    {
      id: "t_v01",
      word: "accommodate",
      ipa: "/əˈkɑː.mə.deɪt/",
      pos: "v",
      meaningVi: "Đáp ứng (yêu cầu), chứa (số lượng người)",
      collocations: "accommodate the request / accommodate up to 500 guests",
      exampleEn: "The newly renovated conference hall can accommodate up to 600 participants.",
      exampleVi: "Hội trường vừa được tân trang có thể chứa được tới 600 người tham gia.",
      trapNote: "Hay bẫy nghĩa 'chứa người' vs 'đáp ứng nhu cầu/thay đổi' trong Part 7.",
      paraphrase: { original: "accommodate 600 guests", synonym: "has a maximum seating capacity of 600" }
    },
    {
      id: "t_v02",
      word: "comply with",
      ipa: "/kəmˈplaɪ wɪð/",
      pos: "v phrasal",
      meaningVi: "Tuân thủ (quy định, tiêu chuẩn an toàn)",
      collocations: "comply with safety regulations / comply with company policy",
      exampleEn: "All staff members are strictly required to comply with laboratory safety rules.",
      exampleVi: "Tất cả nhân viên được yêu cầu nghiêm ngặt phải tuân thủ các quy định an toàn phòng thí nghiệm.",
      trapNote: "Cực kỳ hay thi giới từ 'with' (comply with = adhere to = conform to = abide by).",
      paraphrase: { original: "comply with regulations", synonym: "follow safety standards strictly" }
    },
    {
      id: "t_v03",
      word: "mandatory",
      ipa: "/ˈmæn.də.tɔːr.i/",
      pos: "adj",
      meaningVi: "Bắt buộc",
      collocations: "mandatory attendance / mandatory orientation session",
      exampleEn: "Attendance at the quarterly compliance workshop is mandatory for all managerial staff.",
      exampleVi: "Việc tham dự buổi tập huấn tuân thủ hàng quý là bắt buộc đối với tất cả cán bộ quản lý.",
      trapNote: "Đồng nghĩa với 'compulsory', 'obligatory'; trái nghĩa với 'optional'.",
      paraphrase: { original: "attendance is mandatory", synonym: "all managers must participate" }
    },
    {
      id: "t_v04",
      word: "confidential",
      ipa: "/ˌkɑːn.fəˈden.ʃəl/",
      pos: "adj",
      meaningVi: "Bảo mật, tuyệt mật",
      collocations: "strictly confidential / confidential client records",
      exampleEn: "Please keep all financial statements strictly confidential until the official press release.",
      exampleVi: "Vui lòng giữ tất cả các báo cáo tài chính bảo mật tuyệt đối cho đến khi có thông cáo báo chí chính thức.",
      trapNote: "Tránh nhầm với 'confident' (tự tin).",
      paraphrase: { original: "keep confidential", synonym: "do not disclose to third parties" }
    },
    {
      id: "t_v05",
      word: "subsequent to",
      ipa: "/ˈsʌb.sɪ.kwənt tuː/",
      pos: "prep",
      meaningVi: "Sau khi (= after)",
      collocations: "subsequent to the merger / subsequent events",
      exampleEn: "Subsequent to the board meeting, an email was sent clarifying the budget cuts.",
      exampleVi: "Sau cuộc họp hội đồng quản trị, một email đã được gửi để làm rõ việc cắt giảm ngân sách.",
      trapNote: "Subsequent to = Following = After. Rất hay ra trong Part 5 kiểm tra giới từ.",
      paraphrase: { original: "subsequent to the meeting", synonym: "following the executive conference" }
    },
    {
      id: "t_v06",
      word: "eligible for",
      ipa: "/ˈel.ɪ.dʒə.bəl fɔːr/",
      pos: "adj",
      meaningVi: "Đủ điều kiện, đủ tiêu chuẩn nhận...",
      collocations: "eligible for promotion / eligible for a full refund",
      exampleEn: "Employees with over three years of service are eligible for annual performance bonuses.",
      exampleVi: "Nhân viên làm việc trên 3 năm đủ điều kiện nhận tiền thưởng hiệu suất hàng năm.",
      trapNote: "Đi với giới từ 'for' + Noun, hoặc 'to' + Verb (eligible to receive).",
      paraphrase: { original: "eligible for bonus", synonym: "qualified to receive financial rewards" }
    },
    {
      id: "t_v07",
      word: "prospective",
      ipa: "/prəˈspek.tɪv/",
      pos: "adj",
      meaningVi: "Tiềm năng, triển vọng",
      collocations: "prospective clients / prospective buyers / prospective employees",
      exampleEn: "The marketing director scheduled demonstrations for prospective corporate clients.",
      exampleVi: "Giám đốc tiếp thị đã lên lịch thuyết minh sản phẩm cho các khách hàng doanh nghiệp tiềm năng.",
      trapNote: "Hay bẫy với 'perspective' (góc nhìn, quan điểm).",
      paraphrase: { original: "prospective clients", synonym: "potential business partners" }
    },
    {
      id: "t_v08",
      word: "reimburse",
      ipa: "/ˌriː.ɪmˈbɝːs/",
      pos: "v",
      meaningVi: "Hoàn tiền, bồi hoàn chi phí",
      collocations: "reimburse travel expenses / reimburse in full",
      exampleEn: "The accounting department will reimburse your travel expenses upon submission of receipts.",
      exampleVi: "Phòng kế toán sẽ hoàn trả chi phí đi lại của bạn ngay sau khi nộp biên lai.",
      trapNote: "Danh từ là 'reimbursement'. Đi kèm cụm 'submit original receipts'.",
      paraphrase: { original: "reimburse expenses", synonym: "repay out-of-pocket costs" }
    }
  ],

  // Part 2 Blind Listening Questions (Audio Only -> Reveal on select)
  part2BlindBank: [
    {
      id: "t_p2_01",
      audioQuestion: "Who is in charge of ordering office supplies this month?",
      options: [
        "A. I've only been working here since Monday.",
        "B. Yes, the order was delivered yesterday.",
        "C. In the cabinet next to the printer."
      ],
      answer: 0,
      trapType: "Bẫy Part 2 Trả lời Gián tiếp / Né tránh",
      ruleVi: "Câu hỏi 'Who' (Ai chịu trách nhiệm) nhưng câu trả lời không đưa ra tên người, mà dùng câu né tránh: 'Tôi mới đi làm từ thứ Hai (nên tôi không biết)'."
    },
    {
      id: "t_p2_02",
      audioQuestion: "Has the client approved the final budget proposal yet?",
      options: [
        "A. About twenty miles away.",
        "B. Mr. Vance is reviewing it right now.",
        "C. It was very reasonably priced."
      ],
      answer: 1,
      trapType: "Bẫy Part 2 Hiện trạng chưa chốt",
      ruleVi: "Câu hỏi Yes/No nhưng đáp án né tránh 'Mr. Vance is reviewing it right now' (Sếp đang xem xét) -> Chưa được duyệt chính thức."
    },
    {
      id: "t_p2_03",
      audioQuestion: "Why don't we review the quarterly sales figures after lunch?",
      options: [
        "A. No, I prefer Italian food.",
        "B. That sounds like a good plan.",
        "C. It increased by ten percent."
      ],
      answer: 1,
      trapType: "Bẫy Why don't we (Lời mời / Đề nghị)",
      ruleVi: "'Why don't we...' là câu rủ rê/đề xuất hành động, không phải câu hỏi lý do (Why) -> Đáp lại bằng lời đồng thuận 'That sounds like a good plan'."
    }
  ],

  // Mini Part 7 Reading Passage with Clue Highlighting
  part7Passages: [
    {
      id: "t_p7_01",
      title: "Thông Báo Nội Bộ: Lịch Trình Di Dời Văn Phòng",
      passageHtml: `
        <strong>MEMORANDUM</strong><br>
        <strong>To:</strong> All Staff, Apex Financial<br>
        <strong>From:</strong> Facility Management Committee<br>
        <strong>Date:</strong> October 12<br>
        <strong>Subject:</strong> Office Relocation Update<br><br>
        Please note that our move to the new downtown headquarters has been rescheduled due to unforeseen flooring installations. <span class="passage-clue" data-clue="1">The relocation will now commence on Friday, November 14 instead of October 31.</span><br><br>
        All employees are required to pack personal belongings into the labeled cardboard containers provided in the hallway by 5:00 PM on Thursday, November 13. <span class="passage-clue" data-clue="2">Desktop computers and monitors will be disassembled and handled exclusively by our contracted IT moving team.</span>
      `,
      questions: [
        {
          q: "What is indicated about the office relocation?",
          options: [
            "It has been postponed until mid-November.",
            "It was cancelled due to budget cuts.",
            "It will take place over a long holiday.",
            "Employees must move their own computers."
          ],
          answer: 0,
          clueId: 1,
          paraphraseMap: [
            { original: "commence on Friday, November 14 instead of October 31", synonym: "postponed until mid-November" }
          ],
          explanationVi: "Đoạn văn ghi 'rescheduled... commence on Friday, November 14' = Hoãn tới giữa tháng 11 (postponed until mid-November)."
        },
        {
          q: "Who will transport the desktop equipment?",
          options: [
            "Individual desk owners",
            "A specialized technology moving crew",
            "The facility committee director",
            "Building maintenance staff"
          ],
          answer: 1,
          clueId: 2,
          paraphraseMap: [
            { original: "handled exclusively by our contracted IT moving team", synonym: "specialized technology moving crew" }
          ],
          explanationVi: "Câu cuối ghi 'handled exclusively by contracted IT moving team' = Đội ngũ chuyên về công nghệ (specialized technology moving crew)."
        }
      ]
    }
  ],

  grammarReflexBank: [
    {
      id: "t_q01",
      category: "conj_prep",
      question: "______ the severe weather conditions, the delivery trucks arrived at the warehouse on time.",
      options: ["Despite", "Although", "Because", "Even though"],
      answer: 0,
      trapType: "Bẫy Liên từ vs Giới từ",
      quickTip3s: "Nhìn sau chỗ trống: KHÔNG có động từ chia thì -> Loại ngay Although/Even though.",
      ruleVi: "Phía sau chỗ trống là cụm danh từ 'the severe weather conditions' -> cần giới từ chỉ sự nhượng bộ (Despite). Although và Even though phải đi với mệnh đề (S + V).",
      explanationVi: "Despite (+ Noun phrase) mang nghĩa 'Mặc dù'. Even though / Although (+ S + V). Chỗ trống không có động từ chính nên chỉ có 'Despite' là đáp án chính xác."
    },
    {
      id: "t_q02",
      category: "word_form",
      question: "Ms. Patel reviewed the proposal ______ before submitting it to the executive board.",
      options: ["thorough", "thoroughly", "thoroughness", "more thorough"],
      answer: 1,
      trapType: "Bẫy từ loại (Adv bổ nghĩa cho Verb)",
      quickTip3s: "Sau tân ngữ 'the proposal' bổ nghĩa cho động từ 'reviewed' -> Chọn trạng từ đuôi -ly.",
      ruleVi: "Vị trí đứng sau tân ngữ 'the proposal' bổ nghĩa cho động từ 'reviewed' -> cần một trạng từ (Adverb: -ly).",
      explanationVi: "Thoroughly (adv): một cách kỹ lưỡng. Động từ 'reviewed' cần trạng từ bổ nghĩa cho hành động xem xét."
    },
    {
      id: "t_q03",
      category: "reduced_rel",
      question: "The documents ______ by the legal department yesterday must be signed by 5:00 PM today.",
      options: ["reviewing", "reviewed", "reviews", "were reviewed"],
      answer: 1,
      trapType: "Mệnh đề quan hệ rút gọn bị động",
      quickTip3s: "Câu đã có động từ chính 'must be signed' -> Chỗ trống là rút gọn V-ed (bị động bởi legal department).",
      ruleVi: "Câu đã có động từ chính là 'must be signed'. Vị trí chỗ trống là mệnh đề quan hệ rút gọn thể bị động (which were reviewed -> reviewed).",
      explanationVi: "Tài liệu được xem xét bởi phòng pháp chế (bị động) -> dùng Past Participle (reviewed). Nếu chọn 'were reviewed' thì câu bị thừa động từ vị ngữ."
    },
    {
      id: "t_q04",
      category: "subjunctive",
      question: "The building supervisor requested that every tenant ______ their trash in the designated recycling bins.",
      options: ["places", "placed", "place", "has placed"],
      answer: 2,
      trapType: "Bẫy thể giả định (Subjunctive Mood)",
      quickTip3s: "Sau S + requested that + S + V-nguyên thể (không chia 's' dù tenant số ít).",
      ruleVi: "Cấu trúc giả định: S + request/suggest/recommend + that + S + (should) + V-nguyên thể.",
      explanationVi: "Sau 'requested that every tenant...', động từ phải ở dạng nguyên thể không 'to' (place), dù chủ ngữ là 'every tenant' số ít."
    },
    {
      id: "t_q05",
      category: "voice_tense",
      question: "By the time the keynote speaker finishes his speech, the catering staff ______ dessert for all attendees.",
      options: ["will have prepared", "prepared", "prepare", "were preparing"],
      answer: 0,
      trapType: "Bẫy thì tương lai hoàn thành (Future Perfect)",
      quickTip3s: "By the time + Hiện tại đơn -> Vế sau chọn Tương lai hoàn thành (will have + V3).",
      ruleVi: "By the time + S + V(hiện tại đơn), S + will have + V3/ed (hành động hoàn tất trước một thời điểm tương lai).",
      explanationVi: "'By the time speaker finishes...' kết hợp với Tương lai hoàn thành 'will have prepared' chỉ hành động chuẩn bị xong trước khi diễn giả nói xong."
    },
    {
      id: "t_q06",
      category: "word_form",
      question: "All ______ for the graphic design position should include a link to their digital portfolio.",
      options: ["applies", "applicants", "applications", "applicable"],
      answer: 1,
      trapType: "Bẫy danh từ chỉ Người vs Vật",
      quickTip3s: "Có 'their digital portfolio' (hồ sơ của họ) -> Chủ ngữ phải là người (Applicants).",
      ruleVi: "Sau 'All' cần danh từ số nhiều làm chủ ngữ. Người nộp đơn (applicants) mới đính kèm hồ sơ của họ (their digital portfolio).",
      explanationVi: "Applicants = người ứng tuyển (hợp nghĩa với 'their portfolio'). Applications = đơn xin việc (vật không thể tự include link của chính họ)."
    }
  ],

  dictationBank: [
    {
      id: "t_d01",
      audioText: "Please make sure to check in at the reception desk before entering the seminar hall.",
      keywords: ["check in", "reception desk", "seminar hall"],
      displayMask: "Please make sure to ______ ______ at the ______ ______ before entering the ______ ______.",
      translationVi: "Vui lòng nhớ làm thủ tục đăng ký tại quầy lễ tân trước khi vào hội trường hội thảo.",
      tipAudio: "Nối âm: 'check in' -> /tʃek.ɪn/, 'make sure to' -> /meɪk ʃʊr tə/."
    },
    {
      id: "t_d02",
      audioText: "Could you send me the revised financial spreadsheet by the end of the day?",
      keywords: ["revised", "financial", "spreadsheet"],
      displayMask: "Could you send me the ______ ______ ______ by the end of the day?",
      translationVi: "Bạn có thể gửi cho tôi bảng tính tài chính đã sửa đổi trước cuối ngày hôm nay không?",
      tipAudio: "Âm /d/ trong 'revised' nối liền với /f/ trong 'financial', 'spreadsheet' nhấn âm đầu."
    },
    {
      id: "t_d03",
      audioText: "The flight was delayed due to unexpected mechanical issues.",
      keywords: ["delayed", "unexpected", "mechanical issues"],
      displayMask: "The flight was ______ due to ______ ______ ______.",
      translationVi: "Chuyến bay đã bị hoãn do sự cố kỹ thuật ngoài dự kiến.",
      tipAudio: "'due to unexpected' đọc lướt nhanh, 'mechanical' phát âm /məˈkæn.ɪ.kəl/."
    }
  ],

  syllabus: [
    {
      day: 1,
      phase: 1,
      phaseTitle: "Nền Tảng Cốt Lõi & Từ Loại Part 5",
      title: "Nhận Diện Nhanh 4 Từ Loại (Noun, Adj, Adv, Verb)",
      vocabCount: 15,
      grammarFocus: "Hậu tố nhận diện danh từ (-tion, -ment, -ance) và tính từ (-ive, -able, -al)",
      listeningFocus: "Part 1: Bẫy tranh tả người và tranh tả vật (being + V3)",
      status: "unlocked",
      completed: true
    },
    {
      day: 2,
      phase: 1,
      phaseTitle: "Nền Tảng Cốt Lõi & Từ Loại Part 5",
      title: "Chủ Đề Hợp Đồng Thương Mại & Thỏa Thuận (Contracts)",
      vocabCount: 18,
      grammarFocus: "Cặp danh từ dễ nhầm lẫn: Applicant vs Application, Access vs Accessibility",
      listeningFocus: "Part 2: Phản xạ câu hỏi Who/Where/When và bẫy câu trả lời gián tiếp",
      status: "unlocked",
      completed: false
    },
    {
      day: 3,
      phase: 1,
      phaseTitle: "Nền Tảng Cốt Lõi & Từ Loại Part 5",
      title: "Liên Từ vs Giới Từ (Although vs Despite, Because vs Due to)",
      vocabCount: 15,
      grammarFocus: "Công thức phân biệt S+V vs Cụm Noun/V-ing chỉ trong 5 giây",
      listeningFocus: "Part 2: Bẫy lặp từ (same sound trap) & từ đồng âm khác nghĩa",
      status: "unlocked",
      completed: false
    },
    {
      day: 4,
      phase: 1,
      phaseTitle: "Nền Tảng Cốt Lõi & Từ Loại Part 5",
      title: "Chủ Đề Marketing & Chiến Dịch Quảng Cáo Khách Hàng",
      vocabCount: 20,
      grammarFocus: "Tính từ đuôi -ing (chỉ tính chất) vs -ed (chỉ cảm xúc)",
      listeningFocus: "Part 1: Bẫy động từ hành động đang diễn ra vs trạng thái có sẵn",
      status: "locked",
      completed: false
    },
    {
      day: 15,
      phase: 1,
      phaseTitle: "Nền Tảng Cốt Lõi & Từ Loại Part 5",
      title: "Mini-Test Đánh Giá 15 Ngày Đầu (Mục Tiêu 500+ Chạm Ngưỡng)",
      vocabCount: 30,
      grammarFocus: "Tổng ôn 50 câu Part 5 tốc độ cao (15 giây/câu)",
      listeningFocus: "Part 1-2 Full Test rút gọn (30 câu) không để sai bẫy cơ bản",
      status: "locked",
      completed: false
    },
    {
      day: 35,
      phase: 3,
      phaseTitle: "Tăng Tốc Đọc Hiểu & Nghe Hội Thoại Part 3-4",
      title: "Kỹ Thuật Đọc Skimming & Scanning Đoạn Văn Kép (Part 7 Double Passages)",
      vocabCount: 22,
      grammarFocus: "Đảo ngữ với phó từ phủ định (Not only, Rarely, Little did we know)",
      listeningFocus: "Part 4: Bài phát biểu, thông báo sân bay, tin nhắn thoại nội bộ",
      status: "locked",
      completed: false
    },
    {
      day: 60,
      phase: 4,
      phaseTitle: "Tổng Lực Đột Phá 650+ & Chống Liệt",
      title: "Tổng Duyệt Đề Thi Thật 200 Câu Tối Ưu Phân Bổ Thời Gian",
      vocabCount: 40,
      grammarFocus: "Chiến thuật chốt nhanh 30 câu Part 5 trong 12 phút",
      listeningFocus: "Part 1-4 tốc độ 1.1x rèn thần kinh thép phòng thi",
      status: "locked",
      completed: false
    }
  ]
};
