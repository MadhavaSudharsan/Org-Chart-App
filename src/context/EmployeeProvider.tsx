import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Employee } from '../models/Employee';
import { getEmployees, updateEmployee, createEmployee, deleteEmployee } from '../api/employeeApi';

type State = {
  employees: Employee[];
  search: string;
  teamFilter: string | null;
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'SET_EMPLOYEES'; employees: Employee[] }
  | { type: 'SET_SEARCH'; value: string }
  | { type: 'SET_TEAM_FILTER'; value: string | null }
  | { type: 'UPDATE_EMPLOYEE'; employee: Employee }
  | { type: 'ADD_EMPLOYEE'; employee: Employee }
  | { type: 'REMOVE_EMPLOYEE'; id: string }
  | { type: 'SET_LOADING'; value: boolean }
  | { type: 'SET_ERROR'; value: string | null };

const EmployeeContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  api: { 
    updateManager: (id: string, managerId: string | null) => Promise<void>;
    updateEmployeeDetails: (id: string, updates: Partial<Employee>) => Promise<void>;
    createEmployee: (employee: Employee) => Promise<void>;
    deleteEmployee: (id: string) => Promise<void>;
  };
} | null>(null);

const initialState: State = {
  employees: [],
  search: '',
  teamFilter: null,
  loading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.employees };
    case 'SET_SEARCH':
      return { ...state, search: action.value };
    case 'SET_TEAM_FILTER':
      return { ...state, teamFilter: action.value };
    case 'UPDATE_EMPLOYEE': {
      const updatedList = state.employees.map((e) =>
        e.id === action.employee.id ? action.employee : e
      );
      return { ...state, employees: updatedList };
    }
    case 'ADD_EMPLOYEE': {
      return { ...state, employees: [...state.employees, action.employee] };
    }
    case 'REMOVE_EMPLOYEE': {
      return { ...state, employees: state.employees.filter(e => e.id !== action.id) };
    }
    case 'SET_LOADING':
      return { ...state, loading: action.value };
    case 'SET_ERROR':
      return { ...state, error: action.value };
    default:
      return state;
  }
}

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function load() {
      dispatch({ type: 'SET_LOADING', value: true });
      try {
        const list = await getEmployees();
        dispatch({ type: 'SET_EMPLOYEES', employees: list });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', value: (err as Error).message });
      } finally {
        dispatch({ type: 'SET_LOADING', value: false });
      }
    }
    load();
  }, []);

  const updateManager = async (id: string, managerId: string | null) => {
    const emp = state.employees.find((e) => e.id === id);
    if (!emp) return;
    const updated = await updateEmployee(id, { managerId });
    dispatch({ type: 'UPDATE_EMPLOYEE', employee: updated });
  };

  const updateEmployeeDetails = async (id: string, updates: Partial<Employee>) => {
    try {
      const updated = await updateEmployee(id, updates);
      dispatch({ type: 'UPDATE_EMPLOYEE', employee: updated });
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  const createEmployeeInAPI = async (employee: Employee) => {
    try {
                const created = await createEmployee(employee);
        dispatch({ type: 'ADD_EMPLOYEE', employee: created });
    } catch (error) {
        console.error("Failed to create employee:", error);
    }
  };

  const deleteEmployeeFromAPI = async (id: string) => {
    try {
        await deleteEmployee(id);
        dispatch({ type: 'REMOVE_EMPLOYEE', id });
    } catch (error) {
    }
  };

  const api = {
    updateManager,
    updateEmployeeDetails,
    createEmployee: createEmployeeInAPI,
    deleteEmployee: deleteEmployeeFromAPI,
  };

  return (
    <EmployeeContext.Provider value={{ state, dispatch, api }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error('useEmployeeContext must be used within EmployeeProvider');
  return ctx;
};
