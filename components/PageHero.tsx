type PageHeroProps = {
  title: string;
  subtitle?: string;
  image?: string;
};

const PageHero = ({ title, subtitle, image = "/placeholder.svg" }: PageHeroProps) => {
  return (
    <section className="relative flex min-h-[320px] items-center">
      <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/45 to-transparent" />
      <div className="container relative z-10 mx-auto px-4 py-20 lg:px-8">
        <h1 className="font-heading text-5xl text-primary-foreground md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-primary-foreground/90">{subtitle}</p>}
      </div>
    </section>
  );
};

export default PageHero;
