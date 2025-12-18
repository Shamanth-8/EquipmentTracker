import { useState, useEffect } from 'react';
import './EquipmentForm.css';

const EQUIPMENT_TYPES = ['Machine', 'Vessel', 'Tank', 'Mixer'];
const STATUS_OPTIONS = ['Active', 'Inactive', 'Under Maintenance'];

function EquipmentForm({ equipment, onSubmit, onCancel, isLoading }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Machine',
        status: 'Active',
        lastCleanedDate: new Date().toISOString().split('T')[0],
    });
    const [errors, setErrors] = useState({});

    // Pre-fill form when editing
    useEffect(() => {
        if (equipment) {
            setFormData({
                name: equipment.name || '',
                type: equipment.type || 'Machine',
                status: equipment.status || 'Active',
                lastCleanedDate: equipment.lastCleanedDate || new Date().toISOString().split('T')[0],
            });
        }
    }, [equipment]);

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.type) {
            newErrors.type = 'Type is required';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        if (!formData.lastCleanedDate) {
            newErrors.lastCleanedDate = 'Last Cleaned Date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when field is modified
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{equipment ? 'Edit Equipment' : 'Add New Equipment'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter equipment name"
                            disabled={isLoading}
                        />
                        {errors.name && <span className="error">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Type *</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            disabled={isLoading}
                        >
                            {EQUIPMENT_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        {errors.type && <span className="error">{errors.type}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status *</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={isLoading}
                        >
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        {errors.status && <span className="error">{errors.status}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastCleanedDate">Last Cleaned Date *</label>
                        <input
                            type="date"
                            id="lastCleanedDate"
                            name="lastCleanedDate"
                            value={formData.lastCleanedDate}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.lastCleanedDate && <span className="error">{errors.lastCleanedDate}</span>}
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} disabled={isLoading} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="btn-submit">
                            {isLoading ? 'Saving...' : equipment ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EquipmentForm;
