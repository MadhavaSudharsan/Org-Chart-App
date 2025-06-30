import { Employee } from '../models/Employee';

export interface TreeNode extends Employee {
  children: TreeNode[];
}

// Build a hierarchy from flat employee list. Root nodes have managerId === null.
export function buildTree(employees: Employee[]): TreeNode[] {
  const idToNode = new Map<string, TreeNode>();
  // Init nodes
  employees.forEach((e) => {
    idToNode.set(e.id, { ...e, children: [] });
  });

  const roots: TreeNode[] = [];
  idToNode.forEach((node) => {
    if (node.managerId && idToNode.has(node.managerId)) {
      idToNode.get(node.managerId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}
