import CallToAction from "../components/CallToAction";

export default function Projects() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
      <h1 className="text-3xl font-semibold">Projects</h1>
      <p className="text-md text-gray-500 text-justify">
        At Excel SolutionsV, you can embark on exciting projects that enhance
        your learning experience, such as creating dynamic dashboards,
        automating financial reports with macros, designing interactive data
        entry forms, and building complex financial models. These hands-on
        projects not only solidify your understanding of Excel's functionalities
        but also equip you with practical skills to tackle real-world tasks
        efficiently.
      </p>
      <CallToAction />
    </div>
  );
}
