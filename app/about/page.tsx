"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { dictionaries } from "@/dictionaries";
import { TeamSection } from "@/components/team-section";
import { HistoryTimeline } from "@/components/history-timeline";
import { PageHeader } from "@/components/page-header";

export default function AboutPage() {
  const { language } = useLanguage();
  const t = dictionaries[language];

  return (
    <main className="flex flex-col min-h-screen">
      <PageHeader
        title={t.about.title}
        description={t.about.description}
        backgroundImage="/assets/about-header.jpg"
      />

      <section className="py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">
                {t.about.mission.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base md:text-lg">
                {t.about.mission.description}
              </p>
              <h3 className="text-xl font-bold">
                {t.about.mission.values.title}
              </h3>
              <ul className="space-y-2 text-gray-500">
                {t.about.mission.values.list.map((value, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              className="relative h-[400px] overflow-hidden rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src="/assets/about.jpg"
                alt="Our mission in action"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <HistoryTimeline />

      <section className="py-12 md:py-24 bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              className="relative h-[400px] overflow-hidden rounded-lg order-2 lg:order-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/assets/impact.jpg"
                alt="Our impact"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              className="space-y-4 order-1 lg:order-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                {t.about.impact.title}
              </h2>
              <p className="text-gray-500 md:text-lg">
                {t.about.impact.description}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {/* <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-primary">
                    {t.about.impact.stats.students}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t.about.impact.stats.studentsLabel}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-primary">
                    {t.about.impact.stats.communities}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t.about.impact.stats.communitiesLabel}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-primary">
                    {t.about.impact.stats.volunteers}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t.about.impact.stats.volunteersLabel}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-primary">
                    {t.about.impact.stats.projects}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t.about.impact.stats.projectsLabel}
                  </div>
                </div> */}
                <p className="text-gray-500 font-bold">We will be uploading the data soon, subscribe for latest news</p>
              </div>
              <div className="pt-4">
                <Link href="/programs">
                  <Button className="bg-primary hover:bg-primary/90">
                    {t.about.impact.programsButton}{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <TeamSection />

      <section className="py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {t.about.join.title}
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.about.join.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/volunteer">
                <Button className="bg-primary hover:bg-primary/90">
                  {t.about.join.volunteerButton}{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/donate">
                <Button variant="outline">{t.about.join.donateButton}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
