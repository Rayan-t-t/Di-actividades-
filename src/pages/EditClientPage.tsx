import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Client } from '../interfaces/Client';
import { ClientsService } from '../services/ClientsServices';

export default function EditClientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client>({
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clientId = Number(id);
    if (!Number.isInteger(clientId) || clientId <= 0) {
      setError('El identificador del cliente no es válido.');
      setLoading(false);
      return;
    }

    ClientsService.getClient(clientId)
      .then(setClient)
      .catch((loadError: unknown) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'No se pudo cargar el cliente.',
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clientId = Number(id);
    if (!Number.isInteger(clientId) || clientId <= 0) {
      setError('El identificador del cliente no es válido.');
      return;
    }

    try {
      await ClientsService.updateClient(clientId, client);
      navigate('/clients');
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'No se pudo guardar el cliente.',
      );
    }
  };

  if (loading) {
    return <div className="container mt-4">Cargando cliente...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Editar cliente</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre</label>
          <input
            id="name"
            className="form-control"
            value={client.name}
            onChange={(event) =>
              setClient({ ...client, name: event.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={client.email}
            onChange={(event) =>
              setClient({ ...client, email: event.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Teléfono</label>
          <input
            id="phone"
            className="form-control"
            value={client.phone}
            onChange={(event) =>
              setClient({ ...client, phone: event.target.value })
            }
            required
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">
          Guardar cambios
        </button>
        <Link to="/clients" className="btn btn-secondary">
          Cancelar
        </Link>
      </form>
    </div>
  );
}
