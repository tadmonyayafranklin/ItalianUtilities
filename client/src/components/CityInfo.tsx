import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CityInfo as CityInfoType } from "@/lib/types";
import Pagination from "@/lib/pagination";

export default function CityInfo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { toast } = useToast();
  
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRegion, selectedLetter]);

  const { data: regions } = useQuery<string[]>({
    queryKey: ['/api/regions'],
    enabled: true,
  });

  const { data: cities, isLoading, isError, error } = useQuery<CityInfoType[]>({
    queryKey: ['/api/cities', selectedRegion, selectedLetter],
    enabled: true,
  });

  if (isError && error) {
    toast({
      title: "Errore",
      description: `Si è verificato un errore: ${error.message}`,
      variant: "destructive",
    });
  }

  // Filter cities based on search term
  const filteredCities = cities
    ? cities.filter(city => {
        const matchesSearch = searchTerm === "" || 
          city.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRegion = selectedRegion === "" || 
          city.region.toLowerCase() === selectedRegion.toLowerCase();
        
        const matchesLetter = selectedLetter === "" || 
          city.name.charAt(0).toUpperCase() === selectedLetter;
        
        return matchesSearch && matchesRegion && matchesLetter;
      })
    : [];

  // Pagination
  const totalPages = Math.ceil(filteredCities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCities = filteredCities.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow p-5 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#19647E] mb-2">Informazioni Città</h2>
        <p className="text-[#6C757D]">Cerca e visualizza informazioni dettagliate sulle città italiane.</p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="city-search" className="block text-sm font-medium text-[#6C757D] mb-1">Cerca città</label>
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-3.5 text-[#6C757D]"></i>
              <Input
                id="city-search"
                name="city-search"
                className="w-full pl-10 p-3 border border-[#E9ECEF] rounded-md focus:ring-2 focus:ring-[#19647E] focus:border-[#19647E] transition-colors"
                placeholder="Inserisci nome città..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="md:w-1/4">
            <label htmlFor="region-filter" className="block text-sm font-medium text-[#6C757D] mb-1">Regione</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger id="region-filter" className="w-full p-3 border border-[#E9ECEF] rounded-md focus:ring-2 focus:ring-[#19647E] focus:border-[#19647E] transition-colors bg-white">
                <SelectValue placeholder="Tutte le regioni" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tutte le regioni</SelectItem>
                {regions?.map((region, index) => (
                  <SelectItem key={index} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2" id="alphabet-filter">
          <span className="text-sm font-medium text-[#6C757D]">Filtro alfabetico:</span>
          <button
            className={`alphabet-filter-button ${selectedLetter === "" ? "active" : ""}`}
            onClick={() => setSelectedLetter("")}
          >
            Tutti
          </button>
          {alphabet.map((letter) => (
            <button
              key={letter}
              className={`alphabet-filter-button ${selectedLetter === letter ? "active" : ""}`}
              onClick={() => setSelectedLetter(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          <span>Caricamento...</span>
        </div>
      ) : filteredCities.length === 0 ? (
        <div className="text-center p-8 text-[#6C757D]">
          Nessuna città trovata. Prova a modificare i filtri di ricerca.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCities.map((city, index) => (
              <div key={index} className="border border-[#E9ECEF] rounded-md overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-[#e6f7ff] border-b border-[#E9ECEF] px-4 py-3">
                  <h3 className="text-lg font-medium text-[#19647E]">{city.name}</h3>
                  <p className="text-sm text-[#6C757D]">{city.region} ({city.province})</p>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-[#6C757D]">Popolazione:</div>
                    <div className="font-medium">{city.population.toLocaleString('it-IT')}</div>
                    
                    <div className="text-[#6C757D]">Sindaco:</div>
                    <div className="font-medium">{city.mayor}</div>
                    
                    <div className="text-[#6C757D]">Superficie:</div>
                    <div className="font-medium">{city.area} km²</div>
                    
                    <div className="text-[#6C757D]">Codice Istat:</div>
                    <div className="font-medium">{city.istatCode}</div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E9ECEF]">
                    <a href="#" className="text-[#19647E] hover:text-blue-700 text-sm font-medium flex items-center">
                      <span>Maggiori informazioni</span>
                      <i className="fas fa-chevron-right ml-1 text-xs"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
