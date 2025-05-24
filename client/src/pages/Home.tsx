import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CodiceFiscale from "@/components/CodiceFiscale";
import PostalCode from "@/components/PostalCode";
import CityInfo from "@/components/CityInfo";

type Tab = "codice-fiscale" | "postal-code" | "city-info";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("codice-fiscale");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-3 border-b">
            <button 
              onClick={() => setActiveTab("codice-fiscale")}
              className={`py-4 px-2 text-center font-medium focus:outline-none transition-colors hover:bg-gray-50 border-b-2 ${
                activeTab === "codice-fiscale" 
                  ? "border-[#19647E] text-[#19647E]" 
                  : "border-transparent text-[#6C757D]"
              }`}
            >
              <i className="fas fa-id-card mr-1 hidden md:inline"></i>
              <span className="text-sm md:text-base">Codice Fiscale</span>
            </button>
            
            <button 
              onClick={() => setActiveTab("postal-code")}
              className={`py-4 px-2 text-center font-medium focus:outline-none transition-colors hover:bg-gray-50 border-b-2 ${
                activeTab === "postal-code" 
                  ? "border-[#19647E] text-[#19647E]" 
                  : "border-transparent text-[#6C757D]"
              }`}
            >
              <i className="fas fa-envelope mr-1 hidden md:inline"></i>
              <span className="text-sm md:text-base">CAP</span>
            </button>
            
            <button 
              onClick={() => setActiveTab("city-info")}
              className={`py-4 px-2 text-center font-medium focus:outline-none transition-colors hover:bg-gray-50 border-b-2 ${
                activeTab === "city-info" 
                  ? "border-[#19647E] text-[#19647E]" 
                  : "border-transparent text-[#6C757D]"
              }`}
            >
              <i className="fas fa-city mr-1 hidden md:inline"></i>
              <span className="text-sm md:text-base">Città</span>
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        {activeTab === "codice-fiscale" && <CodiceFiscale />}
        {activeTab === "postal-code" && <PostalCode />}
        {activeTab === "city-info" && <CityInfo />}
      </main>
      
      <Footer />
    </div>
  );
}
