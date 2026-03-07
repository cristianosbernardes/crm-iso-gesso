import { useParams, useNavigate } from "react-router-dom";
import { useClientes } from "@/hooks/useClientes";
import ClienteDetalhe from "@/components/clientes/ClienteDetalhe";
import { Skeleton } from "@/components/ui/skeleton";

const ClienteDetalhePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clientes, isLoading } = useClientes();

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-5">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-48 rounded-lg" />
      </div>
    );
  }

  const cliente = clientes.find((c) => c.id === id);

  if (!cliente) {
    return (
      <div className="p-6 lg:p-8 text-center py-20">
        <p className="text-muted-foreground">Cliente não encontrado</p>
      </div>
    );
  }

  return (
    <ClienteDetalhe
      cliente={cliente}
      onBack={() => navigate("/dashboard/clientes")}
    />
  );
};

export default ClienteDetalhePage;
