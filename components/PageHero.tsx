type PageHeroProps = {
  title: string;
  subtitle?: string;
  image?: string;
};

const PageHero = ({ title, subtitle, image: _image = "/placeholder.svg" }: PageHeroProps) => {
  return (
    <section className="relative flex min-h-[320px] items-center bg-black pt-20">
      <div className="container relative z-10 mx-auto px-4 py-20 lg:px-8">
        <h1 className="font-heading text-5xl text-primary-foreground md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-primary-foreground/90">{subtitle}</p>}
      </div>
    </section>
  );
};

export default PageHero;
