import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageShell from "@/components/PageShell";
import { initialEquipamentos } from "@/lib/mockData";

export default function EquipamentosPage() {
  const totalDevices = initialEquipamentos.reduce((acc, item) => acc + item.total, 0);
  const inUse = initialEquipamentos.reduce((acc, item) => acc + item.emUso, 0);
  const inRepair = initialEquipamentos.reduce((acc, item) => acc + item.reparo, 0);

  return (
    <PageShell title="Equipamentos" description="Visão completa dos 13 equipamentos da EE Jeminiano David Müzel.">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total de dispositivos</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{totalDevices}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Em uso</p>
            <p className="mt-3 text-4xl font-semibold text-jdm-azul">{inUse}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Em reparo</p>
            <p className="mt-3 text-4xl font-semibold text-jdm-amarelo">{inRepair}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Tabela de equipamentos</h2>
              <p className="text-sm text-slate-600">Os 13 equipamentos cadastrados em sistema.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Em uso</TableHead>
                  <TableHead>Reparo</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {initialEquipamentos.map((equip) => (
                  <TableRow key={equip.id}>
                    <TableCell>{equip.nome}</TableCell>
                    <TableCell>{equip.tipo}</TableCell>
                    <TableCell>{equip.local}</TableCell>
                    <TableCell>{equip.total}</TableCell>
                    <TableCell>{equip.emUso}</TableCell>
                    <TableCell>{equip.reparo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
