'use client';

import { useState } from 'react';

type AccordionPanel = {
  number: string;
  label: string;
  kicker: string;
  title: string;
  color: string;
  weight: number;
  body: string;
};

const panels: AccordionPanel[] = [
  {
    number: '1',
    label: 'Hairline',
    kicker: 'Mont-Royal',
    title: 'Mont-Royal',
    color: '#D83B83',
    weight: 100,
    body: `Rising at the heart of the city, Mont-Royal is Montréal's defining landmark. Designed by Frederick Law Olmsted, the park spans over 200 hectares of forested trails, meadows, and lookouts. At the summit, the iconic belvedere offers a sweeping panorama of the skyline and the St. Lawrence River. In winter, locals gather to skate, ski and toboggan. In summer, the mountain pulses with picnics and tam-tams. It is not just a park, it is the lungs and soul of the city.`,
  },
  { number: '2', label: 'Extralight', kicker: 'Old Port', title: 'Old Port', color: '#FF6638', weight: 200, body: 'A bright waterfront path where school groups can study architecture, trade, navigation, and the rhythm of a city built beside the river.' },
  { number: '3', label: 'Thin', kicker: 'Science Centre', title: 'Science Centre', color: '#ECEB22', weight: 200, body: 'Hands-on experiments, media labs, and interactive displays turn classroom questions into visible, memorable discoveries.' },
  { number: '4', label: 'Light', kicker: 'Botanical Garden', title: 'Botanical Garden', color: '#20B845', weight: 300, body: 'Glasshouses, themed gardens, and living collections make nature feel structured, surprising, and close enough to inspect.' },
  {
    number: '5',
    label: 'Book',
    kicker: 'Vieux-Montréal',
    title: 'Vieux-Montréal',
    color: '#4366F4',
    weight: 400,
    body: `Vieux-Montréal is where the city was born. Cobblestone streets wind past 17th-century stone buildings, the old port, and the magnificent Place Jacques-Cartier. History here is not preserved behind glass, it is inhabited. Boutique hotels occupy former banks; galleries fill old warehouses; restaurants spill onto terraces overlooking the St. Lawrence. The neighbourhood rewards the slow walker willing to duck into a courtyard or push open an unmarked door. Every corner holds another century.`,
  },
  { number: '6', label: 'Regular', kicker: 'Library Hall', title: 'Library Hall', color: '#5B55B5', weight: 400, body: 'A quiet destination for reading circles, research practice, and students learning how to follow curiosity through primary sources.' },
  { number: '7', label: 'Medium', kicker: 'Design Lab', title: 'Design Lab', color: '#9B6BD3', weight: 500, body: 'A practical workshop for turning lessons into prototypes, posters, models, and collaborative problem solving.' },
  { number: '8', label: 'Semibold', kicker: 'Language Studio', title: 'Language Studio', color: '#E95BB7', weight: 600, body: 'Conversation, listening drills, and performance practice help students use new vocabulary with confidence.' },
  { number: '9', label: 'Bold', kicker: 'Sports Court', title: 'Sports Court', color: '#B96943', weight: 700, body: 'Movement, teamwork, and competition give students a second classroom for discipline, communication, and resilience.' },
  { number: '10', label: 'Extrabold', kicker: 'Makers Room', title: 'Makers Room', color: '#B0B0B0', weight: 800, body: 'Tools, materials, and guided constraints help students learn by building, revising, and explaining their decisions.' },
  { number: '11', label: 'Black', kicker: 'Main Stage', title: 'Main Stage', color: '#9E9E9E', weight: 900, body: 'Presentations, debates, and performances turn learning into a public act of courage and clarity.' },
];

export default function AttractionsAccordion() {
  const [active, setActive] = useState(4);
  const displayFont = '"Chunks Accordion", "Arial Narrow", Arial, sans-serif';
  const activeBasis = 'clamp(520px, 31.5vw, 620px)';
  const railBasis = 'clamp(76px, calc((100vw - clamp(520px, 31.5vw, 620px)) / 10), 128px)';

  return (
    <section id="attractions" className="bg-[#F0E7D4] text-[#282B28]" aria-labelledby="attractions-title">
      <div className="overflow-hidden pt-6 md:pt-8">
        <h2
          id="attractions-title"
          className="pointer-events-none -mb-6 -translate-y-6 px-5 text-[clamp(5.2rem,12vw,14rem)] font-light leading-[0.76] md:-translate-y-10 md:px-9"
          style={{ fontFamily: displayFont }}
        >
          Attractions
        </h2>

        <div className="hidden h-[590px] w-full overflow-hidden xl:flex">
          {panels.map((panel, index) => {
            const isActive = active === index;

            return (
              <button
                key={panel.number}
                type="button"
                aria-label={`${panel.number}. ${panel.kicker}: ${panel.title}`}
                aria-expanded={isActive}
                aria-controls={`attraction-panel-${panel.number}`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                className="relative h-full shrink-0 cursor-pointer overflow-hidden text-left text-[#282B28] outline-none transition-[flex-basis] duration-700 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#282B28]"
                style={{
                  backgroundColor: panel.color,
                  flexBasis: isActive ? activeBasis : railBasis,
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  fontFamily: displayFont,
                }}
              >
                <div className="grid h-full" style={{ gridTemplateColumns: `${railBasis} 1fr` }}>
                  <div className="relative h-full overflow-hidden">
                    <span
                      className="absolute left-1/2 top-7 block origin-center -translate-x-1/2 whitespace-nowrap text-[clamp(4.25rem,5.55vw,7.35rem)] leading-none"
                      style={{
                        fontWeight: panel.weight,
                        transform: 'translateX(-50%) rotate(-90deg)',
                      }}
                    >
                      {panel.label}
                    </span>
                    <span
                      className={`absolute bottom-[6.15rem] max-w-[4.65rem] text-[0.58rem] font-extrabold uppercase leading-[0.98] ${
                        panel.number.length > 1 ? 'left-2.5' : 'left-4'
                      }`}
                    >
                      {panel.kicker}
                    </span>
                    <span
                      className={`absolute bottom-6 font-extrabold leading-none ${
                        panel.number.length > 1
                          ? 'left-2 text-[clamp(3.45rem,4.4vw,6.6rem)]'
                          : 'left-4 text-[clamp(4.8rem,5.7vw,8.7rem)]'
                      }`}
                      style={{ fontFeatureSettings: '"tnum"' }}
                    >
                      {panel.number}
                    </span>
                  </div>

                  <div
                    id={`attraction-panel-${panel.number}`}
                    className={`relative border-l border-[#282B28] px-9 pt-10 transition-all duration-500 ${
                      isActive ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-2 opacity-0 delay-0'
                    }`}
                    style={{ fontFamily: displayFont }}
                  >
                    <h3 className="text-[clamp(3.1rem,3.75vw,4.35rem)] font-light leading-none">
                      {panel.title}
                    </h3>
                    <p className="mt-20 max-w-[430px] text-[clamp(1.28rem,1.42vw,1.72rem)] font-light leading-[1.08]">
                      {panel.body}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 px-4 xl:hidden">
          {panels.map((panel, index) => {
            const isActive = active === index;

            return (
              <button
                key={panel.number}
                type="button"
                aria-label={`${panel.number}. ${panel.kicker}: ${panel.title}`}
                aria-expanded={isActive}
                onClick={() => setActive(index)}
                onFocus={() => setActive(index)}
                className="overflow-hidden rounded-none text-left text-[#282B28] outline-none focus-visible:ring-2 focus-visible:ring-[#282B28]"
                style={{ backgroundColor: panel.color, fontFamily: displayFont }}
              >
                <div className="flex min-h-28 items-center gap-5 px-5">
                  <span className={`${panel.number.length > 1 ? 'text-6xl' : 'text-7xl'} font-extrabold leading-none`}>
                    {panel.number}
                  </span>
                  <span className="grid gap-1">
                    <span className="text-xs font-extrabold uppercase leading-none">{panel.kicker}</span>
                    <span className="text-5xl leading-none" style={{ fontWeight: panel.weight }}>
                      {panel.label}
                    </span>
                  </span>
                </div>
                <div className={`grid transition-[grid-template-rows] duration-500 ${isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="border-t border-[#282B28] px-5 pb-6 pt-5">
                      <h3 className="text-5xl font-light leading-none">{panel.title}</h3>
                      <p className="mt-5 text-xl font-light leading-[1.1]">{panel.body}</p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="h-16 md:h-20" />
      </div>
    </section>
  );
}
