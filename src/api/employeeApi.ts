import { Employee } from '../models/Employee';

const BASE_URL = '/api/employees';

export async function getEmployees(): Promise<Employee[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch employees');
  const data = await res.json();
  return (data.employees ?? data) as Employee[];
}

export async function updateEmployee(
  id: string,
  attrs: Partial<Omit<Employee, 'id'>>
): Promise<Employee> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attrs),
  });
  if (!res.ok) throw new Error('Failed to update employee');
  return (await res.json()) as Employee;
}

export async function createEmployee(employee: Omit<Employee, 'id'> & { id: string }): Promise<Employee> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  });
  
  if (!res.ok) {
    throw new Error('Failed to create employee');
  }
  
  return res.json();
}

export async function deleteEmployee(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    throw new Error('Failed to delete employee');
  }
}
