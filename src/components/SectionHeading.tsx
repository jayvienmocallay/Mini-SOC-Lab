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
    className="pt-16 pb-6 scroll-mt-8"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <span className="text-[10px] font-mono text-primary/60 tracking-widest uppercase">Section {number}</span>
        <h2 className="text-2xl font-display font-bold text-foreground">{title}</h2>
      </div>
    </div>
    {description && <p className="text-sm text-muted-foreground ml-[52px]">{description}</p>}
    <div className="mt-4 h-px bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
  </motion.div>
);

export default SectionHeading;
