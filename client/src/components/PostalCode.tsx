import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PostalCodeItem } from "@/lib/types";
import Pagination from "@/lib/pagination";

export default function PostalCode() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const { toast } = useToast();

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useQuery<PostalCodeItem[]>({
    queryKey: ['/api/postal-codes', searchTerm],
    enabled: true,
  });

  const filteredResults = searchTerm.trim() === "" 
    ? data || []
    : (data || []).filter(item => 
        item.postalCode.includes(searchTerm.trim()) || 
        item.city.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        item.province.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        item.region.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + resultsPerPage);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Handle errors
  if (isError && error) {
    toast({
      title: "Errore",
      description: `Si è verificato un errore: ${error.message}`,
      variant: "destructive",
    });
  }

  return (
    <div className="bg-white rounded-lg shadow p-5 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#19647E] mb-2">Ricerca CAP</h2>
        <p className="text-[#6C757D]">Cerca i codici postali italiani per città o viceversa.</p>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="mb-4">
          <label htmlFor="cap-search" className="block text-sm font-medium text-[#6C757D] mb-1">Cerca per città o CAP</label>
          <div className="flex">
            <div className="relative flex-grow">
              <i className="fas fa-search absolute left-3 top-3.5 text-[#6C757D]"></i>
              <Input
                id="cap-search"
                name="cap-search"
                className="w-full pl-10 p-3 border border-[#E9ECEF] rounded-md focus:ring-2 focus:ring-[#19647E] focus:border-[#19647E] transition-colors"
                placeholder="Inserisci città o CAP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              type="submit"
              className="bg-[#19647E] hover:bg-blue-700 text-white py-3 px-6 rounded-md ml-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#19647E] focus:ring-offset-2"
            >
              Cerca
            </Button>
          </div>
        </form>
        
        <div className="mt-2 text-sm text-[#6C757D]">
          <p>Esempi: "Roma", "00100", "Milano", "Firenze"</p>
        </div>
      </div>
      
      <div className="border border-[#E9ECEF] rounded-md overflow-hidden">
        <div className="bg-[#F8F9FA] border-b border-[#E9ECEF] px-4 py-3 flex justify-between items-center">
          <h3 className="text-lg font-medium text-[#6C757D]">Risultati della ricerca</h3>
          <span className="text-sm text-[#19647E] font-medium">
            {isLoading ? "Caricamento..." : `${filteredResults.length} risultati trovati`}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#F8F9FA] border-b border-[#E9ECEF]">
              <tr>
                <th className="text-left text-sm font-medium text-[#6C757D] px-4 py-3">CAP</th>
                <th className="text-left text-sm font-medium text-[#6C757D] px-4 py-3">Città</th>
                <th className="text-left text-sm font-medium text-[#6C757D] px-4 py-3">Provincia</th>
                <th className="text-left text-sm font-medium text-[#6C757D] px-4 py-3">Regione</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[#6C757D]">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Caricamento...
                  </td>
                </tr>
              ) : paginatedResults.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[#6C757D]">
                    Nessun risultato trovato. Prova a modificare la tua ricerca.
                  </td>
                </tr>
              ) : (
                paginatedResults.map((item, index) => (
                  <tr key={index} className="border-b border-[#E9ECEF] hover:bg-gray-50">
                    <td className="px-4 py-3 text-[#19647E] font-medium">{item.postalCode}</td>
                    <td className="px-4 py-3">{item.city}</td>
                    <td className="px-4 py-3">{item.province}</td>
                    <td className="px-4 py-3">{item.region}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {filteredResults.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
