import { MapPin } from "lucide-react";
import {
  FaLinkedin,
  FaYoutube,
  FaGithub,
  FaEnvelope,
  FaBriefcase,
} from "react-icons/fa";

const skills = [
  "Excel Avanzado",
  "VBA",
  "Power Query",
  "Python",
  "CFDI 4.0",
  "SAT Anexo 24",
  "CONTPAQi",
  "Análisis de Datos",
  "Modelado Financiero",
  "Creación de Contenido",
];

const socials = [
  {
    icon: <FaLinkedin size={22} />,
    href: "#",
    label: "LinkedIn",
    className: "text-linkedin hover:opacity-75",
  },
  {
    icon: <FaYoutube size={22} />,
    href: "#",
    label: "YouTube",
    className: "text-red-500 hover:opacity-75",
  },
  {
    icon: <FaBriefcase size={20} />,
    href: "#",
    label: "Upwork",
    className: "text-greenEx hover:opacity-75",
  },
  {
    icon: <FaGithub size={22} />,
    href: "#",
    label: "GitHub",
    className: "text-github hover:opacity-75",
  },
  {
    icon: <FaEnvelope size={22} />,
    href: "mailto:#",
    label: "Email",
    className: "text-blueEx hover:opacity-75",
  },
];

export default function About() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Profile card */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">

          {/* Avatar placeholder */}
          <div className="flex-shrink-0">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blueEx to-greenEx flex items-center justify-center text-white text-4xl font-bold shadow-lg select-none">
              SV
            </div>
          </div>

          {/* Name / title / bio / socials */}
          <div className="flex flex-col gap-3 text-center md:text-left">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Iván E. Villanueva Sandoval{" "}
                <span className="text-gray-400 dark:text-gray-500 font-normal text-base">
                  (Svei)
                </span>
              </h1>
              <p className="text-blueEx font-semibold mt-1">
                Founder, Excel Solutions V — Especialista en Excel y automatización fiscal
              </p>
            </div>

            <div className="flex items-center gap-1 justify-center md:justify-start text-gray-500 dark:text-gray-400 text-sm">
              <MapPin size={14} />
              <span>Zapopan, Jalisco, México</span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Especialista autodidacta en Excel y automatización, enfocado en la
              intersección entre los sistemas contables mexicanos y la ingeniería
              de hojas de cálculo. Desarrollo herramientas de automatización
              CFDI/SAT, libros de trabajo de simulación y pipelines en Python que
              transforman datos fiscales en registros limpios e importables —
              y genero contenido en español para enseñar lo mismo. Disponible
              para trabajo freelance en Excel, VBA, Power Query y automatización
              relacionada con CONTPAQi.
            </p>

            {/* Social icons */}
            <div className="flex gap-5 mt-1 justify-center md:justify-start">
              {socials.map(({ icon, href, label, className }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
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
            Habilidades
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blueEx dark:bg-blue-900 dark:text-blue-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
