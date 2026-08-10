import { MapPin } from "lucide-react";
import {
  FaLinkedin,
  FaYoutube,
  FaGithub,
  FaEnvelope,
  FaBriefcase,
} from "react-icons/fa";
import useLocale from "../hooks/useLocale";

// REBUILD_PLAN 12.A.4 part 2 - content as { es, en } pairs read through
// useLocale().t(), same pattern as Projects.jsx. Layout untouched.

const ui = {
  role: {
    es: "Founder, Excel Solutions V — Especialista en Excel y automatización fiscal",
    en: "Founder, Excel Solutions V — Excel and tax-automation specialist",
  },
  location: { es: "Zapopan, Jalisco, México", en: "Zapopan, Jalisco, Mexico" },
  bio: {
    es: "Especialista autodidacta en Excel y automatización, enfocado en la intersección entre los sistemas contables mexicanos y la ingeniería de hojas de cálculo. Desarrollo herramientas de automatización CFDI/SAT, libros de trabajo de simulación y pipelines en Python que transforman datos fiscales en registros limpios e importables —y genero contenido en español para enseñar lo mismo. Disponible para trabajo freelance en Excel, VBA, Power Query y automatización relacionada con CONTPAQi.",
    en: "Self-taught Excel and automation specialist, focused on the intersection between Mexican accounting systems and spreadsheet engineering. I build CFDI/SAT automation tools, fiscal simulation workbooks, and Python pipelines that turn tax data into clean, importable records —and I create Spanish-language content to teach the same skills. Available for freelance work in Excel, VBA, Power Query, and CONTPAQi-related automation.",
  },
  skillsHeading: { es: "Habilidades", en: "Skills" },
};

// Skills co-located as { es, en } even where both sides match (proper
// nouns / acronyms like VBA, Python, CONTPAQi) - one shape for the whole
// list is simpler than special-casing which entries need translation.
const skills = [
  { es: "Excel Avanzado", en: "Advanced Excel" },
  { es: "VBA", en: "VBA" },
  { es: "Power Query", en: "Power Query" },
  { es: "Python", en: "Python" },
  { es: "CFDI 4.0", en: "CFDI 4.0" },
  { es: "SAT Anexo 24", en: "SAT Annex 24" },
  { es: "CONTPAQi", en: "CONTPAQi" },
  { es: "Análisis de Datos", en: "Data Analysis" },
  { es: "Modelado Financiero", en: "Financial Modeling" },
  { es: "Creación de Contenido", en: "Content Creation" },
];

const socials = [
  {
    icon: <FaLinkedin size={22} />,
    href: "#",
    label: { es: "LinkedIn", en: "LinkedIn" },
    className: "text-linkedin hover:opacity-75",
  },
  {
    icon: <FaYoutube size={22} />,
    href: "#",
    label: { es: "YouTube", en: "YouTube" },
    className: "text-red-500 hover:opacity-75",
  },
  {
    icon: <FaBriefcase size={20} />,
    href: "#",
    label: { es: "Upwork", en: "Upwork" },
    className: "text-secondary hover:opacity-75",
  },
  {
    icon: <FaGithub size={22} />,
    href: "#",
    label: { es: "GitHub", en: "GitHub" },
    className: "text-github hover:opacity-75",
  },
  {
    icon: <FaEnvelope size={22} />,
    href: "mailto:#",
    label: { es: "Correo", en: "Email" },
    className: "text-primary hover:opacity-75",
  },
];

export default function About() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Profile card */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8">

          {/* Avatar placeholder */}
          <div className="flex-shrink-0">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primaryText to-secondaryText flex items-center justify-center text-white text-4xl font-bold shadow-lg select-none">
              SV
            </div>
          </div>

          {/* Name / title / bio / socials */}
          <div className="flex flex-col gap-3 text-center md:text-left">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Iván E. Villanueva Sandoval{" "}
                <span className="text-gray-500 dark:text-gray-400 font-normal text-base">
                  (Svei)
                </span>
              </h1>
              <p className="text-primaryText dark:text-primary font-semibold mt-1">
                {t(ui.role)}
              </p>
            </div>

            <div className="flex items-center gap-1 justify-center md:justify-start text-gray-500 dark:text-gray-400 text-sm">
              <MapPin size={14} />
              <span>{t(ui.location)}</span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-justify">
              {t(ui.bio)}
            </p>

            {/* Social icons */}
            <div className="flex gap-5 mt-1 justify-center md:justify-start">
              {socials.map(({ icon, href, label, className }) => (
                <a
                  key={label.en}
                  href={href}
                  aria-label={t(label)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-opacity ${className}`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {t(ui.skillsHeading)}
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.en}
                className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-primaryText dark:bg-blue-900 dark:text-blue-200"
              >
                {t(skill)}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
