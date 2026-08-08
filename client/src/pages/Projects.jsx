import CallToAction from "../components/CallToAction";

// Featured projects — each is a real tool that came out of a concrete
// despacho problem, not a practice exercise. Structured blocks
// ("El problema", "Qué hace", ...) render as bold lead-ins, not headings,
// so the page keeps a single h1 → h2 (per project) heading order.
const featured = [
  {
    n: "1",
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
    n: "2",
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
    n: "3",
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
    n: "4",
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
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Proyectos
          </h1>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
            Construyo herramientas de trabajo: automatización, papeles de trabajo
            y procesos que convierten datos dispersos en información ordenada,
            revisable y utilizable.
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            No son ejercicios de práctica. Cada uno salió de un problema real:
            horas de captura manual, archivos que no cuadran, procesos que solo
            una persona sabía hacer.
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            La mayoría nacen del terreno contable y fiscal, pero el criterio es
            siempre el mismo: Excel cuando el usuario final tiene que poder abrir,
            entender y auditar el resultado; Python cuando el volumen o la
            repetición hacen que hacerlo a mano deje de tener sentido.
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Buena parte de estas herramientas conectan con el SAT (Servicio de
            Administración Tributaria) del lado de los datos —CFDI, DIOT— y con
            sistemas contables como CONTPAQi del lado de la carga y el registro.
          </p>
        </div>

        {/* Featured projects */}
        {featured.map(({ n, title, blocks, tools }) => (
          <article
            key={n}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 flex flex-col gap-4"
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              <span className="text-primaryText dark:text-primary">{n} — </span>
              {title}
            </h2>
            <div className="flex flex-col gap-3">
              {blocks.map(([label, text]) => (
                <p
                  key={label}
                  className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
                >
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {label}.{" "}
                  </span>
                  {text}
                </p>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
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
          </article>
        ))}

        {/* Other tools */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
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
                  <span className="text-sm text-gray-600 dark:text-gray-300">
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
