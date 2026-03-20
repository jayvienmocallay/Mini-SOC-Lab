import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  id: string;
  number: string;
  title: string;
  icon: LucideIcon;
  description?: string;
}

const SectionHeading = ({ id, number, title, icon: Icon, description }: SectionHeadingProps) => (
  <motion.div
    id={id}
    className="pt-20 pb-8 scroll-mt-8"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center gap-4 mb-3">
      <div className="relative">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {/* Section number badge */}
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-md bg-primary flex items-center justify-center">
          <span className="text-[8px] font-mono font-bold text-primary-foreground">{number}</span>
        </div>
      </div>
      <div>
        <span className="text-[10px] font-mono text-primary/50 tracking-[0.2em] uppercase block mb-0.5">Section {number}</span>
        <h2 className="text-2xl font-display font-bold text-foreground tracking-tight">{title}</h2>
      </div>
    </div>
    {description && <p className="text-sm text-muted-foreground ml-16 mb-1">{description}</p>}
    <div className="mt-5 h-px bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
  </motion.div>
);

export default SectionHeading;
