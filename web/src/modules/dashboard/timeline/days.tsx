import Image from "next/image";

export default function Days() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {DAYS.map((day, index) => (
        <div key={index} className="relative min-h-64 overflow-hidden rounded-lg bg-white p-4">
          {/* Day */}
          <div className="relative z-10 flex h-full flex-col items-start justify-between">
            <div className="rounded bg-white px-2 py-1 text-sm font-semibold text-black">
              Day {day.day}
            </div>

            {/* Event's Name */}
            <h2 className="relative z-10 mt-auto mb-0 text-xl font-bold text-white">{day.name}</h2>
          </div>

          {/* Background Image */}
          <Image
            src={`/assets/councils/thumbnail/brics.webp`}
            alt={day.name}
            fill
            className="z-0 object-cover"
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        </div>
      ))}
    </section>
  );
}

const DAYS = [
  {
    day: 1,
    name: "Opening",
  },
  {
    day: 2,
    name: "Opening",
  },
  {
    day: 3,
    name: "Opening",
  },
  {
    day: 4,
    name: "Opening",
  },
];
