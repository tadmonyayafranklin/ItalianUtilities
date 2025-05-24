import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const codiceFiscaleSchema = z.object({
  name: z.string().min(1, { message: "Il nome è obbligatorio" }),
  surname: z.string().min(1, { message: "Il cognome è obbligatorio" }),
  birthdate: z.string().min(1, { message: "La data di nascita è obbligatoria" }),
  gender: z.enum(["M", "F"], { 
    required_error: "Il genere è obbligatorio"
  }),
  birthplace: z.string().min(1, { message: "Il luogo di nascita è obbligatorio" }),
});

type CodiceFiscaleFormData = z.infer<typeof codiceFiscaleSchema>;

interface CodiceFiscaleResponse {
  fiscalCode: string;
  name: string;
  surname: string;
  birthdate: string;
  birthplace: string;
}

export default function CodiceFiscale() {
  const [result, setResult] = useState<CodiceFiscaleResponse | null>(null);
  const { toast } = useToast();

  const form = useForm<CodiceFiscaleFormData>({
    resolver: zodResolver(codiceFiscaleSchema),
    defaultValues: {
      name: "",
      surname: "",
      birthdate: "",
      gender: undefined,
      birthplace: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CodiceFiscaleFormData) => {
      const response = await apiRequest("POST", "/api/codice-fiscale", data);
      return await response.json();
    },
    onSuccess: (data: CodiceFiscaleResponse) => {
      setResult(data);
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: `Si è verificato un errore: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: CodiceFiscaleFormData) {
    mutate(data);
  }

  function copyToClipboard() {
    if (result) {
      navigator.clipboard.writeText(result.fiscalCode);
      toast({
        title: "Copiato!",
        description: "Il codice fiscale è stato copiato negli appunti",
        variant: "default",
      });
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT');
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#19647E] mb-2">Generatore Codice Fiscale</h2>
        <p className="text-[#6C757D]">Compila il modulo per calcolare il tuo codice fiscale italiano.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <FormField
            control={form.control}
            name="surname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-[#6C757D]">Cognome</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Rossi" 
                    className="w-full p-3 border border-[#E9ECEF] rounded-md focus:ring-2 focus:ring-[#19647E] focus:border-[#19647E] transition-colors"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-[#DC3545] text-xs mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-[#6C757D]">Nome</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Mario" 
                    className="w-full p-3 border border-[#E9ECEF] rounded-md focus:ring-2 focus:ring-[#19647E] focus:border-[#19647E] transition-colors"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-[#DC3545] text-xs mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-[#6C757D]">Data di nascita</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    className="w-full p-3 border border-[#E9ECEF] rounded-md focus:ring-2 focus:ring-[#19647E] focus:border-[#19647E] transition-colors"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-[#DC3545] text-xs mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-[#6C757D]">Genere</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full p-3 border border-[#E9ECEF] rounded-md focus:ring-2 focus:ring-[#19647E] focus:border-[#19647E] transition-colors bg-white">
                      <SelectValue placeholder="Seleziona genere" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="M">Maschio</SelectItem>
                    <SelectItem value="F">Femmina</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[#DC3545] text-xs mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthplace"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel className="text-sm font-medium text-[#6C757D]">Luogo di nascita</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Roma" 
                    className="w-full p-3 border border-[#E9ECEF] rounded-md focus:ring-2 focus:ring-[#19647E] focus:border-[#19647E] transition-colors"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-[#DC3545] text-xs mt-1" />
              </FormItem>
            )}
          />

          <div className="col-span-full">
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-[#19647E] hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#19647E] focus:ring-offset-2 mt-2"
            >
              {isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Elaborazione...
                </>
              ) : (
                <>
                  <i className="fas fa-calculator mr-2"></i>Calcola Codice Fiscale
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {result && (
        <div className="border border-[#E9ECEF] bg-[#F8F9FA] p-5 rounded-md">
          <h3 className="text-lg font-semibold text-[#6C757D] mb-3">Risultato</h3>
          <div className="flex items-center justify-between">
            <div className="bg-[#e6f7ff] p-4 rounded-md border border-[#19647E] inline-block">
              <p className="text-sm text-[#6C757D] mb-1">Il tuo codice fiscale:</p>
              <p className="text-xl font-mono font-bold tracking-wider text-[#19647E]">{result.fiscalCode}</p>
            </div>
            <Button 
              onClick={copyToClipboard}
              className="bg-[#28A745] hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:ring-offset-2 transition-colors"
            >
              <i className="far fa-copy mr-2"></i>Copia
            </Button>
          </div>
          <div className="mt-4 text-sm text-[#6C757D]">
            <p>
              Generato per: <span>{result.name} {result.surname}</span>, 
              nato il <span>{formatDate(result.birthdate)}</span> a <span>{result.birthplace}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
