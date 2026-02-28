const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <h1 className="text-2xl font-bold uppercase tracking-wider">{title}</h1>
    <p className="mt-2 text-sm text-muted-foreground">Módulo em construção — Sprint 2</p>
  </div>
);

export default PlaceholderPage;
