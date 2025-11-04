const TableHeaderCell = ({ label, sortKey, sortBy, order, onSort, icon }) => {
  const handleClick = () => onSort(sortKey);
  return (
    <th
      onClick={handleClick}
      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150 group"
    >
      <div className="flex items-center space-x-2">
        <span>{label}</span>
        <div className="group-hover:opacity-100 opacity-70">{icon}</div>
      </div>
    </th>
  );
};

export default TableHeaderCell;
