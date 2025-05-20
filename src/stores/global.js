import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
export const useGlobalStore = defineStore('global', () => {
  const currentData = ref({});
  const currentLang = ref('uz');
  const uzUz = {
    name: "uz-UZ",
    global: {
      undo: "Chiqish",
      redo: "Qayta qiling",
      confirm: "Tasdiqlash",
    },
    Popconfirm: {
      positiveText: "Tasdiqlash",
      negativeText: "Chiqish",
    },
    Cascader: {
      placeholder: "tanlang",
      loading: "Yuklanmoqda",
      loadingRequiredMessage: (label) =>
        `Belgilashdan oldin ${label} ning barcha ichki elementlarini tanlang.`,
    },
    Time: {
      dateFormat: "dd.MM.yyyy",
      dateTimeFormat: "dd.MM.yyyy HH:mm:ss",
    },
    DatePicker: {
      yearFormat: "yyyy",
      monthFormat: "MM",
      dayFormat: "eeeeee",
      yearTypeFormat: "yyyy",
      monthTypeFormat: "yyyy-MM",
      dateFormat: "yyyy-MM-dd",
      dateTimeFormat: "dd.MM.yyyy HH:mm:ss",
      quarterFormat: "yyyy-qqq",
      clear: "Tozalash",
      now: "Hozir",
      confirm: "Tasdiqlash",
      selectTime: "Vaqtni tanlang",
      selectDate: "Sanani tanlang",
      datePlaceholder: "Sanani tanlang",
      datetimePlaceholder: "Sana va vaqtni tanlang",
      monthPlaceholder: "Oyni tanlang",
      yearPlaceholder: "Yilni tanlang",
      quarterPlaceholder: "Chorakni tanlang",
      startDatePlaceholder: "Boshlanish sanasi",
      endDatePlaceholder: "Tugash sanasi",
      startDatetimePlaceholder: "Boshlanish sanasi va vaqti",
      endDatetimePlaceholder: "Tugash sanasi va vaqti",
      monthBeforeYear: true,
      firstDayOfWeek: 6,
      today: "Bugun",
      weekdays: ["Dush", "Sesh", "Chor", "Pay", "Jum", "Shan", "Yak"]
    },
    DataTable: {
      checkTableAll: "Jadvaldagi barchasini tanlash",
      uncheckTableAll: "Jadvaldagi barcha tanlovni olib tashlash",
      confirm: "Tasdiqlash",
      clear: "Tozalash",
    },
    Transfer: {
      sourceTitle: "Manba",
      targetTitle: "Maqsad",
    },
    Empty: {
      description: "Ma'lumotlar yo'q",
    },
    Select: {
      placeholder: "Tanlang",
    },
    TimePicker: {
      placeholder: "Vaqtni tanlang",
      positiveText: "OK",
      negativeText: "Chiqish",
      now: "Hozir",
    },
    Dialog: {
      title: "Xabar",
      okText: "Tasdiqlash",
      cancelText: "Chiqish",
    },
    Pagination: {
      goto: "O'tish",
      selectionSuffix: "sahifa",
    },
    DynamicTags: {
      add: "Qo'shish",
    },
    Log: {
      loading: "Yuklanmoqda",
    },
    Input: {
      placeholder: "Kiriting",
    },
    InputNumber: {
      placeholder: "Kiriting",
    },
    DynamicInput: {
      create: "Yaratmoq",
    },
    ThemeEditor: {
      title: "Mavzu muharriri",
      clearAllVars: "Barcha o'zgaruvchilarni tozalash",
      clearSearch: "Qidiruvni tozalash",
      filterCompName: "Filtr komponenti nomi",
      filterVarName: "Filter Variable Name",
      import: "Import",
      export: "Export",
      restore: "Reset to Default",
    },
    // TODO: translation
    Image: {
      tipPrevious: "Oldingi rasm (←)",
      tipNext: "Keyingi rasm (→)",
      tipCounterclockwise: "Soat miliga teskari",
      tipClockwise: "Soat yo'nalishi bo'yicha",
      tipZoomOut: "Kichraytirish",
      tipZoomIn: "Kattalashtirish",
      tipClose: "Yopish (Esc)",
    },
  };
  const kaKa = {
    "name": "uz-UZ",
    "global": {
      "undo": "Чиқиш",
      "redo": "Қайта қилиш",
      "confirm": "Тасдиқлаш"
    },
    "Popconfirm": {
      "positiveText": "Тасдиқлаш",
      "negativeText": "Чиқиш"
    },
    "Cascader": {
      "placeholder": "танланг",
      "loading": "Юкланмоқда",
      "loadingRequiredMessage": (label) =>
        `Белгилашдан олдин ${label} нинг барча ички элементларини танланг.`
    },
    "Time": {
      "dateFormat": "dd.MM.yyyy",
      "dateTimeFormat": "dd.MM.yyyy HH:mm:ss"
    },
    "DatePicker": {
      "yearFormat": "yyyy",
      "monthFormat": "MM",
      "dayFormat": "eeeeee",
      "yearTypeFormat": "yyyy",
      "monthTypeFormat": "yyyy-MM",
      "dateFormat": "yyyy-MM-dd",
      "dateTimeFormat": "dd.MM.yyyy HH:mm:ss",
      "quarterFormat": "yyyy-qqq",
      "clear": "Тозалаш",
      "now": "Ҳозир",
      "confirm": "Тасдиқлаш",
      "selectTime": "Вақтни танланг",
      "selectDate": "Санани танланг",
      "datePlaceholder": "Санани танланг",
      "datetimePlaceholder": "Сана ва вақтни танланг",
      "monthPlaceholder": "Ойни танланг",
      "yearPlaceholder": "Йилни танланг",
      "quarterPlaceholder": "Чоракни танланг",
      "startDatePlaceholder": "Бошланиш санаси",
      "endDatePlaceholder": "Тугаш санаси",
      "startDatetimePlaceholder": "Бошланиш санаси ва вақти",
      "endDatetimePlaceholder": "Тугаш санаси ва вақти",
      "monthBeforeYear": true,
      "firstDayOfWeek": 6,
      "today": "Бугун",
      "weekdays": ["Душ", "Сеш", "Чор", "Пай", "Жум", "Шан", "Як"]
    },
    "DataTable": {
      "checkTableAll": "Жадвалдаги барчасини танлаш",
      "uncheckTableAll": "Жадвалдаги барча танловни олиб ташлаш",
      "confirm": "Тасдиқлаш",
      "clear": "Тозалаш"
    },
    "Transfer": {
      "sourceTitle": "Манба",
      "targetTitle": "Мақсад"
    },
    "Empty": {
      "description": "Маълумотлар йўқ"
    },
    "Select": {
      "placeholder": "Танланг"
    },
    "TimePicker": {
      "placeholder": "Вақтни танланг",
      "positiveText": "ОК",
      "negativeText": "Чиқиш",
      "now": "Ҳозир"
    },
    "Dialog": {
      "title": "Хабар",
      "okText": "Тасдиқлаш",
      "cancelText": "Чиқиш"
    },
    "Pagination": {
      "goto": "Ўтиш",
      "selectionSuffix": "саҳифа"
    },
    "DynamicTags": {
      "add": "Қўшиш"
    },
    "Log": {
      "loading": "Юкланмоқда"
    },
    "Input": {
      "placeholder": "Киритинг"
    },
    "InputNumber": {
      "placeholder": "Киритинг"
    },
    "DynamicInput": {
      "create": "Яратмоқ"
    },
    "ThemeEditor": {
      "title": "Мавзу муҳаррири",
      "clearAllVars": "Барча ўзгарувчиларни тозалаш",
      "clearSearch": "Қидирувни тозалаш",
      "filterCompName": "Филтр компоненти номи",
      "filterVarName": "Филтр ўзгарувчи номи",
      "import": "Импорт",
      "export": "Экспорт",
      "restore": "Соҳифага қайтиш"
    },
    "Image": {
      "tipPrevious": "Олдинги расм (←)",
      "tipNext": "Кейинги расм (→)",
      "tipCounterclockwise": "Соат йўналишига тескари",
      "tipClockwise": "Соат йўналиши бўйича",
      "tipZoomOut": "Кичрайтириш",
      "tipZoomIn": "Катталаштириш",
      "tipClose": "Ёпиш (Esc)"
    }
  }
  const menuStyle = {
    common: {
      modalColor: '#fffefe',
    },
    Menu: {
      borderRadius: "5px",
      color: "#115D33", // fon rangi
      groupTextColor: "#D1FAE5",
      itemColorHover: "#15803D", // hover effekti
      itemColorActive: "#0C4A26", // aktiv holat
      itemColorActiveHover: "#15803D",
      itemColorActiveCollapsed: "#0C4A26",
      itemTextColor: "#FFFFFF",
      itemTextColorHover: "#FFFFFF",
      itemTextColorActive: "#FFFFFF",
      itemTextColorActiveHover: "#FFFFFF",
      itemTextColorChildActive: "#BBF7D0",
      itemTextColorChildActiveHover: "#BBF7D0",
      itemIconColor: "#FFFFFF",
      itemIconColorHover: "#FFFFFF",
      itemIconColorActive: "#FFFFFF",
      itemIconColorActiveHover: "#BBF7D0",
      itemIconColorChildActive: "#BBF7D0",
      itemIconColorChildActiveHover: "#BBF7D0",
      itemIconColorCollapsed: "#FFFFFF",
      arrowColor: "#FFFFFF",
      arrowColorHover: "#FFFFFF",
      arrowColorActive: "#FFFFFF",
      arrowColorActiveHover: "#BBF7D0",
      itemHeight: "40px",
      fontSize: "14px",
      fontWeight: "bold",
      dividerColor: "#1B3A2F",
    },
    Drawer: {
      "bodyPadding": "4px 6px"
    },
    Modal: {
      color: "#fff"
    },

    Table: {
      "thFontWeight": "500",
      "thColor": "#18a058",
      "thColorModal": "#18a058",
      "borderColor": "#31313AFF",
      "thTextColor": "#fff",
    },

    Divider: {
      color: '#ccc'
    }
  }
  const langOption = ref([
    {
      label: "O'zbekcha",   // O'zbek tili
      value: "uz"
    },
    {
      label: "한국어",        // Koreys tili (Korean)
      value: "ko"
    },
    {
      label: "Русский",     // Rus tili
      value: "ru"
    },
    {
      label: "English",     // Ingliz tili
      value: "en"
    }
  ])
  const roleOption = computed(() => [
    {
      key: "Admin",
      name_uz: "Admin",
      name_ka: "Admin",
      name_ru: "Админ",
      name_en: "Admin",
      name_ka: "Админ",
    },
    {
      key: "Programmer",
      name_uz: "Dasturchi",
      name_ru: "Программист",
      name_en: "Programmer",
      name_ka: "Дастурчи",
      disabled: currentData.value.role == "Programmer" ? false : true,
    },
  ]);
  const orderStatus = ref([
    {
      value: 'new',
      label_uz: 'Yangi',
      label_ru: 'Новый',
      label_en: 'New',
      label_ka: "Янги",
    },
    {
      value: 'finished',
      label_uz: 'Tugallandi',
      label_ru: 'Законченный',
      label_en: 'Finished',
      label_ka: "Тугалланди"
    },
    {
      value: 'canceled',
      label_uz: 'Bekor qilingan',
      label_ru: 'Отменено',
      label_en: 'Canceled',
      label_ka: "Бекор қилинган"
    }
  ])
  const errorPage = ref({
    error_code: 0,
    message: ""
  })
  const allowRole = ref({
    information: true,
    document: true,
    report: true,
    home: true,
    delete: true,
    update: true,
    prixod: true,
    service: true,
    order: true,
    refund: true,
    sms_table: true,
    sklad_add: true
  })
  const sms_type = ref([
    {
      value: 'sms_by_user',
      label_uz: "SMS jo'natgan xodim",
      label_ru: "Отправитель SMS",
      label_ka: "SMS жўнатган ходим",
    },
    {
      value: 'register_sms',
      label_uz: "SMS orqali ro'yxatdan o'tkazildi",
      label_ru: "Зарегистрировано через SMS",
      label_ka: "SMS орқали рўйхатдан ўтказилди",
    },
    {
      value: 'register_mail',
      label_uz: "Elektron pochta orqali ro'yxatdan o'tkazildi",
      label_ru: "Зарегистрировано через почту",
      label_ka: "Электрон почта орқали рўйхатдан ўтказилди",
    },
    {
      value: 'login_sms',
      label_uz: "SMS orqali kirildi",
      label_ru: "Вход через SMS",
      label_ka: "SMS орқали кирилди",
    },
    {
      value: 'login_mail',
      label_uz: "Elektron pochta orqali kirildi",
      label_ru: "Вход через почту",
      label_ka: "Электрон почта орқали кирилди",
    },
    {
      value: 'warranty_mail',
      label_uz: "Elektron pochta orqali kafolat tasdiqlandi",
      label_ru: "Подтверждено через почту",
      label_ka: "Электрон почта орқали кафолат тасдиқланди",
    },
    {
      value: "warranty_sms",
      label_uz: "SMS orqali kafolat tasdiqlandi",
      label_ru: "Подтверждено через SMS",
      label_ka: "SMS орқали кафолат тасдиқланди",
    },
    {
      value: "mail_reject",
      label_uz: "Elektron pochta orqali rad etildi",
      label_ru: "Отказано через почту",
      label_ka: "Электрон почта орқали рад етилди",
    },
    {
      value: "sms_reject",
      label_ru: "Отказано через SMS",
      label_ka: "SMS орқали рад етилди",
      label_uz: "SMS orqali rad etildi"
    }
  ])
  const unitOption = ref([
    {
      element: "piece",
      title_uz: "Dona",
      title_ru: "Кусок",
      title_en: "Litre",
      title_ko: "조각"
    },
    {
      element: "kg",
      title_uz: "Kilogram",
      title_ru: "Килограмм",
      title_en: "Kilogram",
      title_ko: "킬로그램"
    },
    {
      element: "ltr",
      title_uz: "Litr",
      title_ru: "Литр",
      title_en: "Litre",
      title_ko: "리터"
    },
  ])
  return {
    currentData,
    allowRole,
    uzUz,
    kaKa,
    errorPage,
    menuStyle,
    langOption,
    roleOption,
    currentLang,
    orderStatus,
    sms_type,
    unitOption
  }
})
