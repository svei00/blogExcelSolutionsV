import {
  Bot,
  EyeOff,
  FolderTree,
  FileSpreadsheet,
  Sparkles,
  Info,
} from "lucide-react";
import CallToAction from "../components/CallToAction";
import useLocale from "../hooks/useLocale";

// REBUILD_PLAN 12.A.4 - content as { es, en } pairs read through
// useLocale().t(). Copy stays co-located with the page (no central
// resource bundle yet); layout is untouched from the 12.A.3 visual pass.

const ui = {
  heading: { es: "Proyectos", en: "Projects" },
  tools: { es: "Herramientas", en: "Tools" },
  others: { es: "Otras herramientas", en: "Other tools" },
};

const intro = [
  {
    es: "Construyo herramientas de trabajo: automatización, papeles de trabajo y procesos que convierten datos dispersos en información ordenada, revisable y utilizable.",
    en: "I build working tools: automation, workpapers, and processes that turn scattered data into information that is ordered, reviewable, and usable.",
  },
  {
    es: "No son ejercicios de práctica. Cada uno salió de un problema real: horas de captura manual, archivos que no cuadran, procesos que solo una persona sabía hacer.",
    en: "These are not practice exercises. Each one came out of a real problem: hours of manual data entry, files that do not reconcile, processes only one person knew how to run.",
  },
  {
    es: "La mayoría nacen del terreno contable y fiscal, pero el criterio es siempre el mismo: Excel cuando el usuario final tiene que poder abrir, entender y auditar el resultado; Python cuando el volumen o la repetición hacen que hacerlo a mano deje de tener sentido.",
    en: "Most come from accounting and tax work, but the rule is always the same: Excel when the end user has to be able to open, understand, and audit the result; Python when volume or repetition make doing it by hand stop making sense.",
  },
  {
    es: "Buena parte de estas herramientas conectan con el SAT (Servicio de Administración Tributaria) del lado de los datos —CFDI, DIOT— y con sistemas contables como CONTPAQi del lado de la carga y el registro.",
    en: "Many of these tools connect to Mexico's tax authority (the SAT) on the data side —CFDI, DIOT— and to accounting systems like CONTPAQi on the loading and posting side.",
  },
];

// Block "kind" drives both the eyebrow label and whether it renders as a
// callout - the design follows the content's meaning, not a string match.
const BLOCK_LABELS = {
  problem: { es: "El problema", en: "The problem" },
  does: { es: "Qué hace", en: "What it does" },
  distinct: { es: "Lo que lo hace distinto", en: "What sets it apart" },
  note: { es: "Nota honesta", en: "An honest note" },
};
const CALLOUT_KINDS = new Set(["distinct", "note"]);

const featured = [
  {
    icon: <Bot size={22} />,
    title: {
      es: "Automatizador SAT → sistema contable",
      en: "SAT → accounting-system automator",
    },
    blocks: [
      {
        kind: "problem",
        text: {
          es: "Cada mes, capturar los CFDI de un despacho significa abrir XML por XML, decidir la cuenta de gasto de cada uno, armar la póliza y capturar la DIOT por separado. Es lento, y un error no se nota hasta que la póliza no cuadra.",
          en: "Every month, booking a firm's CFDIs means opening XML after XML, deciding the expense account for each one, building the journal entry, and keying the DIOT separately. It is slow, and a mistake goes unnoticed until the entry does not balance.",
        },
      },
      {
        kind: "does",
        text: {
          es: "Lee la carpeta de XML (sueltos o en ZIP) y extrae todo del CFDI 4.0: emisor, receptor, IVA 16/8, IEPS, retenciones, UUID, método de pago PUE/PPD, REP y documentos relacionados. Consulta el estatus de cada UUID contra el SAT (vigente o cancelado) y genera las pólizas listas para importar a CONTPAQi 18.5.2, más el TXT de la DIOT en formato batch del SAT.",
          en: "It reads the XML folder (loose or zipped) and pulls everything from the CFDI 4.0: issuer, recipient, 16/8% VAT, excise tax, withholdings, UUID, PUE/PPD payment method, payment complements, and related documents. It checks each UUID's status against the SAT (valid or cancelled) and generates journal entries ready to import into CONTPAQi 18.5.2, plus the DIOT TXT in the SAT's batch format.",
        },
      },
      {
        kind: "distinct",
        text: {
          es: "La cuenta de gasto la predice un modelo de machine learning entrenado por empresa. Cada vez que corriges una cuenta en el Excel de revisión, el modelo aprende y el mes siguiente clasifica mejor. Antes de escribir cualquier archivo valida que Debe = Haber en cada póliza y reporta las cuentas sin asignar.",
          en: "The expense account is predicted by a machine-learning model trained per company. Every time you correct an account in the review spreadsheet, the model learns and classifies better the next month. Before writing any file it checks that debits = credits on every entry and reports the accounts it could not assign.",
        },
      },
    ],
    tools: ["Python", "scikit-learn", "SQLite"],
  },
  {
    icon: <EyeOff size={22} />,
    title: { es: "Anonimizador de CFDI", en: "CFDI anonymizer" },
    blocks: [
      {
        kind: "problem",
        text: {
          es: "Para enseñar con casos reales hace falta información real. Pero un CFDI trae RFC, nombres y denominaciones sociales de clientes que no se pueden exponer en un curso, una captura o un archivo de ejemplo.",
          en: "Teaching with real cases needs real data. But a CFDI carries clients' tax IDs, names, and company names that cannot be shown in a course, a screenshot, or a sample file.",
        },
      },
      {
        kind: "does",
        text: {
          es: "Convierte CFDI reales en copias anonimizadas: sustituye RFC, nombres y razones sociales por datos falsos consistentes —el mismo proveedor recibe siempre el mismo alias— y conserva importes, impuestos, conceptos y fechas, para que los ejercicios sigan cuadrando. El mapeo se guarda en SQLite, así que el proceso es reversible.",
          en: "It turns real CFDIs into anonymized copies: it swaps tax IDs, names, and company names for consistent fake data —the same vendor always gets the same alias— and keeps amounts, taxes, line items, and dates so the exercises still reconcile. The mapping is stored in SQLite, so the process is reversible.",
        },
      },
      {
        kind: "note",
        text: {
          es: "Los archivos anonimizados no son válidos ante el SAT (el sello ya no coincide); sirven para demos, cursos y pruebas, no para timbrar.",
          en: "The anonymized files are not valid with the SAT (the digital seal no longer matches); they are for demos, courses, and testing, not for stamping.",
        },
      },
    ],
    tools: ["Python", "lxml", "SQLite"],
  },
  {
    icon: <FolderTree size={22} />,
    title: { es: "Procesador de CFDI", en: "CFDI processor" },
    blocks: [
      {
        kind: "problem",
        text: {
          es: "Un cliente manda una carpeta con cientos de XML mezclados: facturas, nóminas, complementos de pago, versiones 3.3 y 4.0 revueltas. Antes de poder revisar nada, hay que ordenarlos.",
          en: "A client sends a folder with hundreds of mixed XMLs: invoices, payroll, payment complements, versions 3.3 and 4.0 all jumbled together. Before you can review anything, they have to be sorted.",
        },
      },
      {
        kind: "does",
        text: {
          es: "Detecta automáticamente la versión y el tipo de cada comprobante (CFDI 3.3 y 4.0, Nómina 1.2, Pagos 2.0) y exporta todo a un Excel con una hoja por tipo de documento. Acepta XML sueltos o comprimidos. Interfaz gráfica para el uso diario, línea de comandos para automatizar.",
          en: "It auto-detects each document's version and type (CFDI 3.3 and 4.0, Payroll 1.2, Payments 2.0) and exports everything to an Excel workbook with one sheet per document type. It takes loose or zipped XML. A GUI for daily use, a command line for automation.",
        },
      },
    ],
    tools: ["Python", "PySide6", "pandas", "openpyxl"],
  },
  {
    icon: <FileSpreadsheet size={22} />,
    title: {
      es: "Papeles de trabajo contable-fiscal",
      en: "Accounting & tax workpapers",
    },
    blocks: [
      {
        kind: "problem",
        text: {
          es: "Los papeles de trabajo se rehacen cada ejercicio, y cuando el formato vive solo en la cabeza de quien lo armó, nadie más puede mantenerlo.",
          en: "Workpapers get rebuilt every year, and when the format lives only in the head of whoever built it, no one else can maintain it.",
        },
      },
      {
        kind: "does",
        text: {
          es: "Sistema de papeles de trabajo en Excel generado desde código: fórmulas, consultas y macros versionadas por separado, y el libro final se ensambla con un script de construcción en vez de editarse a mano cada año.",
          en: "An Excel workpaper system generated from code: formulas, queries, and macros versioned separately, and the final workbook is assembled by a build script instead of being hand-edited every year.",
        },
      },
    ],
    tools: ["Excel (macros)", "Power Query", "Python"],
  },
];

const others = [
  {
    name: { es: "Cargador masivo de REP", en: "Bulk REP loader" },
    desc: {
      es: "Carga complementos de pago al sistema contable a través de su SDK, en lote en vez de uno por uno.",
      en: "Loads payment complements into the accounting system through its SDK, in bulk instead of one by one.",
    },
    tech: ".NET",
  },
  {
    name: { es: "Renombrador de CFDI", en: "CFDI renamer" },
    desc: {
      es: "Renombra lotes completos de XML con el criterio que necesites, en vez de archivo por archivo.",
      en: "Renames whole batches of XML by whatever rule you need, instead of file by file.",
    },
    tech: "Python",
  },
  {
    name: { es: "Reporteador", en: "Reporter" },
    desc: {
      es: "Reportes operativos desde la base del sistema contable; actualmente, plantilla de trabajadores activos.",
      en: "Operational reports straight from the accounting system's database; currently, an active-employee roster.",
    },
    tech: "Python",
  },
  {
    name: { es: "Generador de DIOT", en: "DIOT generator" },
    desc: {
      es: "Arma la DIOT del periodo a partir de los CFDI recibidos, en el formato batch que pide el SAT.",
      en: "Builds the period's DIOT from received CFDIs, in the batch format the SAT requires.",
    },
    tech: "Python",
  },
];

export default function Projects() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Intro */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md ring-1 ring-gray-100 dark:ring-white/5 p-8 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t(ui.heading)}
          </h1>
          {intro.map((para, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-gray-700 dark:text-gray-200 leading-relaxed text-justify"
                  : "text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-justify"
              }
            >
              {t(para)}
            </p>
          ))}
        </div>

        {/* Featured projects */}
        {featured.map(({ icon, title, blocks, tools }) => (
          <article
            key={title.es}
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
                  {t(title)}
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                {blocks.map(({ kind, text }) => {
                  const label = t(BLOCK_LABELS[kind]);
                  if (CALLOUT_KINDS.has(kind)) {
                    const honest = kind === "note";
                    return (
                      <div
                        key={kind}
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
                          {t(text)}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div key={kind}>
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        {label}
                      </span>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 text-justify">
                        {t(text)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {t(ui.tools)}
                </span>
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-primaryText dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}

        {/* Other tools — deliberately the plain, compact list */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md ring-1 ring-gray-100 dark:ring-white/5 p-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {t(ui.others)}
          </h2>
          <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
            {others.map(({ name, desc, tech }) => (
              <li key={name.es} className="py-3 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="shrink-0 text-sm font-medium text-gray-800 dark:text-white">
                    {t(name)}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 text-justify">
                    {t(desc)}
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
