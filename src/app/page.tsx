"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const WEDDING_ISO = "2026-06-12T15:00:00+04:00"; // Armenia time (AMT). Adjust if you want.

const LINKS = {
  churchMaps: "https://www.google.com/maps/search/?api=1&query=Geghard+Monastery",
  restaurantMaps: "https://www.google.com/maps/search/?api=1&query=Vivaldi+Hall+24%2F44+Azatutyan+Ave+Yerevan",
  churchMapsYandex: "https://yandex.com/maps/?text=Geghard+Monastery",
  restaurantMapsYandex: "https://yandex.com/maps/?text=Vivaldi+Hall+24%2F44+Azatutyan+Ave+Yerevan",
  // Optional: if you want a taxi link, you can use a generic "open maps" or a local taxi app URL.
};

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

function TopBar() {
  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-black/10">
      <div className="container-page h-12 flex items-center justify-center">
        <div className="smallcaps">Wedding Day</div>
      </div>
    </div>
  );
}

function MusicGate({
  onChoice,
}: {
  onChoice: (play: boolean) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl border border-black/15 bg-white p-8 md:p-10 text-center">
        <h2 className="text-2xl md:text-3xl">Would you like to turn on some music?</h2>
        <p className="mt-3 text-black/70">
          You can change this anytime by refreshing the page.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button className="btn" onClick={() => onChoice(true)}>Yes</button>
          <button className="btn" onClick={() => onChoice(false)}>No</button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [showGate, setShowGate] = useState(true);
  const [playMusic, setPlayMusic] = useState(false);

  const countdown = useCountdown(WEDDING_ISO);

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
      <TopBar />

      {/* Audio */}
      <audio id="bg-audio" loop preload="auto">
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {showGate ? (
        <MusicGate
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
              Yerevan, Armenia
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a className="btn" href="#locations">Locations</a>
              <a className="btn" href="#timing">Timeline</a>
              <a className="btn" href="#rsvp">RSVP</a>
            </div>
          </div>
        </div>

        <div className="relative min-h-[420px] md:min-h-0 order-1 md:order-2">
          <Image
            src="/heroUNI2.jpg"
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
          src="/invitezwart.jpg"
          alt="Invitation background"
          fill
          className="object-cover"
        />
        <div className="container-page relative z-10 min-h-[48vh] md:min-h-[60vh] py-16 md:py-20 text-center flex items-center justify-center">
          <div
            className="max-w-3xl text-white"
            style={{ fontFamily: 'var(--font-invite, "Times New Roman"), serif' }}
          >
          <h2 className="text-3xl md:text-5xl">DEAR FAMILY AND FRIENDS!</h2>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-white/85">
            With joyful hearts,
            <br />
            we invite you to share one of the most meaningful days of our lives.
            <br /><br />
            We are getting married,
            <br />
            and it would mean the world to us
            <br />
            to celebrate this special moment together with you.
            <br /><br />
            We look forward to welcoming you
          
            <br /><br />
            on <strong>June 12, 2026</strong>.
          </p>
          </div>
        </div>
      </section>

      {/* LOCATIONS (Church + Restaurant) */}
      <section id="locations" className="section">
        <div className="container-page">
          <SectionTitle
            title="Locations"
          />
        </div>

        {/* CHURCH */}
        <div className="mt-12 grid grid-cols-2 gap-0">
          <div className="flex items-center">
            <div className="container-page py-14 md:py-16">
              <h3 className="text-3xl md:text-5xl">Geghard Monastery</h3>
              <p className="mt-4 text-black/70">
                Geghard 
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a className="btn" href={LINKS.churchMaps} target="_blank" rel="noreferrer">
                  Google map
                </a>
                <a className="btn" href={LINKS.churchMapsYandex} target="_blank" rel="noreferrer">
                  Yandex map
                </a>
              </div>

              <div className="hr-center" />
              <p className="text-sm text-black/60 text-center">
                Please where comfortable shoes at this location.
              </p>
            </div>
          </div>
          <div className="relative min-h-[380px] md:min-h-[520px]">
            <Image src="/churchUNI2.jpg" alt="Geghard Monastery" fill className="object-cover" />
          </div>
        </div>

        {/* RESTAURANT */}
        <div className="grid grid-cols-2 gap-0">
          <div className="relative min-h-[380px] md:min-h-[520px]">
            <Image src="/restaurantUNI2.jpg" alt="Vivaldi Hall" fill className="object-cover grayscale" />
          </div>
          <div className="flex items-center">
            <div className="container-page py-14 md:py-16">
              <h3 className="text-3xl md:text-5xl">Vivaldi Hall</h3>
              <p className="mt-4 text-black/70">
                24/44 Azatutyan Ave, Yerevan
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a className="btn" href={LINKS.restaurantMaps} target="_blank" rel="noreferrer">
                  Google map
                </a>
                <a className="btn" href={LINKS.restaurantMapsYandex} target="_blank" rel="noreferrer">
                  Yandex map
                </a>
              </div>

              <div className="hr-center" />
              <p className="text-sm text-black/60 text-center">
                Parking is available on site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timing" className="split">
        <div className="relative min-h-[420px] md:min-h-[560px]">
          <Image src="/timingUNI2.jpg" alt="Timing" fill className="object-cover grayscale" />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-4xl md:text-6xl font-serif tracking-wide">
              TIMING
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="container-page py-14 md:py-16">
            <div className="space-y-9">
              <div>
                <div className="text-3xl md:text-4xl font-serif">12:45</div>
                <div className="text-black/70">Church</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-serif">16:00</div>
                <div className="text-black/70">Restaurant</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-serif">23:00</div>
                <div className="text-black/70">End of the evening</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE BAND */}
      <section className="bg-black text-white">
        <div className="container-page py-14 text-center">
          <div className="smallcaps text-white/80">
            LOVE ISN&apos;T JUST A FEELING; IT&apos;S A WHOLE WORLD. WE&apos;RE HAPPY TO SHARE THIS WORLD WITH YOU!
          </div>
        </div>
      </section>

      {/* RSVP + COUNTDOWN */}
      <section id="rsvp" className="section">
        <div className="container-page">
          <div className="split card-soft">
            <div className="relative min-h-[420px] md:min-h-[520px]">
              <Image src="/questionnair.jpg" alt="Ruben & Zara" fill className="object-cover" />
            </div>

            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-5xl">RSVP</h2>
              <p className="mt-4 text-black/70">
                We ask you to confirm your attendance and answer a few important questions by <strong>May 1, 2026</strong>.
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
                  <label className="text-sm text-black/70">Your name</label>
                  <input
                    name="name"
                    required
                    className="mt-2 w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="text-sm text-black/70">Will you be able to attend?</label>
                  <select
                    name="attendance"
                    required
                    className="mt-2 w-full border border-black/20 px-4 py-3 outline-none focus:border-black bg-white"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-black/70">Number of guests who are joining you</label>
                  <input
                    name="guest_count"
                    type="number"
                    min={1}
                    className="mt-2 w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="text-sm text-black/70">Full names of people who are joining you</label>
                  <textarea
                    name="guest_names"
                    rows={3}
                    className="mt-2 w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                    placeholder="List full names (if any)"
                  />
                </div>

                <button className="btn w-full" type="submit">
                  Complete the survey
                </button>
              </form>

              <div className="hr-center" />

              <div className="text-center">
                <div className="text-3xl md:text-4xl font-serif">SEE YOU IN</div>
                <div className="mt-6 grid grid-cols-4 gap-3">
                  <div className="border border-black/20 py-4">
                    <div className="text-3xl font-serif">{countdown.days}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-black/60 mt-1">days</div>
                  </div>
                  <div className="border border-black/20 py-4">
                    <div className="text-3xl font-serif">{format2(countdown.hours)}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-black/60 mt-1">hours</div>
                  </div>
                  <div className="border border-black/20 py-4">
                    <div className="text-3xl font-serif">{format2(countdown.minutes)}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-black/60 mt-1">minutes</div>
                  </div>
                  <div className="border border-black/20 py-4">
                    <div className="text-3xl font-serif">{format2(countdown.seconds)}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-black/60 mt-1">seconds</div>
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
            <h2 className="text-3xl md:text-5xl">GROUP CHATS</h2>
            <p className="mt-4 text-black/70">
              Join our group chats to share photo's and video's after the wedding.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a className="btn" href="https://t.me/+qx18lkoimtM1ZTY0" target="_blank" rel="noreferrer">
                Telegram group
              </a>
              <a className="btn" href="https://chat.whatsapp.com/Fxkvrqci6vO2BNCv2IA2kq" target="_blank" rel="noreferrer">
                WhatsApp group
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section className="bg-black text-white">
        <div className="container-page py-16 text-center">
          <h2 className="text-3xl md:text-5xl">CONTACTS</h2>
          <p className="mt-4 text-white/85">
            If you have any questions, please contact our wedding planner.
          </p>

          <details className="mt-8">
            <summary className="btn inline-flex !border-white !text-white hover:!bg-white hover:!text-black cursor-pointer">
              Contact us
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
        © {new Date().getFullYear()} R&Z
      </footer>
    </main>
  );
}
