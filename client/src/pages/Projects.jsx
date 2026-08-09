import {
  Bot,
  EyeOff,
  FolderTree,
  FileSpreadsheet,
  Sparkles,
  Info,
} from "lucide-react";
import CallToAction from "../components/CallToAction";

// Block labels that get the callout treatment (tinted panel + accent
// rail) instead of a plain eyebrow+text - the differentiator and the
// honest caveat are the two lines that carry the "why this, why me", so
// the design lifts them out of the paragraph flow.
const CALLOUT_LABELS = new Set(["Lo que lo hace distinto", "Nota honesta"]);

// Featured projects — each is a real tool that came out of a concrete
// despacho problem, not a practice exercise. The structured blocks
// ("El problema", "Qué hace", ...) render as eyebrow labels + text, not
// headings, so the page keeps a single h1 → h2 (per project) order.
const featured = [
  {
    icon: <Bot size={22} />,
    title: "Automatizador SAT → sistema contable",
    blocks: [
      [
        "El problema",
        "Cada mes, capturar los CFDI de un despacho significa abrir XML por XML, decidir la cuenta de gasto de cada uno, armar la póliza y capturar la DIOT por separado. Es lento, y un error no se nota hasta que la póliza no cuadra.",
      ],
      [
        "Qué hace",
        "Lee la carpeta de XML (sueltos o en ZIP) y extrae todo del CFDI 4.0: emisor, receptor, IVA 16/8, IEPS, retenciones, UUID, método de pago PUE/PPD, REP y documentos relacionados. Consulta el estatus de cada UUID contra el SAT (vigente o cancelado) y genera las pólizas listas para importar a CONTPAQi 18.5.2, más el TXT de la DIOT en formato batch del SAT.",
      ],
      [
        "Lo que lo hace distinto",
        "La cuenta de gasto la predice un modelo de machine learning entrenado por empresa. Cada vez que corriges una cuenta en el Excel de revisión, el modelo aprende y el mes siguiente clasifica mejor. Antes de escribir cualquier archivo valida que Debe = Haber en cada póliza y reporta las cuentas sin asignar.",
      ],
    ],
    tools: ["Python", "scikit-learn", "SQLite"],
  },
  {
    icon: <EyeOff size={22} />,
    title: "Anonimizador de CFDI",
    blocks: [
      [
        "El problema",
        "Para enseñar con casos reales hace falta información real. Pero un CFDI trae RFC, nombres y denominaciones sociales de clientes que no se pueden exponer en un curso, una captura o un archivo de ejemplo.",
      ],
      [
        "Qué hace",
        "Convierte CFDI reales en copias anonimizadas: sustituye RFC, nombres y razones sociales por datos falsos consistentes —el mismo proveedor recibe siempre el mismo alias— y conserva importes, impuestos, conceptos y fechas, para que los ejercicios sigan cuadrando. El mapeo se guarda en SQLite, así que el proceso es reversible.",
      ],
      [
        "Nota honesta",
        "Los archivos anonimizados no son válidos ante el SAT (el sello ya no coincide); sirven para demos, cursos y pruebas, no para timbrar.",
      ],
    ],
    tools: ["Python", "lxml", "SQLite"],
  },
  {
    icon: <FolderTree size={22} />,
    title: "Procesador de CFDI",
    blocks: [
      [
        "El problema",
        "Un cliente manda una carpeta con cientos de XML mezclados: facturas, nóminas, complementos de pago, versiones 3.3 y 4.0 revueltas. Antes de poder revisar nada, hay que ordenarlos.",
      ],
      [
        "Qué hace",
        "Detecta automáticamente la versión y el tipo de cada comprobante (CFDI 3.3 y 4.0, Nómina 1.2, Pagos 2.0) y exporta todo a un Excel con una hoja por tipo de documento. Acepta XML sueltos o comprimidos. Interfaz gráfica para el uso diario, línea de comandos para automatizar.",
      ],
    ],
    tools: ["Python", "PySide6", "pandas", "openpyxl"],
  },
  {
    icon: <FileSpreadsheet size={22} />,
    title: "Papeles de trabajo contable-fiscal",
    blocks: [
      [
        "El problema",
        "Los papeles de trabajo se rehacen cada ejercicio, y cuando el formato vive solo en la cabeza de quien lo armó, nadie más puede mantenerlo.",
      ],
      [
        "Qué hace",
        "Sistema de papeles de trabajo en Excel generado desde código: fórmulas, consultas y macros versionadas por separado, y el libro final se ensambla con un script de construcción en vez de editarse a mano cada año.",
      ],
    ],
    tools: ["Excel (macros)", "Power Query", "Python"],
  },
];

const others = [
  [
    "Cargador masivo de REP",
    "Carga complementos de pago al sistema contable a través de su SDK, en lote en vez de uno por uno.",
    ".NET",
  ],
  [
    "Renombrador de CFDI",
    "Renombra lotes completos de XML con el criterio que necesites, en vez de archivo por archivo.",
    "Python",
  ],
  [
    "Reporteador",
    "Reportes operativos desde la base del sistema contable; actualmente, plantilla de trabajadores activos.",
    "Python",
  ],
  [
    "Generador de DIOT",
    "Arma la DIOT del periodo a partir de los CFDI recibidos, en el formato batch que pide el SAT.",
    "Python",
  ],
];

export default function Projects() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Intro */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md ring-1 ring-gray-100 dark:ring-white/5 p-8 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Proyectos
          </h1>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-justify">
            Construyo herramientas de trabajo: automatización, papeles de trabajo
            y procesos que convierten datos dispersos en información ordenada,
            revisable y utilizable.
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-justify">
            No son ejercicios de práctica. Cada uno salió de un problema real:
            horas de captura manual, archivos que no cuadran, procesos que solo
            una persona sabía hacer.
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-justify">
            La mayoría nacen del terreno contable y fiscal, pero el criterio es
            siempre el mismo: Excel cuando el usuario final tiene que poder abrir,
            entender y auditar el resultado; Python cuando el volumen o la
            repetición hacen que hacerlo a mano deje de tener sentido.
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-justify">
            Buena parte de estas herramientas conectan con el SAT (Servicio de
            Administración Tributaria) del lado de los datos —CFDI, DIOT— y con
            sistemas contables como CONTPAQi del lado de la carga y el registro.
          </p>
        </div>

        {/* Featured projects */}
        {featured.map(({ icon, title, blocks, tools }) => (
          <article
            key={title}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-md ring-1 ring-gray-100 dark:ring-white/5 transition duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            {/* brand hairline caps the card */}
            <div className="h-1 w-full bg-gradient-to-r from-secondaryText to-primaryText" />

            <div className="flex flex-col gap-5 p-8">
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-secondaryText to-primaryText text-white flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105">
                  {icon}
                </span>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {title}
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                {blocks.map(([label, text]) => {
                  if (CALLOUT_LABELS.has(label)) {
                    const honest = label === "Nota honesta";
                    return (
                      <div
                        key={label}
                        className={`rounded-xl border-l-2 p-4 ${
                          honest
                            ? "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900/50"
                            : "border-primaryText bg-blue-50 dark:border-primary dark:bg-blue-900/30"
                        }`}
                      >
                        <div className="mb-1.5 flex items-center gap-1.5">
                          {honest ? (
                            <Info
                              size={13}
                              className="text-gray-400 dark:text-gray-500"
                            />
                          ) : (
                            <Sparkles
                              size={13}
                              className="text-primaryText dark:text-primary"
                            />
                          )}
                          <span
                            className={`text-[11px] font-semibold uppercase tracking-wider ${
                              honest
                                ? "text-gray-400 dark:text-gray-500"
                                : "text-primaryText dark:text-primary"
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 text-justify">
                          {text}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div key={label}>
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        {label}
                      </span>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 text-justify">
                        {text}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Herramientas
                </span>
                {tools.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-primaryText dark:bg-blue-900 dark:text-blue-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}

        {/* Other tools — deliberately the plain, compact list */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md ring-1 ring-gray-100 dark:ring-white/5 p-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Otras herramientas
          </h2>
          <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
            {others.map(([name, desc, tech]) => (
              <li key={name} className="py-3 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="shrink-0 text-sm font-medium text-gray-800 dark:text-white">
                    {name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 text-justify">
                    {desc}
                  </span>
                </div>
                <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {tech}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <CallToAction />
      </div>
    </div>
  );
}
