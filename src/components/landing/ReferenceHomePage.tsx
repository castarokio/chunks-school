'use client';

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Info,
  Menu,
  Play,
  School,
  UserRoundCog,
  UsersRound,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

const image = (id: string, w = 1200, h = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=82`;

const navItems = ['Home', 'About Us', 'Academics', 'Chunks', 'Admission', 'Community', 'Careers'];

const whyCards = [
  {
    title: 'Boutique School',
    icon: Building2,
    src: image('photo-1580582932707-520aed937b7b', 700, 900),
  },
  {
    title: 'International Education',
    icon: School,
    src: image('photo-1509062522246-3755977927d7', 700, 900),
  },
  {
    title: 'American Core Curriculum',
    icon: BookOpen,
    src: image('photo-1577896851231-70ef18881754', 700, 900),
  },
  {
    title: 'Door To A Bright Future',
    icon: GraduationCap,
    src: image('photo-1577896851231-70ef18881754', 700, 900),
  },
];

const quickLinks = [
  {
    title: 'Registration Enquiry',
    body: 'Parents can submit admission interest and contact details for a guided school response.',
    cta: 'Enquire Now',
    icon: UsersRound,
  },
  {
    title: 'Fee Payment',
    body: 'Pay class, transport, and activity fees through a secure parent-friendly payment path.',
    cta: 'Pay Now',
    icon: CreditCard,
    featured: true,
  },
  {
    title: 'Parent Portal',
    body: 'Access marks, course progress, attendance, payments, and school notices in one place.',
    cta: 'Visit Portal',
    icon: UserRoundCog,
  },
  {
    title: 'Online Re-Registration',
    body: 'Returning families can update student records and confirm the next academic year.',
    cta: 'Register Now',
    icon: ClipboardList,
  },
];

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function DisplayHeading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`font-[Impact,'Arial_Narrow',sans-serif] text-[3.4rem] uppercase leading-[0.88] tracking-normal text-[#111] md:text-[5.1rem] ${className}`}>
      {children}
    </h2>
  );
}

function RedPillButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 items-center justify-center rounded-full bg-[#ef232a] px-7 text-[0.72rem] font-black uppercase tracking-normal text-white shadow-[0_10px_22px_rgba(239,35,42,0.28)] transition hover:bg-[#d91d24]"
    >
      {children}
    </button>
  );
}

function MapleLeaf() {
  return (
    <span className="inline-block text-xl leading-none" aria-hidden="true">
      &#x2738;
    </span>
  );
}

export default function ReferenceHomePage() {
  const { setCurrentView } = useAppStore();

  return (
    <div dir="ltr" className="min-h-screen bg-[#f4f1ee] font-['Arial_Narrow',Arial,sans-serif] text-[#111]">
      <header className="absolute left-1/2 top-3 z-30 flex h-[4.6rem] w-[calc(100%-2rem)] max-w-[1080px] -translate-x-1/2 items-center justify-between rounded-full bg-white px-4 shadow-[0_12px_28px_rgba(0,0,0,0.14)] md:px-8">
        <div className="flex items-center gap-3">
          <div className="grid size-14 place-items-center rounded-full border-4 border-white bg-[#ef232a] text-center text-[0.62rem] font-black uppercase leading-none text-white shadow">
            CH
          </div>
        </div>
        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href={item === 'Home' ? '#home' : `#${item.toLowerCase().replaceAll(' ', '-')}`}
              className={`relative text-[0.68rem] font-black uppercase tracking-normal transition hover:text-[#ef232a] ${item === 'Home' ? 'text-[#ef232a]' : 'text-[#151515]'}`}
            >
              {item}
              {item === 'Home' && <span className="absolute -bottom-4 left-1/2 h-0.5 w-6 -translate-x-1/2 bg-[#ef232a]" />}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentView('login')}
            className="hidden h-10 rounded-full bg-[#ef232a] px-8 text-[0.68rem] font-black uppercase tracking-normal text-white transition hover:bg-[#d91d24] sm:inline-flex sm:items-center"
          >
            Login
          </button>
          <button type="button" className="grid size-10 place-items-center rounded-full bg-[#111] text-white lg:hidden" aria-label="Open menu">
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="px-3 pt-4 md:px-8">
          <div className="relative mx-auto h-[35rem] max-w-[1360px] overflow-hidden rounded-[1.45rem] md:h-[42rem]">
            <img
              src={image('photo-1509062522246-3755977927d7', 1800, 1000)}
              alt="Students standing outside school"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/5" />
            <div className="relative z-10 flex h-full max-w-[34rem] flex-col justify-center px-7 pt-16 text-white md:px-24">
              <p className="mb-3 text-[0.84rem] font-black uppercase tracking-normal">Bringing Talent To Life</p>
              <h1 className="font-[Impact,'Arial_Narrow',sans-serif] text-[4.5rem] uppercase leading-[0.82] tracking-normal md:text-[7.2rem]">
                Chunks <br /> Learning <br /> School
              </h1>
              <div className="mt-8 flex flex-wrap gap-4">
                <RedPillButton onClick={() => setCurrentView('register')}>Enquire Now</RedPillButton>
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-7 text-[0.72rem] font-black uppercase tracking-normal text-[#111] transition hover:bg-[#f4f1ee]"
                >
                  About Us
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="about-us" className="px-6 py-24 md:px-12 lg:py-32">
          <div className="mx-auto grid max-w-[1160px] items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
            <div>
              <p className="mb-3 text-sm font-black uppercase text-[#ef232a]">Case To Story</p>
              <DisplayHeading>
                Welcome To <span className="text-[#ef232a]">Chunks</span> <br /> Learning School
              </DisplayHeading>
              <p className="mt-7 max-w-[31rem] text-sm font-bold uppercase leading-7 text-[#55514e]">
                At Chunks School, our team is committed to providing the very best for every child and every family.
                Better learning outcomes within a caring environment where everyone feels happy, safe, and secure.
              </p>
            </div>
            <img
              src={image('photo-1546410531-bb4caa6b424d', 900, 900)}
              alt="Student playing with colorful blocks"
              className="aspect-[1.05/1] w-full rounded-2xl object-cover shadow-[0_18px_42px_rgba(0,0,0,0.22)]"
            />
          </div>
        </section>

        <section id="academics" className="bg-[#111] px-6 py-20 text-white md:px-12 lg:py-28">
          <div className="mx-auto max-w-[1160px]">
            <p className="mb-2 text-sm font-black uppercase text-[#ef232a]">Choose Chunks?</p>
            <h2 className="font-[Impact,'Arial_Narrow',sans-serif] text-[3.4rem] uppercase leading-[0.88] tracking-normal md:text-[5.1rem]">
              Why Learn With Us?
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {whyCards.map(({ title, icon: Icon, src }) => (
                <article key={title} className="group relative aspect-[0.72] overflow-hidden rounded-xl bg-black">
                  <img src={src} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-5">
                    <Icon className="mb-3 size-5 text-white" />
                    <h3 className="font-[Impact,'Arial_Narrow',sans-serif] text-2xl uppercase leading-none text-white">{title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="admission" className="px-6 py-24 md:px-12 lg:py-32">
          <div className="mx-auto max-w-[1160px]">
            <p className="mb-2 text-sm font-black uppercase text-[#ef232a]">Contact Us</p>
            <DisplayHeading>Quick Link To <br /> Connect</DisplayHeading>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map(({ title, body, cta, icon: Icon, featured }) => (
                <article
                  key={title}
                  className={`flex min-h-[18rem] flex-col rounded-2xl p-7 shadow-[0_13px_32px_rgba(0,0,0,0.12)] transition hover:-translate-y-1 ${
                    featured ? 'bg-gradient-to-br from-[#ff343b] to-[#d71920] text-white' : 'bg-white text-[#111]'
                  }`}
                >
                  <Icon className={`mb-6 size-10 ${featured ? 'text-white' : 'text-[#ef232a]'}`} />
                  <h3 className="font-[Impact,'Arial_Narrow',sans-serif] text-[1.7rem] uppercase leading-none">{title}</h3>
                  <p className={`mt-4 text-xs font-bold uppercase leading-6 ${featured ? 'text-white/85' : 'text-[#6b6662]'}`}>{body}</p>
                  <button
                    type="button"
                    className={`mt-auto h-9 self-start rounded-full px-5 text-[0.65rem] font-black uppercase ${
                      featured ? 'bg-white text-[#ef232a]' : 'border border-[#ef232a] text-[#ef232a]'
                    }`}
                  >
                    {cta}
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="relative h-32 overflow-hidden bg-[#f4f1ee]">
          {[-10, 23, 57].map((top, index) => (
            <div
              key={top}
              className={`absolute left-[-8%] flex w-[116%] items-center gap-8 border-y border-[#f4c430] bg-white py-3 font-[Impact,'Arial_Narrow',sans-serif] text-2xl uppercase text-[#111] ${
                index === 1 ? '-rotate-6' : 'rotate-6'
              }`}
              style={{ top }}
            >
              {Array.from({ length: 8 }).map((_, item) => (
                <span key={item} className="inline-flex shrink-0 items-center gap-4">
                  <MapleLeaf /> Bringing A Talent To Life
                </span>
              ))}
            </div>
          ))}
        </div>

        <section className="px-6 py-24 md:px-12 lg:py-32">
          <div className="mx-auto max-w-[1160px]">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="mb-2 text-sm font-black uppercase text-[#111]">Our Program</p>
                <DisplayHeading>Journey Of Education At <span className="text-[#ef232a]">Chunks</span></DisplayHeading>
              </div>
              <div className="hidden gap-3 md:flex">
                <button type="button" className="grid size-11 place-items-center rounded-full border border-[#111]"><ArrowLeft className="size-5" /></button>
                <button type="button" className="grid size-11 place-items-center rounded-full border border-[#111]"><ArrowRight className="size-5" /></button>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 text-center text-xs font-black uppercase">
              {['Kindergarten', 'Elementary School', 'High School'].map((tab, index) => (
                <div key={tab} className="relative border-t-2 border-[#111] pt-5">
                  <span className={`absolute -top-[0.42rem] left-1/2 size-3 -translate-x-1/2 rounded-full ${index === 0 ? 'bg-[#ef232a]' : 'bg-[#111]'}`} />
                  <span className={index === 0 ? 'text-[#ef232a]' : 'text-[#111]'}>{tab}</span>
                </div>
              ))}
            </div>

            <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
              <div className="grid grid-cols-2 gap-5">
                <img src={image('photo-1546410531-bb4caa6b424d', 800, 500)} alt="Kindergarten activity" className="col-span-2 aspect-[1.9/1] rounded-xl object-cover shadow-[0_12px_28px_rgba(0,0,0,0.16)]" />
                <img src={image('photo-1588072432836-e10032774350', 500, 420)} alt="Students studying" className="aspect-[1.15/1] rounded-xl object-cover shadow-[0_12px_28px_rgba(0,0,0,0.14)]" />
                <img src={image('photo-1509062522246-3755977927d7', 500, 420)} alt="Classroom learning" className="aspect-[1.15/1] rounded-xl object-cover shadow-[0_12px_28px_rgba(0,0,0,0.14)]" />
              </div>
              <div>
                <h3 className="font-[Impact,'Arial_Narrow',sans-serif] text-[3.6rem] uppercase leading-none">Kindergarten</h3>
                <p className="mt-5 text-sm font-bold uppercase leading-7 text-[#55514e]">
                  The kindergarten program creates a confident foundation through curiosity, language, play, early numeracy,
                  and classroom routines that make children feel prepared for the years ahead.
                </p>
                <button type="button" className="mt-8 inline-flex h-12 items-center gap-4 rounded-full bg-[#ef232a] pl-7 pr-3 text-xs font-black uppercase text-white">
                  Read More <span className="grid size-8 place-items-center rounded-full bg-white text-[#ef232a]"><ArrowRight className="size-4" /></span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 md:px-12">
          <div className="mx-auto max-w-[1060px]">
            <DisplayHeading className="text-center">Academic Calendar</DisplayHeading>
            <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_rgba(0,0,0,0.13)] lg:grid lg:grid-cols-[13rem_1fr_18rem]">
              <aside className="bg-[#e72828] p-6 text-white">
                <div className="mb-8 flex items-center gap-3 font-[Impact,'Arial_Narrow',sans-serif] text-3xl">
                  <ArrowLeft className="size-5" /> 2025 <ArrowRight className="size-5" />
                </div>
                <div className="space-y-3 text-xs font-black uppercase">
                  {months.map((month) => (
                    <div key={month} className={`rounded-full px-4 py-2 ${month === 'September' ? 'bg-[#8d8d8d]' : ''}`}>{month}</div>
                  ))}
                </div>
                <Menu className="mt-8 size-8" />
              </aside>
              <div className="p-7">
                <h3 className="mb-8 text-sm font-black uppercase text-[#8d8d8d]">September 2025</h3>
                <div className="grid grid-cols-7 gap-y-5 text-center text-xs font-bold uppercase text-[#8d8d8d]">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}
                  {Array.from({ length: 35 }).map((_, index) => (
                    <span key={index} className={`mx-auto grid size-8 place-items-center rounded-full ${index === 27 ? 'bg-[#ef232a] text-white' : [1, 7, 14, 18, 30].includes(index) ? 'text-[#ef232a]' : 'text-[#777]'}`}>
                      {index < 30 ? index + 1 : ''}
                    </span>
                  ))}
                </div>
              </div>
              <aside className="border-l border-[#e5dfda] p-7">
                <div className="mb-7 flex items-center justify-between">
                  <h3 className="text-2xl font-black">September 2025</h3>
                  <span className="grid size-8 place-items-center rounded-full bg-[#ef232a] text-white"><Info className="size-4" /></span>
                </div>
                {['First installment fees due', 'First day of school', 'Extended day program begins', 'Parent open house', 'Assessment week'].map((event) => (
                  <div key={event} className="mb-5 flex gap-3 text-xs font-black uppercase leading-5 text-[#6b6662]">
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-[#ef232a]" />
                    {event}
                  </div>
                ))}
              </aside>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:px-12">
          <div className="mx-auto grid max-w-[960px] gap-8 lg:grid-cols-[1fr_3rem]">
            <div>
              <p className="mb-2 text-sm font-black uppercase text-[#ef232a]">Testimonial</p>
              <DisplayHeading>What Parents Say <br /> About Us</DisplayHeading>
              <div className="mt-8 flex gap-5">
                <span className="font-[Impact,'Arial_Narrow',sans-serif] text-7xl leading-none text-[#ef232a]">&ldquo;</span>
                <div>
                  <p className="max-w-[44rem] text-sm font-black uppercase leading-7 text-[#111]">
                    The school administration is professional and thoughtful. We see improvement in language, confidence,
                    and classroom habits every month.
                  </p>
                  <div className="mt-7 inline-flex h-12 w-80 max-w-full items-center justify-center rounded-full bg-[#111] text-white">
                    <Play className="size-5 fill-white" />
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <img src={image('photo-1494790108377-be9c29b29330', 100, 100)} alt="Parent avatar" className="size-11 rounded-full object-cover" />
                    <span className="text-xs font-black uppercase">Ms. Leila Banks</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden flex-col items-center justify-center gap-3 lg:flex">
              <ArrowLeft className="size-5 rotate-90 text-[#8d8d8d]" />
              {[0, 1, 2, 3, 4].map((dot) => <span key={dot} className={`size-3 rounded-full ${dot === 2 ? 'bg-[#ef232a]' : 'bg-[#b8b3ae]'}`} />)}
              <ArrowRight className="size-5 rotate-90 text-[#8d8d8d]" />
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 md:px-12">
          <div className="relative mx-auto min-h-[24rem] max-w-[1160px] overflow-hidden rounded-3xl bg-[#111] px-8 py-16 text-center text-white">
            <div className="absolute -left-14 bottom-0 flex rotate-[-14deg] gap-3 opacity-90">
              {[1, 2, 3, 4, 5].map((item) => (
                <img key={item} src={image('photo-1509062522246-3755977927d7', 220, 260)} alt="" className="h-36 w-28 rounded-lg object-cover shadow-xl" />
              ))}
            </div>
            <div className="absolute -right-14 bottom-0 flex rotate-[14deg] gap-3 opacity-90">
              {[1, 2, 3, 4, 5].map((item) => (
                <img key={item} src={image('photo-1577896851231-70ef18881754', 220, 260)} alt="" className="h-36 w-28 rounded-lg object-cover shadow-xl" />
              ))}
            </div>
            <div className="relative z-10 mx-auto max-w-[27rem] pt-16">
              <p className="text-xs font-black uppercase text-white/70">Work Together</p>
              <h2 className="font-[Impact,'Arial_Narrow',sans-serif] text-[3.2rem] uppercase leading-[0.9]">Let&apos;s Secure Your Kid&apos;s Future</h2>
              <button type="button" onClick={() => setCurrentView('register')} className="mt-6 inline-flex h-9 items-center gap-2 rounded-full bg-[#ef232a] px-5 text-[0.65rem] font-black uppercase text-white">
                Enquire <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#151515] px-6 pt-14 text-white md:px-12">
        <div className="mx-auto grid max-w-[1160px] gap-10 pb-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="flex items-start gap-4">
            <div className="grid size-14 place-items-center rounded-full border border-white/30 text-sm font-black">CH</div>
            <p className="max-w-xs text-xs font-bold uppercase leading-6 text-white/55">
              Premium bilingual learning for students, families, and teachers.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-black uppercase">Quick Links</h3>
            <div className="grid gap-2 text-xs font-bold uppercase text-white/50">
              <span>About</span><span>Admission</span><span>Academics</span><span>Careers</span>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-black uppercase">Newsletter</h3>
            <div className="flex max-w-xs rounded-full bg-white p-1">
              <input aria-label="Email address" placeholder="Email" className="min-w-0 flex-1 bg-transparent px-4 text-xs font-bold uppercase text-[#111] outline-none" />
              <button type="button" className="rounded-full bg-[#ef232a] px-5 text-[0.65rem] font-black uppercase">Subscribe</button>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-black uppercase">Contact Us</h3>
            <div className="grid gap-2 text-xs font-bold uppercase text-white/50">
              <span>info@chunks.school</span><span>+213 555 123 456</span><span>Algiers, Algeria</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-[0.65rem] font-bold uppercase text-white/40">
          Privacy Policy / Terms & Conditions
        </div>
      </footer>
    </div>
  );
}
