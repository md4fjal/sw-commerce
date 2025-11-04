import TableHeaderCell from "./TableHeaderCell";

const DataTable = ({ columns, rows, sortBy, order, onSort }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map(({ key, label, icon }) => (
              <TableHeaderCell
                key={key}
                label={label}
                sortKey={key}
                sortBy={sortBy}
                order={order}
                onSort={onSort}
                icon={icon}
              />
            ))}
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">{rows}</tbody>
      </table>
    </div>
  </div>
);

export default DataTable;
