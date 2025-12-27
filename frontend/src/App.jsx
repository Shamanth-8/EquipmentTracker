import { useState, useEffect } from 'react';
import EquipmentTable from './components/EquipmentTable';
import EquipmentForm from './components/EquipmentForm';
import {
  getAllEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from './services/api';
import './App.css';

function App() {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [error, setError] = useState(null);

  // Fetch equipment on mount
  useEffect(() => {
    fetchEquipment();
  }, []);

  // Filter equipment based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEquipment(equipment);
    } else {
      const filtered = equipment.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEquipment(filtered);
    }
  }, [searchTerm, equipment]);

  const fetchEquipment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllEquipment();
      setEquipment(data);
      setFilteredEquipment(data);
    } catch (err) {
      setError('Failed to load equipment. Please make sure the server is running.');
      console.error('Error fetching equipment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddClick = () => {
    setEditingEquipment(null);
    setShowForm(true);
  };

  const handleEditClick = (item) => {
    setEditingEquipment(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEquipment(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (editingEquipment) {
        // Update existing
        await updateEquipment(editingEquipment.id, formData);
      } else {
        // Create new
        await createEquipment(formData);
      }

      // Refresh the list
      await fetchEquipment();
      handleFormClose();
    } catch (err) {
      setError(err.message || 'Failed to save equipment');
      console.error('Error saving equipment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) {
      return;
    }

    try {
      setError(null);
      await deleteEquipment(id);
      await fetchEquipment();
    } catch (err) {
      setError(err.message || 'Failed to delete equipment');
      console.error('Error deleting equipment:', err);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Equipment Tracker</h1>
        <button onClick={handleAddClick} className="btn-add">
          + Add Equipment
        </button>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)} className="error-close">
              ×
            </button>
          </div>
        )}

        <div className="search-container">
          <input
            type="text"
            placeholder="Search equipment by name, type, or status..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <div className="search-results">
              Found {filteredEquipment.length} of {equipment.length} items
            </div>
          )}
        </div>

        <EquipmentTable
          equipment={filteredEquipment}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          isLoading={isLoading}
          searchTerm={searchTerm}
        />
      </main>

      {showForm && (
        <EquipmentForm
          equipment={editingEquipment}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}

export default App;
