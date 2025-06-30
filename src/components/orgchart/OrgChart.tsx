import React from 'react';
import { useEmployeeContext } from '../../context/EmployeeProvider';
import { buildTree } from '../../utils/buildTree';
import EmployeeNode from './EmployeeNode';

const OrgChart: React.FC = () => {
  const { state } = useEmployeeContext();

  // Filter by team when set
  const list = state.teamFilter
    ? state.employees.filter((e) => e.team === state.teamFilter)
    : state.employees;

  const roots = buildTree(list);

  return (
    <div>
      {roots.map((root) => (
        <EmployeeNode key={root.id} node={root} />
      ))}
    </div>
  );
};

export default OrgChart;
