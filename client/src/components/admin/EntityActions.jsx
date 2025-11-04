// components/admin/EntityActions.jsx
import { FaEye, FaEdit, FaTrash, FaExchangeAlt } from "react-icons/fa";

const EntityActions = ({ onView, onEdit, onToggleRole, onDelete }) => (
  <div className="flex space-x-3 justify-center">
    {onView && (
      <button
        onClick={onView}
        className="text-blue-500 hover:text-blue-600 transition-colors p-1 rounded-lg hover:bg-blue-50"
        title="View"
      >
        <FaEye />
      </button>
    )}
    {onEdit && (
      <button
        onClick={onEdit}
        className="text-green-500 hover:text-green-600 transition-colors p-1 rounded-lg hover:bg-green-50"
        title="Edit"
      >
        <FaEdit />
      </button>
    )}
    {onToggleRole && (
      <button
        onClick={onToggleRole}
        className="text-yellow-500 hover:text-yellow-600 transition-colors p-1 rounded-lg hover:bg-yellow-50"
        title="Toggle Role"
      >
        <FaExchangeAlt />
      </button>
    )}
    {onDelete && (
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50"
        title="Delete"
      >
        <FaTrash />
      </button>
    )}
  </div>
);

export default EntityActions;
