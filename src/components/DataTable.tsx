interface DataTableProps {
  headers: string[];
  rows: string[][];
  compact?: boolean;
}

const DataTable = ({ headers, rows, compact }: DataTableProps) => (
  <div className="overflow-x-auto rounded-xl border border-border my-4 glow-box card-hover">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-secondary/80 border-b border-border">
          {headers.map((h, i) => (
            <th key={i} className={`text-left font-mono text-xs text-primary font-semibold tracking-wide ${compact ? 'px-3 py-2.5' : 'px-4 py-3'}`}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={`border-b border-border/30 hover:bg-primary/5 transition-colors ${i % 2 === 1 ? 'bg-secondary/20' : ''}`}>
            {row.map((cell, j) => (
              <td key={j} className={`font-mono text-xs text-foreground/80 ${compact ? 'px-3 py-2' : 'px-4 py-3'} ${j === 0 ? 'text-primary/80 font-medium' : ''}`}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
