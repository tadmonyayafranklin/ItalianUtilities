export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E9ECEF] mt-10">
      <div className="italia-stripe w-full"></div>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-[#6C757D] text-sm mb-3 md:mb-0">© {new Date().getFullYear()} Italia Info Tools - Tutti i diritti riservati</p>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-[#6C757D] hover:text-[#19647E] transition-colors">
              <i className="far fa-question-circle mr-1"></i>
              <span className="text-sm">Aiuto</span>
            </a>
            <a href="#" className="text-[#6C757D] hover:text-[#19647E] transition-colors">
              <i className="fas fa-shield-alt mr-1"></i>
              <span className="text-sm">Privacy</span>
            </a>
            <a href="#" className="text-[#6C757D] hover:text-[#19647E] transition-colors">
              <i className="far fa-envelope mr-1"></i>
              <span className="text-sm">Contatti</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
