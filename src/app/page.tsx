"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const WEDDING_ISO = "2026-06-12T15:00:00+04:00"; // Armenia time (AMT). Adjust if you want.
const LANGUAGE_STORAGE_KEY = "wedding-language";
type Language = "hy" | "en" | "ru";

const LINKS = {
  churchMaps: "https://www.google.com/maps/search/?api=1&query=Geghard+Monastery",
  restaurantMaps: "https://www.google.com/maps/search/?api=1&query=Vivaldi+Hall+24%2F44+Azatutyan+Ave+Yerevan",
  churchMapsYandex: "https://yandex.com/maps/?text=Geghard+Monastery",
  restaurantMapsYandex: "https://yandex.com/maps/?text=Vivaldi+Hall+24%2F44+Azatutyan+Ave+Yerevan",
  // Optional: if you want a taxi link, you can use a generic "open maps" or a local taxi app URL.
};

const COPY = {
  en: {
    topBar: "Wedding Day",
    heroCity: "Yerevan, Armenia",
    navLocations: "Locations",
    navTimeline: "Timeline",
    navRsvp: "RSVP",
    musicTitle: "Would you like to turn on some music?",
    musicText: "You can change this anytime by refreshing the page.",
    yes: "Yes",
    no: "No",
    inviteTitle: "DEAR FAMILY AND FRIENDS!",
    inviteText: [
      "With joyful hearts,",
      "we invite you to share one of the most meaningful days of our lives.",
      "We are getting married,",
      "and it would mean the world to us",
      "to celebrate this special moment together with you.",
      "We look forward to welcoming you",
    ],
    inviteDateLabel: "on",
    locationsTitle: "Locations",
    churchName: "Geghard Monastery",
    churchArea: "Geghard",
    googleMap: "Google map",
    yandexMap: "Yandex map",
    churchNote: "Please wear comfortable shoes at this location.",
    restaurantName: "Vivaldi Hall",
    restaurantAddress: "24/44 Azatutyan Ave, Yerevan",
    restaurantNote: "Parking is available on site.",
    timingTitle: "TIMING",
    eventChurch: "Church",
    eventRestaurant: "Restaurant",
    eventEnd: "End of the evening",
    quote: "LOVE ISN'T JUST A FEELING; IT'S A WHOLE WORLD. WE'RE HAPPY TO SHARE THIS WORLD WITH YOU!",
    rsvpTitle: "RSVP",
    rsvpText: "We ask you to confirm your attendance and answer a few important questions by",
    formNameLabel: "Your name",
    formNamePlaceholder: "Full name",
    formAttendanceLabel: "Will you be able to attend?",
    formAttendancePlaceholder: "Select",
    formAttendanceYes: "Yes",
    formAttendanceNo: "No",
    formAttendanceMaybe: "Not sure yet",
    formGuestCountLabel: "Number of guests who are joining you",
    formGuestNamesLabel: "Full names of people who are joining you",
    formGuestNamesPlaceholder: "List full names (if any)",
    submitSurvey: "Complete the survey",
    countdownTitle: "SEE YOU IN",
    days: "days",
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
    chatsTitle: "GROUP CHATS",
    chatsText: "Join our group chats to share photo's and video's after the wedding.",
    telegramGroup: "Telegram group",
    whatsappGroup: "WhatsApp group",
    contactsTitle: "CONTACTS",
    contactsText: "If you have any questions, please contact our wedding planner.",
    contactUs: "Contact us",
  },
  hy: {
    topBar: "Հարսանիքի օր",
    heroCity: "Երևան, Հայաստան",
    navLocations: "Վայրեր",
    navTimeline: "Ժամանակացույց",
    navRsvp: "Մասնակցություն",
    musicTitle: "Կցանկանա՞ք միացնել երաժշտությունը։",
    musicText: "Սա կարող եք փոխել ցանկացած պահի՝ պարզապես թարմացնելով էջը։",
    yes: "Այո",
    no: "Ոչ",
    inviteTitle: "ՍԻՐԵԼԻ ԸՆՏԱՆԻՔ ԵՎ ԸՆԿԵՐՆԵՐ",
    inviteText: [
      "Մեծ սիրով,",
      "հրավիրում ենք ձեզ կիսելու մեր կյանքի ամենակարևոր օրերից մեկը։",
      "Մենք ամուսնանում ենք,",
      "և մեզ համար շատ կարևոր կլինի",
      "այս հատուկ պահը միասին տոնել ձեր հետ։",
      "Անհամբեր սպասում ենք ձեզ",
    ],
    inviteDateLabel: "",
    locationsTitle: "Վայրեր",
    churchName: "Գեղարդի վանք",
    churchArea: "Գեղարդ",
    googleMap: "Google քարտեզ",
    yandexMap: "Yandex քարտեզ",
    churchNote: "Խնդրում ենք այս վայր այցելել հարմար կոշիկով։",
    restaurantName: "Վիվալդի Հոլ",
    restaurantAddress: "Ազատության պող. 24/44, Երևան",
    restaurantNote: "Կայանատեղին հասանելի է տեղում։",
    timingTitle: "ԺԱՄԱՆԱԿԱՑՈՒՅՑ",
    eventChurch: "Եկեղեցի",
    eventRestaurant: "Ռեստորան",
    eventEnd: "Երեկոյի ավարտ",
    quote: "ՍԵՐԸ ՊԱՐԶԱՊԵՍ ԶԳԱՑՄՈՒՆՔ ՉԷ, ԱՅԼ ԱՄԲՈՂՋ ԱՇԽԱՐՀ։ ԵՎ ՈՒՐԱԽ ԵՆՔ ԱՅՍ ԱՇԽԱՐՀԸ ԿԻՍԵԼ ՁԵԶ ՀԵՏ։",
    rsvpTitle: "Մասնակցություն",
    rsvpText: "Խնդրում ենք մինչև",
    formNameLabel: "Ձեր անունը",
    formNamePlaceholder: "Ամբողջական անուն",
    formAttendanceLabel: "Կկարողանա՞ք մասնակցել։",
    formAttendancePlaceholder: "Ընտրել",
    formAttendanceYes: "Այո",
    formAttendanceNo: "Ոչ",
    formAttendanceMaybe: "Դեռ վստահ չեմ",
    formGuestCountLabel: "Ձեզ հետ միացող հյուրերի քանակը",
    formGuestNamesLabel: "Ձեզ հետ միացող մարդկանց ամբողջական անունները",
    formGuestNamesPlaceholder: "Գրեք ամբողջական անունները (եթե կան)",
    submitSurvey: "Լրացնել հարցաթերթիկը",
    countdownTitle: "ԿՏԵՍՆՎԵՆՔ",
    days: "օր",
    hours: "ժամ",
    minutes: "րոպե",
    seconds: "վայրկյան",
    chatsTitle: "ԽՄԲԱՅԻՆ ՉԱԹԵՐ",
    chatsText: "Միացեք մեր խմբային չաթերին՝ հարսանիքից հետո լուսանկարներն ու տեսանյութերը կիսվելու համար։",
    telegramGroup: "Telegram խումբ",
    whatsappGroup: "WhatsApp խումբ",
    contactsTitle: "ԿԱՊ",
    contactsText: "Հարցերի դեպքում խնդրում ենք կապ հաստատել մեր հարսանեկան կազմակերպչի հետ։",
    contactUs: "Կապ մեզ հետ",
  },
  ru: {
    topBar: "День свадьбы",
    heroCity: "Ереван, Армения",
    navLocations: "Локации",
    navTimeline: "Тайминг",
    navRsvp: "RSVP",
    musicTitle: "Хотите включить музыку?",
    musicText: "Это можно изменить в любой момент, обновив страницу.",
    yes: "Да",
    no: "Нет",
    inviteTitle: "ДОРОГИЕ РОДНЫЕ И ДРУЗЬЯ!",
    inviteText: [
      "С радостью в сердце,",
      "приглашаем вас разделить один из самых важных дней нашей жизни.",
      "Мы женимся,",
      "и для нас будет очень важно",
      "разделить этот особенный момент вместе с вами.",
      "С нетерпением ждем встречи с вами",
    ],
    inviteDateLabel: "",
    locationsTitle: "Локации",
    churchName: "Монастырь Гегард",
    churchArea: "Гегард",
    googleMap: "Google карта",
    yandexMap: "Yandex карта",
    churchNote: "Пожалуйста, наденьте удобную обувь для этой локации.",
    restaurantName: "Vivaldi Hall",
    restaurantAddress: "пр. Азатутян 24/44, Ереван",
    restaurantNote: "На территории есть парковка.",
    timingTitle: "ТАЙМИНГ",
    eventChurch: "Церковь",
    eventRestaurant: "Ресторан",
    eventEnd: "Завершение вечера",
    quote: "ЛЮБОВЬ ЭТО НЕ ПРОСТО ЧУВСТВО, ЭТО ЦЕЛЫЙ МИР. МЫ СЧАСТЛИВЫ РАЗДЕЛИТЬ ЭТОТ МИР С ВАМИ!",
    rsvpTitle: "RSVP",
    rsvpText: "Просим подтвердить ваше присутствие и ответить на несколько важных вопросов до",
    formNameLabel: "Ваше имя",
    formNamePlaceholder: "Полное имя",
    formAttendanceLabel: "Сможете присутствовать?",
    formAttendancePlaceholder: "Выберите",
    formAttendanceYes: "Да",
    formAttendanceNo: "Нет",
    formAttendanceMaybe: "Пока не уверен(а)",
    formGuestCountLabel: "Количество гостей, которые будут с вами",
    formGuestNamesLabel: "Полные имена гостей, которые будут с вами",
    formGuestNamesPlaceholder: "Укажите полные имена (если есть)",
    submitSurvey: "Заполнить анкету",
    countdownTitle: "УВИДИМСЯ ЧЕРЕЗ",
    days: "дней",
    hours: "часов",
    minutes: "минут",
    seconds: "секунд",
    chatsTitle: "ГРУППОВЫЕ ЧАТЫ",
    chatsText: "Присоединяйтесь к нашим чатам, чтобы делиться фото и видео после свадьбы.",
    telegramGroup: "Группа Telegram",
    whatsappGroup: "Группа WhatsApp",
    contactsTitle: "КОНТАКТЫ",
    contactsText: "Если у вас есть вопросы, свяжитесь с нашим свадебным организатором.",
    contactUs: "Связаться с нами",
  },
} as const;

function format2(n: number) {
  return String(n).padStart(2, "0");
}

function useCountdown(targetISO: string) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (now === null) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const diff = Math.max(0, target - now);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function SectionTitle({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center">
      {kicker ? <div className="smallcaps">{kicker}</div> : null}
      <h2 className="mt-3 text-3xl md:text-5xl">{title}</h2>
      {subtitle ? (
        <p className="mt-4 max-w-2xl mx-auto text-black/70">{subtitle}</p>
      ) : null}
    </div>
  );
}

function TopBar({
  title,
  language,
  onLanguageChange,
}: {
  title: string;
  language: Language;
  onLanguageChange: (language: Language) => void;
}) {
  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-black/10">
      <div className="container-page h-12 flex items-center justify-center relative">
        <div className="smallcaps">{title}</div>
        <div className="absolute right-0 flex items-center gap-1 text-xs">
          <button
            className={`px-2 py-1 border border-black/20 ${language === "hy" ? "bg-black text-white" : "bg-white text-black"}`}
            onClick={() => onLanguageChange("hy")}
            type="button"
          >
            Հայ
          </button>
          <button
            className={`px-2 py-1 border border-black/20 ${language === "en" ? "bg-black text-white" : "bg-white text-black"}`}
            onClick={() => onLanguageChange("en")}
            type="button"
          >
            EN
          </button>
          <button
            className={`px-2 py-1 border border-black/20 ${language === "ru" ? "bg-black text-white" : "bg-white text-black"}`}
            onClick={() => onLanguageChange("ru")}
            type="button"
          >
            RU
          </button>
        </div>
      </div>
    </div>
  );
}

function MusicGate({
  onChoice,
  title,
  description,
  yesText,
  noText,
}: {
  onChoice: (play: boolean) => void;
  title: string;
  description: string;
  yesText: string;
  noText: string;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl border border-black/15 bg-white p-8 md:p-10 text-center">
        <h2 className="text-2xl md:text-3xl">{title}</h2>
        <p className="mt-3 text-black/70">{description}</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button className="btn" onClick={() => onChoice(true)}>{yesText}</button>
          <button className="btn" onClick={() => onChoice(false)}>{noText}</button>
        </div>
      </div>
    </div>
  );
}

function LanguageModal({ onSelect }: { onSelect: (language: Language) => void }) {
  return (
    <div className="fixed inset-0 z-[60] bg-white/95 flex items-center justify-center p-6">
      <div className="w-full max-w-xl border border-black/15 bg-white p-8 md:p-10 text-center">
        <h2 className="text-2xl md:text-3xl">Ընտրեք լեզուն / Select language / Выберите язык</h2>
        <div className="mt-8 flex items-center justify-center gap-4 flex-col sm:flex-row">
          <button className="btn w-full sm:w-auto" onClick={() => onSelect("hy")} type="button">Հայերեն</button>
          <button className="btn w-full sm:w-auto" onClick={() => onSelect("en")} type="button">English</button>
          <button className="btn w-full sm:w-auto" onClick={() => onSelect("ru")} type="button">Русский</button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [showGate, setShowGate] = useState(true);
  const [playMusic, setPlayMusic] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const countdown = useCountdown(WEDDING_ISO);
  const t = useMemo(() => COPY[language], [language]);

  useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === "hy" || stored === "en" || stored === "ru") {
      setLanguage(stored);
      return;
    }
    setLanguage("en");
    setShowLanguageModal(true);
  }, []);

  const changeLanguage = (nextLanguage: Language, closeModal = false) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    if (closeModal) {
      setShowLanguageModal(false);
    }
  };

  // Start/stop audio based on playMusic
  useEffect(() => {
    const audio = document.getElementById("bg-audio") as HTMLAudioElement | null;
    if (!audio) return;

    if (playMusic) {
      audio.volume = 0.35;
      audio.play().catch(() => {
        // Some browsers block autoplay until user interaction; gate click usually counts.
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [playMusic]);

  return (
    <main>
      <TopBar title={t.topBar} language={language} onLanguageChange={changeLanguage} />

      {/* Audio */}
      <audio id="bg-audio" loop preload="auto">
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {showGate ? (
        <MusicGate
          title={t.musicTitle}
          description={t.musicText}
          yesText={t.yes}
          noText={t.no}
          onChoice={(play) => {
            setPlayMusic(play);
            setShowGate(false);
          }}
        />
      ) : null}

      {/* HERO */}
      <section className="split min-h-[70vh] md:h-[calc(100svh-3rem)]">
        <div className="flex items-center order-2 md:order-1">
          <div className="container-page py-14 md:py-20">
            <h1
              className="text-5xl md:text-7xl leading-[0.95]"
              style={{ fontFamily: 'var(--font-names, "Times New Roman"), serif' }}
            >
              Ruben <br /> &amp; Zara
            </h1>

            <div className="mt-10 text-sm tracking-[0.15em] uppercase text-black/70">
              12.06.2026 <br />
              {t.heroCity}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a className="btn" href="#locations">{t.navLocations}</a>
              <a className="btn" href="#timing">{t.navTimeline}</a>
              <a className="btn" href="#rsvp">{t.navRsvp}</a>
            </div>
          </div>
        </div>

        <div className="relative min-h-[420px] md:min-h-0 order-1 md:order-2">
          <Image
            src="/hero1.jpg"
            alt="Ruben and Zara"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* INVITE TEXT */}
      <section className="relative border-t-[100px] border-white overflow-hidden">
        <Image
          src="/invite2.jpg"
          alt="Invitation background"
          fill
          className="object-cover"
        />
        <div className="container-page relative z-10 min-h-[48vh] md:min-h-[60vh] py-16 md:py-20 text-center flex items-center justify-center">
          <div
            className="max-w-3xl text-black"
            style={{ fontFamily: 'var(--font-invite, "Times New Roman"), serif' }}
          >
            <h2 className="text-3xl md:text-5xl">{t.inviteTitle}</h2>
            <p className="mt-6 text-lg md:text-xl leading-relaxed text-black/85">
              {t.inviteText[0]}
              <br />
              {t.inviteText[1]}
              <br /><br />
              {t.inviteText[2]}
              <br />
              {t.inviteText[3]}
              <br />
              {t.inviteText[4]}
              <br /><br />
              {t.inviteText[5]}
              <br /><br />
              {t.inviteDateLabel ? `${t.inviteDateLabel} ` : ""}<strong>June 12, 2026</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* LOCATIONS (Church + Restaurant) */}
      <section id="locations" className="section">
        <div className="container-page">
          <SectionTitle title={t.locationsTitle} />
        </div>

        {/* CHURCH */}
        <div className="mt-12 grid grid-cols-2 gap-0">
          <div className="flex items-center">
            <div className="container-page py-14 md:py-16">
              <h3 className="text-3xl md:text-5xl">{t.churchName}</h3>
              <p className="mt-4 text-black/70">
                {t.churchArea}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a className="btn" href={LINKS.churchMaps} target="_blank" rel="noreferrer">
                  {t.googleMap}
                </a>
                <a className="btn" href={LINKS.churchMapsYandex} target="_blank" rel="noreferrer">
                  {t.yandexMap}
                </a>
              </div>

              <div className="hr-center" />
              <p className="text-sm text-black/60 text-center">
                {t.churchNote}
              </p>
            </div>
          </div>
          <div className="relative min-h-[380px] md:min-h-[520px]">
            <Image src="/church1.jpg" alt="Geghard Monastery" fill className="object-cover" />
          </div>
        </div>

        {/* RESTAURANT */}
        <div className="grid grid-cols-2 gap-0">
          <div className="relative min-h-[380px] md:min-h-[520px]">
            <Image src="/restaurant1.jpg" alt="Vivaldi Hall" fill className="object-cover" />
          </div>
          <div className="flex items-center">
            <div className="container-page py-14 md:py-16">
              <h3 className="text-3xl md:text-5xl">{t.restaurantName}</h3>
              <p className="mt-4 text-black/70">
                {t.restaurantAddress}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a className="btn" href={LINKS.restaurantMaps} target="_blank" rel="noreferrer">
                  {t.googleMap}
                </a>
                <a className="btn" href={LINKS.restaurantMapsYandex} target="_blank" rel="noreferrer">
                  {t.yandexMap}
                </a>
              </div>

              <div className="hr-center" />
              <p className="text-sm text-black/60 text-center">
                {t.restaurantNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timing" className="split">
        <div className="relative min-h-[420px] md:min-h-[560px]">
          <Image src="/timing1.jpg" alt="Timing" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-4xl md:text-6xl font-serif tracking-wide">
              {t.timingTitle}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="container-page py-14 md:py-16">
            <div className="space-y-9">
              <div>
                <div className="text-3xl md:text-4xl font-serif">12:45</div>
                <div className="text-black/70">{t.eventChurch}</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-serif">16:00</div>
                <div className="text-black/70">{t.eventRestaurant}</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-serif">23:00</div>
                <div className="text-black/70">{t.eventEnd}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE BAND */}
      <section className="bg-black text-white">
        <div className="container-page py-14 text-center">
          <div className="smallcaps text-white/80">
            {t.quote}
          </div>
        </div>
      </section>

      {/* RSVP + COUNTDOWN */}
      <section id="rsvp" className="section">
        <div className="container-page">
          <div className="split card-soft">
            <div className="relative min-h-[420px] md:min-h-[520px]">
              <Image src="/questionnair1.jpg" alt="Ruben & Zara" fill className="object-cover" />
            </div>

            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-5xl">{t.rsvpTitle}</h2>
              <p className="mt-4 text-black/70">
                {t.rsvpText} <strong>May 1, 2026</strong>.
              </p>

              {/* IMPORTANT:
                 This form is front-end only. To actually receive responses,
                 set the action to Formspree (recommended) or a Google Apps Script endpoint.
              */}
              <form
                className="mt-8 space-y-4"
                action="https://formspree.io/f/mreajdkn"
                method="POST"
              >
                <div>
                  <label className="text-sm text-black/70">{t.formNameLabel}</label>
                  <input
                    name="name"
                    required
                    className="mt-2 w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                    placeholder={t.formNamePlaceholder}
                  />
                </div>

                <div>
                  <label className="text-sm text-black/70">{t.formAttendanceLabel}</label>
                  <select
                    name="attendance"
                    required
                    className="mt-2 w-full border border-black/20 px-4 py-3 outline-none focus:border-black bg-white"
                  >
                    <option value="">{t.formAttendancePlaceholder}</option>
                    <option value="Yes">{t.formAttendanceYes}</option>
                    <option value="No">{t.formAttendanceNo}</option>
                    <option value="Not sure yet">{t.formAttendanceMaybe}</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-black/70">{t.formGuestCountLabel}</label>
                  <input
                    name="guest_count"
                    type="number"
                    min={1}
                    className="mt-2 w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="text-sm text-black/70">{t.formGuestNamesLabel}</label>
                  <textarea
                    name="guest_names"
                    rows={3}
                    className="mt-2 w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                    placeholder={t.formGuestNamesPlaceholder}
                  />
                </div>

                <button className="btn w-full" type="submit">
                  {t.submitSurvey}
                </button>
              </form>

              <div className="hr-center" />

              <div className="text-center">
                <div className="text-3xl md:text-4xl font-serif">{t.countdownTitle}</div>
                <div className="mt-6 grid grid-cols-4 gap-3">
                  <div className="border border-black/20 py-4">
                    <div className="text-3xl font-serif">{countdown.days}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-black/60 mt-1">{t.days}</div>
                  </div>
                  <div className="border border-black/20 py-4">
                    <div className="text-3xl font-serif">{format2(countdown.hours)}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-black/60 mt-1">{t.hours}</div>
                  </div>
                  <div className="border border-black/20 py-4">
                    <div className="text-3xl font-serif">{format2(countdown.minutes)}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-black/60 mt-1">{t.minutes}</div>
                  </div>
                  <div className="border border-black/20 py-4">
                    <div className="text-3xl font-serif">{format2(countdown.seconds)}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-black/60 mt-1">{t.seconds}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GROUP CHATS */}
      <section className="section">
        <div className="container-page">
          <div className="border border-black/10 p-10 text-center">
            <h2 className="text-3xl md:text-5xl">{t.chatsTitle}</h2>
            <p className="mt-4 text-black/70">
              {t.chatsText}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a className="btn" href="https://t.me/+qx18lkoimtM1ZTY0" target="_blank" rel="noreferrer">
                {t.telegramGroup}
              </a>
              <a className="btn" href="https://chat.whatsapp.com/Fxkvrqci6vO2BNCv2IA2kq" target="_blank" rel="noreferrer">
                {t.whatsappGroup}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section className="bg-black text-white">
        <div className="container-page py-16 text-center">
          <h2 className="text-3xl md:text-5xl">{t.contactsTitle}</h2>
          <p className="mt-4 text-white/85">
            {t.contactsText}
          </p>

          <details className="mt-8">
            <summary className="btn inline-flex !border-white !text-white hover:!bg-white hover:!text-black cursor-pointer">
              {t.contactUs}
            </summary>
            <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                className="btn !border-white !text-white hover:!bg-white hover:!text-black"
                href="https://t.me/angelinasag25"
                target="_blank"
                rel="noreferrer"
              >
                Telegram
              </a>
              <a
                className="btn !border-white !text-white hover:!bg-white hover:!text-black"
                href="https://wa.me/79181520333"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </details>
        </div>
      </section>

      <footer className="py-10 text-center text-xs text-black/50">
        {"\u00A9"} {new Date().getFullYear()} R&amp;Z
      </footer>

      {showLanguageModal ? (
        <LanguageModal onSelect={(nextLanguage) => changeLanguage(nextLanguage, true)} />
      ) : null}
    </main>
  );
}
