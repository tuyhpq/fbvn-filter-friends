const REJECT_LIST = [
  "con đĩ",
  "tuyển nhân viên",
  "trẻ trâu",
  "lđ",
  "dịch vụ facebook",
  " cc",
  " cl ",
  " cm",
  " vl",
  "ai bán",
  "ai cần",
  "ai mua",
  "bán ac",
  "bán kim",
  "bán kc",
  "bán nick",
  "bán níck",
  "bốc phốt",
  "cày thuê",
  "cần acc",
  "cần bán",
  "cần đổi",
  "cần mua",
  "𝗖𝗹𝗶𝗽",
  "code",
  "cứt",
  "dcm",
  "dkm",
  "dm",
  "dâm",
  "đcm",
  "địt",
  "đkm",
  "đm",
  "vkl",
  "đổi ac",
  "đổi nick",
  "đổi níck",
  "event tặng",
  "gdtg",
  "giá chỉ",
  "giá học sinh",
  "hack",
  "http",
  "kc miễn phí",
  "kc giá rẻ",
  "kiếm thẻ",
  "kiếm tiền",
  "kim cương giá rẻ",
  "kim cương miễn phí",
  "liên hệ",
  "link",
  "loz",
  "lồn",
  "lừa",
  "miễn phí 100%",
  "mini game",
  "minigame",
  "mua ac",
  "mua ib",
  "mua kim",
  "mua kc",
  "mua nick",
  "mua níck",
  "nghỉ game",
  "nghĩ game",
  "ngu",
  "nhận kim",
  "nhận kc",
  "nhận quà",
  "nhận thẻ",
  "nhận ac",
  "nhận nạp k",
  "óc chó",
  "sủa",
  "súc vật",
  "tặng quà",
  "tặng thẻ",
  "tặng kim",
  "tặng kc",
  "tặng acc",
  "trẩu",
  "tuyển dụng",
  "uy tín 100%",
  "zalo",
  "lộ hàng",
  "thanh lý",
  "thanh lí"
];

const BLACK_LIST = [
  "scam",
  "con chó",
  "xả hàng",
  "kb",
  "add",
  "kết bạn",
  "ib",
  "inb",
  "code",
  "free",
  "miễn phí",
  "uy tín",
  "link",
  "clip",
  "xoxo",
  "chấm",
  "dâm",
  "show",
  "tặng",
  "thẻ cào",
  "nhập mã",
  "giá cả"
];

const APPROVE_LIST = ["tuyển thành viên", "tuyển tv", "ttv"];

export default [
  {
    id: "694039351025214",
    name: "Free Fire",
    blackList: BLACK_LIST,
    rejectList: REJECT_LIST,
    approveList: APPROVE_LIST,
    hasApprovePost: true
  },
  // { id: "qv98vn", name: "Mua bán PUBG" }, đã bán
  {
    id: "3151463064926974",
    name: "FF 12K",
    blackList: BLACK_LIST,
    rejectList: REJECT_LIST,
    approveList: APPROVE_LIST,
    hasApprovePost: true
  },
  {
    id: "298297000328148",
    name: "COD",
    blackList: BLACK_LIST,
    rejectList: REJECT_LIST,
    approveList: APPROVE_LIST,
    hasApprovePost: true
  },
  // { id: "360848434395577", name: "Hỗ trợ PUBG", approves: ['acc'] }, đã bán
  {
    id: "744092792625338",
    name: "Làm quen",
    blackList: BLACK_LIST,
    rejectList: REJECT_LIST,
    approveList: APPROVE_LIST,
    hasApprovePost: true
  },
  // { id: "108807306468805", name: "LOT" }, đã bán
  // { id: "486751422133880", name: "Hack FF" }, đã bị khóa
  // { id: "1129744734043345", name: "Ngắm Trai" }, đã bán
  { id: "3120470631310759", name: "Vitamin", hasApprovePost: false },
  { id: "1293192420863686", name: "Cà khịa", hasApprovePost: false },
  // { id: "findbfwifehusbandgf", name: "Cung đấu" }, // đã bán
  // { id: "116039558551577", name: "Giang Hồ Chi Mộng" }, (group is removed)
  // { id: "106584670094311", name: "Chợ ăn Cần Thơ" }, đã bán
  { id: "297521937365013", name: "Chợ Bến Tre", hasApprovePost: true },
  // { id: "2621702094586454", name: "Đồ cũ Tuy Hòa" }, đã bán
  // { id: "346843986016861", name: "Tus buồn", blackList: BLACK_LIST }, đã bán
  // { id: "351563755753840", name: "Xe độ" }, // đã bán
  {
    id: "498154793692114",
    name: "Buff sao Liên Quân",
    blackList: BLACK_LIST,
    rejectList: REJECT_LIST,
    approveList: APPROVE_LIST,
    hasApprovePost: true
  }, // cho thuê
  {
    id: "191718824567616",
    name: "Liên quân confess",
    blackList: BLACK_LIST,
    rejectList: REJECT_LIST,
    approveList: APPROVE_LIST,
    hasApprovePost: true
  }
  // { id: "vltk2016", name: "ZSM" }, đã bán
  // { id: "danh.tuong.3q.vng", name: "Danh tướng" }, // đã bán
  // { id: "ccht.garena", name: "FF mua bán" }, cho thuê
  // { id: "1954247621454629", name: "FF cộng đồng" }, đã bán
  // { id: "AxE.Alliance.Empire.VN", name: "Mua bán AxE" }, đã bán
];
