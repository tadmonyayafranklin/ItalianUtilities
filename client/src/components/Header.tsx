export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="italia-stripe w-full"></div>
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <i className="fas fa-map-marker-alt text-[#DC3545] text-3xl mr-3"></i>
            <h1 className="text-2xl font-bold text-[#19647E]">Italia Info Tools</h1>
          </div>
          <p className="text-[#6C757D] text-sm md:text-base">Strumenti utili per informazioni italiane</p>
        </div>
      </div>
    </header>
  );
}
