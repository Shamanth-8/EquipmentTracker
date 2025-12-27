import './EquipmentTable.css';

function EquipmentTable({ equipment, onEdit, onDelete, isLoading, searchTerm }) {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Active':
                return 'status-active';
            case 'Inactive':
                return 'status-inactive';
            case 'Under Maintenance':
                return 'status-maintenance';
            default:
                return '';
        }
    };

    if (isLoading) {
        return <div className="loading">Loading equipment...</div>;
    }

    if (equipment.length === 0) {
        return (
            <div className="empty-state">
                <p>
                    {searchTerm 
                        ? `No equipment found matching "${searchTerm}". Try a different search term.`
                        : 'No equipment found. Add your first equipment to get started!'
                    }
                </p>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="equipment-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Last Cleaned</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {equipment.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.type}</td>
                            <td>
                                <span className={`status-badge ${getStatusClass(item.status)}`}>
                                    {item.status}
                                </span>
                            </td>
                            <td>{formatDate(item.lastCleanedDate)}</td>
                            <td className="actions-cell">
                                <button
                                    onClick={() => onEdit(item)}
                                    className="btn-edit"
                                    title="Edit"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="btn-delete"
                                    title="Delete"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EquipmentTable;
