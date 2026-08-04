interface Panel {
  image: string;
  category: string;
  cta: string;
  href: string;
}

const panels: Panel[] = [
  {
    image: "/images/lifestyle-shoes.png",
    category: "Shoes Collection",
    cta: "Belanja Sekarang",
    href: "#",
  },
  {
    image: "/images/lifestyle-new.png",
    category: "New This Week",
    cta: "Belanja Sekarang",
    href: "#",
  },
];

export function DualLifestyleBanner() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 w-full">
      {panels.map((panel) => (
        <a
          key={panel.category}
          href={panel.href}
          className="relative block overflow-hidden group"
        >
          <img
            src={panel.image}
            alt={panel.category}
            className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-8 left-6">
            <p className="text-black text-[15px] uppercase tracking-widest font-semibold mb-1">
              {panel.category}
            </p>
            <p className="text-black text-[14px] underline tracking-wide">{panel.cta}</p>
          </div>
        </a>
      ))}
    </section>
  );
};

