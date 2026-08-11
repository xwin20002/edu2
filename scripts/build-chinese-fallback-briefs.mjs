import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async file => JSON.parse(await readFile(path.join(root, file), "utf8"));
const legacyIntake = await readJson("data/content-intake/chinese-hanlin-114.json");
const targetOutline = await readJson("data/content-intake/chinese-hanlin-115.json");
const legacyBySequence = new Map(legacyIntake.units.map(unit => [unit.sequence, unit]));
const targetBySequence = new Map(targetOutline.units.map((unit, index) => [index + 1, unit]));

const shared = {
  acceptedAcademicYearRange: [113, 115],
  sourceRefs: [
    "hanlin-115-low-primary-promo",
    "ptc-114-hanlin-grade2-chinese-plan",
    "education-cloud-hanlin-114-wordbank"
  ],
  sourceStatus: "fallback-brief-approved-cross-year-user-accepted",
  artifact: {notebooklm: "pending-shared-stage-2", youtube: "pending-shared-stage-2"}
};

const configs = [
  {
    n: 2,
    signals: ["聆聽後參與討論並提出意見", "用完整句回答問題並重述順序", "使用短語與句型表達"],
    focus: "找出事情的先後順序，使用完整句重述觀察與感受。",
    mission: "完成「一開始／接著／最後」三段重述，讓同學聽懂事情怎麼發展。",
    vocab: [["老師", "在學校帶領大家學習的人。"], ["希望", "心裡期待某件事情發生。"], ["緊張", "擔心自己做不好時，心裡不安的感覺。"]],
    chars: [["老", "ㄌㄠˇ"], ["師", "ㄕ"], ["新", "ㄒㄧㄣ"], ["希", "ㄒㄧ"], ["望", "ㄨㄤˋ"], ["緊", "ㄐㄧㄣˇ"]],
    readingTitle: "原創閱讀｜窗外的顏色",
    paragraphs: [
      "美術課前，老師請大家先看看窗外的天空。",
      "一開始，遠處有一大片灰色的雲，我有一點擔心會下雨。",
      "接著，陽光從雲旁露出來，天空慢慢亮了。",
      "最後，我把看到的顏色依順序畫下來，也說出自己的心情。"
    ],
    questions: [
      ["老師請大家先做什麼？", "看看窗外的天空", "立刻收起畫紙", "跑到操場比賽", "閉上眼睛睡覺"],
      ["天空接著有什麼變化？", "陽光從雲旁露出來", "所有顏色都消失", "教室突然停電", "天空變成晚上"],
      ["哪組詞最能幫助重述順序？", "一開始、接著、最後", "也許、可能、大概", "大小、多少、長短", "這裡、那裡、哪裡"]
    ],
    workshop: {title: "順序三段句", instruction: "依序選出三個片段，再朗讀成一段完整的重述。", slots: [["begin", "一開始", ["我先觀察窗外", "我先聽清楚任務", "我先整理畫具"]], ["next", "接著", ["我記錄看見的顏色", "我和同學交換發現", "我用完整句說明"]], ["last", "最後", ["我依順序分享", "我檢查有沒有漏掉", "我說出自己的心情"]]], template: "一開始，{begin}；接著，{next}；最後，{last}。"},
    teacherNotes: ["先請學生指認原創短文中的順序詞，再進行口頭重述。", "若學生只說單詞，提示補上人物、動作與結果。", "評量重點是順序清楚，不要求和範例句完全相同。"]
  },
  {
    n: 3,
    signals: ["用完整句回答並重述故事", "利用故事結構協助理解", "辨識情緒並適切表達"],
    focus: "找出故事中的人物、問題、行動與結果，練習有順序地重述。",
    mission: "用四張故事卡說清楚：誰遇到什麼問題、做了什麼、結果如何。",
    vocab: [["國王", "國家的君主；本課只作公開詞彙練習。"], ["發現", "經過觀察或思考後知道原先不知道的事。"], ["分享", "把自己的想法或經驗告訴別人。"]],
    chars: [["國", "ㄍㄨㄛˊ"], ["王", "ㄨㄤˊ"], ["喜", "ㄒㄧˇ"], ["歡", "ㄏㄨㄢ"], ["分", "ㄈㄣ"], ["享", "ㄒㄧㄤˇ"]],
    readingTitle: "原創改編閱讀｜國王的新衣",
    useExistingAdaptation: true,
    workshop: {title: "故事四格重述", instruction: "選擇人物、問題、行動與結果，組成一段完整故事。", slots: [["character", "人物", ["國王", "大臣", "說真話的小朋友"]], ["problem", "問題", ["大家不敢說出真相", "有人假裝做出奇特的布", "人們擔心被笑不聰明"]], ["action", "行動", ["小朋友說出看到的事實", "國王停下來重新想一想", "大家開始誠實交談"]], ["result", "結果", ["真相終於被大家知道", "人們學會勇敢說實話", "國王感謝誠實的提醒"]]], template: "故事中的{character}遇到的問題是{problem}；後來{action}，結果{result}。"},
    teacherNotes: ["本區使用公共領域童話的 edu2 原創改寫，不對照或重述翰林課文。", "引導學生區分『看見的事實』與『因害怕而跟著說的話』。", "接受不同重述，只要人物、問題、行動與結果能互相連接。"]
  },
  {
    n: 4,
    signals: ["找出詩歌重點", "透過感官觀察大自然", "運用簡單句型表達"],
    focus: "分清楚感官觀察與自己的推測，用證據描述自然現象。",
    mission: "完成「我聽見／我看見／我推測」觀察句，並說出推測依據。",
    vocab: [["呱呱", "模擬蛙類叫聲的詞。"], ["靠近", "向某個人或地方移動得更近。"], ["證明", "用事實或證據說明一件事。"]],
    chars: [["呱", "ㄍㄨㄚ"], ["聞", "ㄨㄣˊ"], ["聲", "ㄕㄥ"], ["猜", "ㄘㄞ"], ["蛙", "ㄨㄚ"], ["靠", "ㄎㄠˋ"]],
    readingTitle: "原創閱讀｜池邊的聲音",
    paragraphs: [
      "傍晚，我和老師站在池塘旁的步道上觀察。",
      "我先聽見草叢傳來兩聲「呱呱」，但還沒有看見動物。",
      "我猜聲音可能來自青蛙，又發現水草輕輕搖動。",
      "老師提醒我保持距離，只記錄證據，不伸手抓小動物。"
    ],
    questions: [
      ["哪一句是確定的觀察？", "草叢傳來兩聲呱呱", "一定有十隻青蛙", "青蛙想跟我說話", "池塘裡沒有動物"],
      ["「我」為什麼猜聲音可能來自青蛙？", "聽見呱呱聲並看見水草搖動", "老師已經抓到青蛙", "天空突然下起大雨", "同學說一定是小鳥"],
      ["觀察池邊動物時，哪個做法合宜？", "保持距離並記錄證據", "伸手進水草抓動物", "丟石頭測試聲音", "踩進池塘看清楚"]
    ],
    workshop: {title: "觀察與推測句", instruction: "先說感官證據，再說推測；不要把猜想當成事實。", slots: [["sense", "我用感官發現", ["我聽見兩聲呱呱", "我看見水草搖動", "我看見水面出現波紋"]], ["guess", "我的推測", ["附近可能有小動物", "聲音可能來自草叢", "水下可能有東西移動"]], ["check", "核對方法", ["保持距離再觀察", "請老師一起確認", "把不同時間的紀錄比較"]]], template: "{sense}；我推測{guess}，可以{check}。"},
    teacherNotes: ["要求學生先用『我看見／我聽見』描述，再使用『可能』提出推測。", "自然觀察不以抓取或驚擾動物換取答案。", "朗讀時可比較『呱呱』擬聲詞的節奏與語氣。"]
  },
  {
    n: 5,
    signals: ["聽出故事重點並說出大意", "使用順敘法", "運用字詞仿寫句子"],
    focus: "依照先後順序說出觀察過程，並用原因與結果連接句子。",
    mission: "用「因為……所以……」解釋沙灘上的一項發現。",
    vocab: [["沙灘", "海邊由沙粒形成的地面。"], ["腳印", "腳踩過後留下的形狀。"], ["夕陽", "傍晚接近地平線的太陽。"]],
    chars: [["沙", "ㄕㄚ"], ["灘", "ㄊㄢ"], ["海", "ㄏㄞˇ"], ["邊", "ㄅㄧㄢ"], ["蟹", "ㄒㄧㄝˋ"], ["印", "ㄧㄣˋ"]],
    readingTitle: "原創閱讀｜會改變的畫",
    paragraphs: [
      "傍晚，我在安全的沙地上畫了一條長長的魚。",
      "海風吹過，細沙慢慢蓋住魚尾，畫變得不一樣了。",
      "接著，一串小腳印穿過魚身，我蹲下來仔細觀察。",
      "我把變化畫進紀錄本，明白自然也會一起完成這幅畫。"
    ],
    questions: [
      ["什麼先讓魚尾變得不清楚？", "海風吹動細沙", "有人倒了一桶水", "螃蟹拿走畫筆", "太陽突然不見"],
      ["「我」看到腳印後怎麼做？", "蹲下來仔細觀察", "立刻把腳印擦掉", "追著小動物跑", "離開沙灘不記錄"],
      ["原創短文中的畫為什麼會改變？", "風和腳印都留下影響", "畫筆自己會移動", "所有沙灘都一樣", "因為天色很亮"]
    ],
    workshop: {title: "因果觀察句", instruction: "選擇一個原因、一個變化與一項紀錄，說明你看到的過程。", slots: [["cause", "原因", ["海風吹動細沙", "小腳印穿過圖案", "潮水慢慢靠近"]], ["effect", "結果", ["線條變得比較淡", "圖案多了新的痕跡", "沙地的形狀改變了"]], ["record", "我的做法", ["我把先後順序畫下來", "我用完整句記錄", "我和同學比較發現"]]], template: "因為{cause}，所以{effect}；接著{record}。"},
    teacherNotes: ["只使用原創短文練習因果，不要求學生回想出版社課文情節。", "提醒學生在安全範圍觀察，不追逐或碰觸海邊生物。", "可讓學生把同一事件改寫成『先……接著……最後……』。"]
  },
  {
    n: 6,
    signals: ["專心聽出故事重點", "利用基本句型完成句子", "使用仿寫與接寫技巧"],
    focus: "把自然觀察寫成有時間、地點、發現與感受的短日記。",
    mission: "完成四格觀察日記：什麼時候、在哪裡、看見什麼、心裡怎麼想。",
    vocab: [["草叢", "草長得密集的一片地方。"], ["散步", "用輕鬆的速度走路。"], ["眼睛", "用來觀看外界事物的器官。"]],
    chars: [["月", "ㄩㄝˋ"], ["晚", "ㄨㄢˇ"], ["飯", "ㄈㄢˋ"], ["散", "ㄙㄢˋ"], ["林", "ㄌㄧㄣˊ"], ["顆", "ㄎㄜ"]],
    readingTitle: "原創閱讀｜晚上的小光點",
    paragraphs: [
      "星期五晚上，我和家人在社區步道散步。",
      "走到草叢旁，我看見葉子上有幾個小光點。",
      "我靠近安全的步道邊觀察，發現那是路燈照在露珠上的光。",
      "回家後，我把時間、地點、發現和驚喜的心情寫進日記。"
    ],
    questions: [
      ["「我」在哪裡看見小光點？", "社區步道旁的草叢", "教室裡的黑板", "商店裡的冰箱", "海邊的船上"],
      ["小光點其實是什麼？", "路燈照在露珠上的光", "會飛的小星星", "草叢裡的玩具燈", "天空掉下來的月亮"],
      ["一篇清楚的觀察日記應包含什麼？", "時間、地點、發現與感受", "只有日期沒有事件", "只寫自己的猜測", "抄下別人的答案"]
    ],
    workshop: {title: "四格觀察日記", instruction: "選好四格資訊，先口頭朗讀，再改寫成自己的日記。", slots: [["time", "時間", ["星期五晚上", "今天放學後", "週末清晨"]], ["place", "地點", ["社區步道旁", "校園花圃邊", "公園樹下"]], ["finding", "發現", ["葉子上有小光點", "地面出現長影子", "風讓枝葉發出聲音"]], ["feeling", "感受", ["我覺得驚喜", "我覺得好奇", "我想繼續觀察"]]], template: "{time}，我在{place}觀察。我發現{finding}，{feeling}。"},
    teacherNotes: ["讓學生先分清楚『看見的』與『猜想的』，再補上核對結果。", "日記可用真實或假想觀察，不要求學生公開私人家庭活動。", "人工注音卡只標示本頁練習字，不宣稱為 115 官方生字。"]
  },
  {
    n: 8,
    signals: ["專心聽出故事重點", "利用基本句型完成句子", "尊重並感受不同文化"],
    focus: "有順序地介紹一道食物，並用尊重的方式詢問不同飲食經驗。",
    mission: "完成「名稱／材料／特色／尊重回應」四句美食介紹。",
    vocab: [["介紹", "把人或事物的特點說給別人知道。"], ["食材", "製作食物時使用的材料。"], ["各種", "很多不同種類。"]],
    chars: [["介", "ㄐㄧㄝˋ"], ["紹", "ㄕㄠˋ"], ["圓", "ㄩㄢˊ"], ["米", "ㄇㄧˇ"], ["線", "ㄒㄧㄢˋ"], ["菜", "ㄘㄞˋ"]],
    readingTitle: "原創閱讀｜我們的食物地圖",
    paragraphs: [
      "班上舉辦食物分享，每個人介紹一道家中常見的料理。",
      "小安先說名稱，再介紹主要食材和吃法。",
      "同學發現，相似的米食也可能有不同形狀、味道和故事。",
      "大家先傾聽再提問，不嘲笑陌生的味道，也不勉強別人試吃。"
    ],
    questions: [
      ["小安介紹食物時先說什麼？", "食物的名稱", "自己最討厭的人", "料理的價錢", "同學的分數"],
      ["同學從分享中發現什麼？", "相似米食也可能有不同特色", "所有食物味道都相同", "只有一種吃法才正確", "陌生食物不能介紹"],
      ["面對不熟悉的食物，哪個回應最尊重？", "先傾聽並禮貌提問", "直接說一定不好吃", "要求別人一定要試吃", "嘲笑食物的名字"]
    ],
    workshop: {title: "四句美食介紹", instruction: "依序說出名稱、材料、特色與尊重回應。", slots: [["name", "名稱", ["這道食物叫米線", "這道食物叫飯糰", "這道食物叫蔬菜湯"]], ["ingredient", "材料", ["主要有米和青菜", "主要有米飯和海苔", "主要有各種蔬菜"]], ["feature", "特色", ["口感柔軟", "外形圓圓的", "味道清淡"]], ["response", "尊重回應", ["我想知道它通常怎麼吃", "謝謝你介紹家中的味道", "我會先聽完再提問"]]], template: "{name}，{ingredient}，{feature}。{response}。"},
    teacherNotes: ["分享活動不要求學生攜帶食物，可使用圖卡或假想例子。", "避免把食物和族群文化簡化成單一標籤。", "提醒學生可以不試吃，但要使用尊重的語句回應。"]
  },
  {
    n: 9,
    signals: ["仔細聆聽並分享想法", "體會家人料理食物所傳達的情感", "運用疊字詞完成句子"],
    focus: "從感官線索描述食物，也說出料理與分享帶來的情感。",
    mission: "用一個疊字詞描述味道或口感，再說出這道食物帶來的感受。",
    vocab: [["米粒", "一顆一顆的米。"], ["海苔", "由海藻加工製成的食品。"], ["淡淡", "程度不濃、不強烈的樣子。"]],
    chars: [["黃", "ㄏㄨㄤˊ"], ["粒", "ㄌㄧˋ"], ["熱", "ㄖㄜˋ"], ["蒸", "ㄓㄥ"], ["蛋", "ㄉㄢˋ"], ["淡", "ㄉㄢˋ"]],
    readingTitle: "原創閱讀｜暖暖的早餐",
    paragraphs: [
      "清晨，廚房傳來淡淡的米香，我慢慢走到餐桌旁。",
      "碗裡的粥熱熱的，上面放著細細的蔬菜。",
      "家人提醒我先吹一吹，再小口品嘗。",
      "我吃到的不只是味道，也感受到有人細心準備的溫暖。"
    ],
    questions: [
      ["清晨的廚房傳來什麼？", "淡淡的米香", "很大的雷聲", "海水的味道", "濃濃的油漆味"],
      ["家人為什麼提醒先吹一吹？", "粥是熱的，要安全入口", "要把粥吹走", "要讓蔬菜消失", "要比誰吹得快"],
      ["原創短文最後說『不只是味道』，還包含什麼？", "家人準備食物的心意", "早餐的價錢", "碗的大小", "吃飯的速度"]
    ],
    workshop: {title: "味道與心意句", instruction: "用感官詞、疊字詞與情感句，說出一道食物帶來的感受。", slots: [["sense", "感官線索", ["我聞到淡淡的米香", "我看見細細的蔬菜", "我吃到軟軟的米粒"]], ["action", "安全品嘗", ["我先吹一吹再入口", "我先看清楚食材", "我慢慢咀嚼感受味道"]], ["emotion", "我的感受", ["我感受到家人的關心", "我想謝謝準備食物的人", "我覺得心裡暖暖的"]]], template: "{sense}；{action}，{emotion}。"},
    teacherNotes: ["討論家庭食物時尊重不同家庭組成、飲食習慣與取得條件。", "疊字詞重點是語意合宜，不追求堆疊越多越好。", "涉及過敏或飲食限制時只作語文描述，不進行實際試吃。"]
  },
  {
    n: 10,
    signals: ["找出故事重點", "認識猜字謎原則", "了解文句反映的情緒"],
    focus: "從字形部件、意思與提示找答案，並說明自己的推理。",
    mission: "設計一則有足夠線索的字謎，請同學回答並說明理由。",
    vocab: [["字謎", "用字形、字義或讀音線索讓人猜字的謎語。"], ["回答", "針對問題說出想法或答案。"], ["突然", "事情發生得很快，讓人沒有預先想到。"]],
    chars: [["減", "ㄐㄧㄢˇ"], ["讀", "ㄉㄨˊ"], ["謎", "ㄇㄧˊ"], ["答", "ㄉㄚˊ"], ["數", "ㄕㄨˋ"], ["題", "ㄊㄧˊ"]],
    readingTitle: "原創閱讀｜一個字的偵探",
    paragraphs: [
      "語文角出現一張小卡，上面寫著：「太陽躲進門裡。」",
      "小宇先圈出「太陽」和「門」兩個線索，再想它們能不能組成一個字。",
      "他猜答案是「間」，因為「日」放在「門」裡。",
      "同學沒有只說對或錯，而是一起檢查字形，說明每個線索的作用。"
    ],
    questions: [
      ["小宇先圈出哪兩個線索？", "太陽和門", "月亮和山", "水和火", "人和木"],
      ["小宇為什麼猜答案是『間』？", "日放在門裡符合字形", "間和太陽讀音一樣", "卡片直接寫出答案", "同學先告訴他答案"],
      ["猜字謎時，哪個做法最重要？", "用每個線索說明推理", "只看誰回答最快", "沒有理由也可以亂猜", "把不懂的線索刪掉"]
    ],
    workshop: {title: "字謎線索組合", instruction: "選擇部件、位置與提示，說出一則可檢查的字謎。", slots: [["partA", "第一個部件", ["一個日", "一個人", "一個木"]], ["position", "位置關係", ["放在門裡", "站在木旁", "加在另一個木旁"]], ["hint", "意思提示", ["表示時間或空間的中間", "和休息有關", "會變成一片樹林"]]], template: "我的字謎是：{partA}{position}；提示是{hint}。"},
    teacherNotes: ["字謎必須能由公開字形知識推理，不引用出版社題目。", "鼓勵學生說出排除其他答案的理由。", "若線索不足，先請設計者補充，不把猜不到歸因於同學能力。"]
  },
  {
    n: 11,
    signals: ["朗讀出角色的情緒與語氣", "理解文字的趣味性", "練習接說故事並說完事件"],
    focus: "從角色語氣找出情緒，接續說出有因果、有結果的故事。",
    mission: "接說一段門後故事：角色看見什麼、怎麼反應、最後如何解決。",
    vocab: [["奇怪", "和平常不同，讓人感到疑惑。"], ["立刻", "馬上、沒有拖延。"], ["仔細", "注意細節，不馬虎。"]],
    chars: [["怪", "ㄍㄨㄞˋ"], ["門", "ㄇㄣˊ"], ["立", "ㄌㄧˋ"], ["刻", "ㄎㄜˋ"], ["報", "ㄅㄠˋ"], ["底", "ㄉㄧˇ"]],
    readingTitle: "原創閱讀｜圖書館的小門",
    paragraphs: [
      "圖書館角落有一扇小門，門上貼著「請先敲三下」。",
      "小晴覺得奇怪，沒有立刻打開，而是先問管理員。",
      "管理員笑著說，那是放大型圖畫書的櫃子，敲門是閱讀活動的暗號。",
      "小晴鬆了一口氣，也想出下一個暗號，邀請同學一起讀書。"
    ],
    questions: [
      ["小門上貼著什麼？", "請先敲三下", "禁止進入", "今天休息", "請大聲說話"],
      ["小晴為什麼先問管理員？", "她覺得奇怪，想先確認", "她忘記怎麼敲門", "她想把門搬走", "管理員要求她離開"],
      ["故事最後，小晴的心情可能怎麼變？", "從疑惑到放心", "從開心到生氣", "從無聊到害怕", "完全沒有變化"]
    ],
    workshop: {title: "故事接說三步驟", instruction: "選擇發現、反應與結果，接說成一段完整小故事。", slots: [["discovery", "角色發現", ["門後傳來輕輕的聲音", "門把上多了一張字卡", "地上出現一串小腳印"]], ["reaction", "角色反應", ["先停下來仔細觀察", "用合宜語氣詢問", "請可信任的成人一起確認"]], ["result", "故事結果", ["原來是閱讀活動的提示", "大家找到安全的解答", "角色學會先查證再行動"]]], template: "角色發現{discovery}，於是{reaction}；最後{result}。"},
    teacherNotes: ["故事接說要有安全且合理的解決方式，不鼓勵擅闖未知空間。", "朗讀同一句話時，可比較疑惑、緊張與放心三種語氣。", "接受想像答案，但要求前後事件能連接。"]
  },
  {
    n: 12,
    signals: ["聽出主要人物與事件", "辨認國字部件", "形容動物的聲音和樣態"],
    focus: "用聲音、外形與動作詞觀察動物，寫出具體而尊重生命的描述。",
    mission: "完成一張動物觀察卡：聲音像什麼、外形如何、動作怎樣。",
    vocab: [["詩人", "創作詩的人。"], ["脖子", "頭和身體之間的部位。"], ["身體", "人或動物的軀體。"]],
    chars: [["詠", "ㄩㄥˇ"], ["鵝", "ㄜˊ"], ["曲", "ㄑㄩ"], ["項", "ㄒㄧㄤˋ"], ["掌", "ㄓㄤˇ"], ["波", "ㄅㄛ"]],
    readingTitle: "原創閱讀｜池面上的白鵝",
    paragraphs: [
      "白鵝慢慢游過池面，長長的脖子像一道彎彎的線。",
      "牠轉動頭部，發出響亮的叫聲，水面也跟著出現波紋。",
      "橘色的腳掌在水下撥動，身體卻穩穩地向前。",
      "我站在欄杆外安靜觀察，用聲音、外形和動作記下牠的樣子。"
    ],
    questions: [
      ["原創短文把白鵝的脖子比成什麼？", "一道彎彎的線", "一顆圓圓的球", "一扇小小的門", "一片方方的紙"],
      ["白鵝怎麼讓身體向前？", "用腳掌在水下撥動", "用翅膀推欄杆", "讓風把牠吹走", "站在池邊跳躍"],
      ["觀察動物時，哪個做法合宜？", "保持距離並安靜記錄", "追著動物靠近拍照", "餵食不明食物", "用聲音嚇牠移動"]
    ],
    workshop: {title: "動物觀察三句", instruction: "選擇聲音、外形與動作，組成具體的觀察描述。", slots: [["sound", "聲音", ["叫聲響亮", "聲音短短的", "我聽見規律的叫聲"]], ["shape", "外形", ["脖子長長的", "羽毛白白的", "腳掌是橘色的"]], ["motion", "動作", ["牠慢慢游過水面", "牠轉動頭部觀察", "牠用腳掌撥出波紋"]]], template: "我聽見牠{sound}；牠的{shape}，接著{motion}。"},
    teacherNotes: ["本頁不重製古詩或出版社課文，只用原創觀察文練習描述。", "引導學生使用可觀察的聲音、外形與動作，不替動物猜測心情。", "提醒保持距離、不追逐、不任意餵食。"]
  }
];

const makeOptions = ([q, correct, ...wrong]) => ({
  q,
  options: [{text: correct, correct: true}, ...wrong.map(text => ({text, correct: false}))]
});

for (const config of configs) {
  const legacy = legacyBySequence.get(config.n);
  const target = targetBySequence.get(config.n);
  if (!legacy || !target) throw new Error(`L${config.n}: missing source unit`);
  if (legacy.officialTitle !== target.title) throw new Error(`L${config.n}: title mismatch ${legacy.officialTitle} != ${target.title}`);
  const sourceCharacters = new Set(Object.values(legacy.sourceTerms).flat());
  for (const [char] of config.chars) if (!sourceCharacters.has(char)) throw new Error(`L${config.n}: ${char} not in 114 public word bank`);
  for (const [word] of config.vocab) if (!sourceCharacters.has(word)) throw new Error(`L${config.n}: ${word} not in 114 public word bank`);

  const oldUnit = (await readJson("data/hanlin-114.json")).subjects.find(subject => subject.id === "chinese").units[config.n - 1];
  const originalAdaptation = config.useExistingAdaptation
    ? {...oldUnit.originalAdaptation, title: config.readingTitle, comprehensionTitle: "閱讀理解（只依公共領域基礎的 edu2 原創改寫作答）"}
    : {
        title: config.readingTitle,
        comprehensionTitle: "閱讀理解（只依 edu2 原創短文作答）",
        attributionNote: `edu2 原創短文，依 L${String(config.n).padStart(2, "0")} 公開課程計畫的教學訊號撰寫；不是翰林課文、摘要或習題。`,
        paragraphs: config.paragraphs,
        comprehension: config.questions.map(makeOptions)
      };

  const brief = {
    schemaVersion: 1,
    subject: "chinese",
    publisher: "hanlin",
    targetAcademicYear: 115,
    sourceAcademicYear: 114,
    acceptedAcademicYearRange: shared.acceptedAcademicYearRange,
    grade: 2,
    semester: 1,
    unitId: `L${String(config.n).padStart(2, "0")}`,
    title: target.title,
    genre: target.genre,
    sourceStatus: shared.sourceStatus,
    sourceRefs: shared.sourceRefs,
    sourceBoundary: `115 翰林官方教材簡介只核對 L${config.n} 課名、作者、文體與順序；114 同出版社、年級、學期、同課名公開課程計畫提供教學訊號：${config.signals.join("、")}。使用者已核准 113–115 學年資料窗。本檔短文、活動與題目均為 edu2 原創，不重製或改寫課文、習作、教師手冊、出版社圖像或音檔，也不標示為 115 官方課文內容。`,
    instructionalSignals: config.signals,
    unit: {
      id: `ch-${String(config.n).padStart(2, "0")}`,
      publisherUnitId: `L${String(config.n).padStart(2, "0")}`,
      title: target.title,
      publisherLabel: "翰林115目標",
      layerLabel: "114 fallback／115 candidate · batch QA",
      focus: config.focus,
      mission: config.mission,
      objectives: [config.focus, "朗讀人工核對注音的練習字詞。", "依原創短文回答並說明證據。", "完成本課語文互動並尊重同學的不同表達。"],
      flow: ["閱讀原創短文 📖", "找出文本證據 🔎", "朗讀練習字詞 🔊", "完成語文任務 ✍️", "分享與回應 🤝"],
      sourceLayer: {
        status: "fallback-brief-approved · batch technical candidate",
        evidence: `115 翰林官方 L${config.n} outline＋114 同版同年級同學期同課名公開課程計畫＋114 教育雲公開詞彙；使用者接受 113–115 學年來源窗。`,
        boundary: "以下短文、語文活動與評量均為 edu2 原創，只支援 fallback batch QA；不是翰林課文、習作或 115 官方內容。"
      },
      verticalSummary: `${config.focus}這是本站原創朗讀句，不是課文本文。`,
      vocabulary: config.vocab.map(([word, meaning]) => ({word, meaning: `${meaning}本站原創教學釋義。`})),
      characters: config.chars.map(([char, zhuyin]) => ({char, zhuyin})),
      publicLearningLayerStatus: "ready-114-wordbank-and-listening-with-fallback-boundary",
      textStructureStatus: "original-reading-only-no-textbook-structure-claim",
      publicLayerBoundary: "114 教育雲詞彙與官方朗讀維持 historical／link-only；本頁理解題只依本站原創短文，不依課名或詞彙推測出版社課文。",
      readingGuide: {
        audioUrl: legacy.officialListening.playlistUrl,
        audioLabel: `翰林聽 e 聽・二上第 ${config.n} 課〈${target.title}〉（官方外部朗讀入口）`,
        audioBoundary: "官方朗讀只提供外連，不下載、嵌入、轉錄、重製或作為本站理解題答案來源。",
        listeningTasks: ["第一次聽：找出一個自己確定聽到的詞語或語氣線索。", "第二次聽：暫停後，用「我聽到＿＿」說一句完整的話。", "聽完後：不確定時說「我想再聽一次」，不把猜想當成課文內容。"],
        textPlaceholderNote: "本站不放課文全文；請搭配合法課本或官方朗讀使用。下方另有可獨立閱讀的 edu2 原創短文。"
      },
      originalAdaptation,
      languageWorkshop: config.workshop,
      teacherNotes: config.teacherNotes,
      artifact: shared.artifact
    }
  };

  const output = path.join(root, `data/content-intake/chinese-hanlin-115-l${String(config.n).padStart(2, "0")}-brief.json`);
  await mkdir(path.dirname(output), {recursive: true});
  await writeFile(output, `${JSON.stringify(brief, null, 2)}\n`);
  console.log(`built ${path.relative(root, output)}`);
}
