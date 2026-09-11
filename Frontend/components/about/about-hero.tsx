export function AboutHero() {
  return (
    <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/19447626/pexels-photo-19447626.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
          alt="DesiZaika restaurant interior"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="px-4 text-center">
          <p className="animate-hero-badge mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
            Est. 2015
          </p>
          <h1 className="animate-hero-title font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Our Story
          </h1>
          <p className="animate-hero-text mx-auto mt-4 max-w-xl text-lg text-white/80">
            A family&apos;s journey from a home kitchen to San Francisco&apos;s
            most loved Indian restaurant.
          </p>
        </div>
      </div>
    </section>
  );
}
