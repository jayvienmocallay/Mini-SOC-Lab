interface DataTableProps {
  headers: string[];
  rows: string[][];
  compact?: boolean;
}

const DataTable = ({ headers, rows, compact }: DataTableProps) => (
  <div className="overflow-x-auto rounded-lg border border-border my-4 glow-box">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-secondary border-b border-border">
          {headers.map((h, i) => (
            <th key={i} className={`text-left font-mono text-xs text-primary font-semibold ${compact ? 'px-3 py-2' : 'px-4 py-3'}`}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
            {row.map((cell, j) => (
              <td key={j} className={`font-mono text-xs text-foreground/80 ${compact ? 'px-3 py-1.5' : 'px-4 py-3'}`}>
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
