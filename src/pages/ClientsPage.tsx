import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Client } from '../interfaces/Client';
import { ClientsService } from '../services/ClientsServices';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState('');

  const loadClients = async () => {
    try {
      setClients(await ClientsService.getClients());
      setError('');
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudieron cargar los clientes.',
      );
    }
  };

  const deleteClient = async (id: number) => {
    if (!window.confirm('¿Quieres eliminar este cliente?')) {
      return;
    }

    try {
      await ClientsService.deleteClient(id);
      await loadClients();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar el cliente.',
      );
    }
  };

  useEffect(() => {
    void loadClients();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Clientes</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Link to="/new-client" className="btn btn-primary mb-3">
        Nuevo Cliente
      </Link>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td>
                <div className="d-flex gap-2">
                  <Link
                    to={`/edit-client/${client.id}`}
                    className="btn btn-warning btn-sm"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => client.id !== undefined && deleteClient(client.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
