const API_BASE_URL = 'http://localhost:5000/api';

// Get all equipment
export const getAllEquipment = async () => {
    const response = await fetch(`${API_BASE_URL}/equipment`);
    if (!response.ok) {
        throw new Error('Failed to fetch equipment');
    }
    return response.json();
};

// Get single equipment by ID
export const getEquipmentById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/equipment/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch equipment');
    }
    return response.json();
};

// Create new equipment
export const createEquipment = async (data) => {
    const response = await fetch(`${API_BASE_URL}/equipment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.errors?.join(', ') || result.error || 'Failed to create equipment');
    }

    return result;
};

// Update equipment
export const updateEquipment = async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.errors?.join(', ') || result.error || 'Failed to update equipment');
    }

    return result;
};

// Delete equipment
export const deleteEquipment = async (id) => {
    const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete equipment');
    }

    return response.json();
};
