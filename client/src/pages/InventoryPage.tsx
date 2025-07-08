import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Pencil, Save } from 'lucide-react';

interface Flower {
  _id: string;
  name: string;
  type: string;
  color: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export default function FlowerInventoryPage() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [newFlower, setNewFlower] = useState<Omit<Flower, '_id'>>({
    name: '',
    type: '',
    color: '',
    price: 0,
    quantity: 0,
    imageUrl: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Flower>>({});

  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const res = await axios.get<Flower[]>('/api/flowers');
        setFlowers(res.data);
      } catch (err) {
        console.error('Failed to fetch flowers:', err);
      }
    };
    fetchFlowers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFlower((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleAddFlower = async () => {
    try {
      const res = await axios.post<Flower>('/api/flowers', newFlower);
      setFlowers((prev) => [...prev, res.data]);
      setNewFlower({ name: '', type: '', color: '', price: 0, quantity: 0, imageUrl: '' });
    } catch (err) {
      console.error('Error adding flower:', err);
    }
  };

  const handleDeleteFlower = async (id: string) => {
    try {
      await axios.delete(`/api/flowers/${id}`);
      setFlowers((prev) => prev.filter((flower) => flower._id !== id));
    } catch (err) {
      console.error('Error deleting flower:', err);
    }
  };

  const startEditing = (flower: Flower) => {
    setEditingId(flower._id);
    setEditValues({ ...flower });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value,
    }));
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await axios.put<Flower>(`/api/flowers/${id}`, editValues);
      setFlowers((prev) => prev.map((f) => (f._id === id ? res.data : f)));
      setEditingId(null);
      setEditValues({});
    } catch (err) {
      console.error('Error updating flower:', err);
    }
  };

  return (
    <div className="p-4">
      {/* Add Flower Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add a New Flower</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Input name="name" value={newFlower.name} onChange={handleInputChange} placeholder="Name" />
          <Input name="type" value={newFlower.type} onChange={handleInputChange} placeholder="Type" />
          <Input name="color" value={newFlower.color} onChange={handleInputChange} placeholder="Color" />
          <Input name="price" type="number" value={newFlower.price} onChange={handleInputChange} placeholder="Price" />
          <Input name="quantity" type="number" value={newFlower.quantity} onChange={handleInputChange} placeholder="Quantity" />
          <Input name="imageUrl" value={newFlower.imageUrl} onChange={handleInputChange} placeholder="Image URL" />
        </div>
        <Button onClick={handleAddFlower} className="mt-4">Add Flower</Button>
      </div>

      {/* Flower Inventory Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {flowers.map((flower) => {
          const isEditing = editingId === flower._id;
          return (
            <Card key={flower._id} className="relative rounded-2xl shadow-md">
              <div className="absolute top-2 right-2 flex gap-2">
                {isEditing ? (
                  <Button variant="ghost" onClick={() => saveEdit(flower._id)} className="text-green-600">
                    <Save className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => startEditing(flower)} className="text-blue-500">
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="ghost" onClick={() => handleDeleteFlower(flower._id)} className="text-red-500">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                {flower.imageUrl && (
                  <img
                    src={isEditing ? (editValues.imageUrl || '') : flower.imageUrl}
                    alt={flower.name}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                )}
                {isEditing ? (
                  <div className="space-y-2">
                    <Input name="name" value={editValues.name || ''} onChange={handleEditChange} placeholder="Name" />
                    <Input name="type" value={editValues.type || ''} onChange={handleEditChange} placeholder="Type" />
                    <Input name="color" value={editValues.color || ''} onChange={handleEditChange} placeholder="Color" />
                    <Input name="price" type="number" value={editValues.price?.toString() || ''} onChange={handleEditChange} placeholder="Price" />
                    <Input name="quantity" type="number" value={editValues.quantity?.toString() || ''} onChange={handleEditChange} placeholder="Quantity" />
                    <Input name="imageUrl" value={editValues.imageUrl || ''} onChange={handleEditChange} placeholder="Image URL" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold mb-1">{flower.name}</h2>
                    <p className="text-gray-600">{flower.type}</p>
                    <p className="text-gray-500">Color: {flower.color}</p>
                    <p className="text-sm">Price: ${flower.price.toFixed(2)}</p>
                    <p className="text-sm">Quantity: {flower.quantity}</p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
