import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { useEmployeeContext } from "../../context/EmployeeProvider";
import { TreeNode } from "../../utils/buildTree";

const boxStyle: React.CSSProperties = {
	border: "1px solid #333",
	borderRadius: 4,
	background: "#fff",

	padding: 8,
	maxWidth: 150,
	boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
	display: "flex",
	alignItems: "center",
};

const TYPE = "EMPLOYEE";

const EmployeeCard: React.FC<{ node: TreeNode }> = ({ node }) => {
	const { api, state } = useEmployeeContext();
	const ref = React.useRef<HTMLDivElement>(null);

	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: TYPE,
			item: { id: node.id },
			collect: (monitor) => ({ isDragging: monitor.isDragging() }),
		}),
		[node.id]
	);

	const [, drop] = useDrop(
		() => ({
			accept: TYPE,
			canDrop: (item: { id: string }) => {
				if (item.id === node.id) return false;
				const isAncestor = (sourceId: string, targetId: string): boolean => {
					const target = state.employees.find((e) => e.id === targetId);
					if (!target || !target.managerId) return false;
					if (target.managerId === sourceId) return true;
					return isAncestor(sourceId, target.managerId);
				};
				return !isAncestor(item.id, node.id);
			},
			drop: (item: { id: string }) => {
				if (item.id !== node.id) {
					api.updateManager(item.id, node.id);
				}
			},
		}),
		[node.id, api, state.employees]
	);

	drag(drop(ref));

	const handleSelect = () => {
    document.querySelectorAll('.org-node.selected').forEach((el) => el.classList.remove('selected'));
    ref.current?.classList.add('selected');
  };

  return (
		<div
      onClick={handleSelect}
			ref={ref}
			style={{ ...boxStyle, opacity: isDragging ? 0.5 : 1 }}
			className="org-node"
      data-id={node.id}
		>
			{node.avatar && (
				<img
					src={node.avatar}
					alt={node.name}
					style={{ width: 50, height: 50, borderRadius: "50%", marginRight: 8 }}
				/>
			)}
			<div style={{ fontSize: 10, textAlign: "center" }}>
				<strong style={{ fontSize: 14 }}>{node.name}</strong>
				<br />
				<span>{node.designation}</span>
			</div>
		</div>
	);
};

export default EmployeeCard;
