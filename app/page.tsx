import { Contact } from "@/components/main/contact";
import { Encryption } from "@/components/main/encryption";
import { FunFacts } from "@/components/main/fun-facts";
import { Hero } from "@/components/main/hero";
import { Projects } from "@/components/main/projects";
import { Skills } from "@/components/main/skills";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero />
        <Skills />
        <Encryption />
        <Projects />
        <FunFacts />
        <Contact />
      </div>
    </main>
  );
}
