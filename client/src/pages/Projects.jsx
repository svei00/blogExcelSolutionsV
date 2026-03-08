import { FileSpreadsheet, Bot, Workflow, GraduationCap } from "lucide-react";
import CallToAction from "../components/CallToAction";

const projects = [
  {
    icon: <Bot size={22} />,
    title: "Automatización CFDI / SAT",
    description:
      "Herramientas que leen los XML del SAT (CFDI 4.0, Anexo 24) y los convierten en pólizas y layouts listos para importar a CONTPAQi, sin recaptura manual.",
    tags: ["Python", "VBA", "CFDI 4.0", "CONTPAQi"],
  },
  {
    icon: <FileSpreadsheet size={22} />,
    title: "Libros de simulación fiscal",
    description:
      "Modelos en Excel para proyectar ISR, IVA y flujo bajo distintos escenarios (RESICO, General de Ley), con papeles de trabajo que amarran contra la declaración.",
    tags: ["Excel Avanzado", "Modelado Financiero", "Papeles de Trabajo"],
  },
  {
    icon: <Workflow size={22} />,
    title: "Pipelines de datos en Python",
    description:
      "Procesos que limpian, validan y transforman exportaciones contables masivas en registros consistentes e importables, con reportes de las filas que no cuadran.",
    tags: ["Python", "Power Query", "Análisis de Datos"],
  },
  {
    icon: <GraduationCap size={22} />,
    title: "Contenido en español",
    description:
      "Artículos y tutoriales que enseñan estas mismas técnicas —Excel, VBA, automatización fiscal— con ejemplos reales del contexto contable mexicano.",
    tags: ["Creación de Contenido", "Excel", "SAT"],
  },
];

export default function Projects() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Intro */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Proyectos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-3">
            Construyo herramientas de trabajo que convierten datos fiscales
            mexicanos en registros limpios e importables: automatizaciones
            CFDI/SAT, libros de simulación y pipelines en Python. Cada proyecto
            nace de un problema real de despacho —recaptura, cuadres que no
            amarran, layouts que CONTPAQi rechaza— y termina en algo que ahorra
            horas cada mes.
          </p>
        </div>

        {/* Project cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map(({ icon, title, description, tags }) => (
            <div
              key={title}
              className="flex flex-col gap-3 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-100 text-primaryText dark:bg-blue-900 dark:text-blue-200 flex items-center justify-center">
                  {icon}
                </span>
                <h2 className="text-base font-semibold text-gray-800 dark:text-white">
                  {title}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {description}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-primaryText dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <CallToAction />
      </div>
    </div>
  );
}
