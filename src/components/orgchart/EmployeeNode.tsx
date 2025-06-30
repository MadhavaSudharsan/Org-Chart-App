import React from "react";
import { TreeNode } from "../../utils/buildTree";
import { useDrag, useDrop } from "react-dnd";
import { useEmployeeContext } from "../../context/EmployeeProvider";

const boxStyle: React.CSSProperties = {
	border: "1px solid #888",
	borderRadius: 4,
	paddingTop: 30,
	display: "inline-block",
	background: "#fff",
};

const vertical: React.CSSProperties = {
	marginLeft: 24,
	borderLeft: "1px dashed #999",
	paddingLeft: 16,
};

const TYPE = "EMPLOYEE";

const EmployeeNode: React.FC<{ node: TreeNode }> = ({ node }) => {
	const { api, state } = useEmployeeContext();

	const ref = React.useRef<HTMLDivElement>(null);

	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: TYPE,
			item: { id: node.id },
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
			}),
		}),
		[node.id]
	);

	const [, drop] = useDrop(
		() => ({
			accept: TYPE,
			canDrop: (item: { id: string }) => {
				if (item.id === node.id) return false;
				// prevent dropping onto own descendant -> check if target is within source subtree
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
		[node.id, api]
	);

	drag(drop(ref));

	return (
		<div ref={ref}>
			<div style={{ ...boxStyle, opacity: isDragging ? 0.5 : 1 }}>
				{node.avatar && (
					<img
						src={node.avatar}
						alt={node.name}
						style={{
							width: 40,
							height: 40,
							borderRadius: "50%",
							marginRight: 8,
						}}
					/>
				)}
				<div style={{ display: "inline-block", verticalAlign: "top" }}>
					<strong>{node.name}</strong>
					<br />
					<small>{node.designation}</small>
				</div>
			</div>
			{(node.children?.length ?? 0) > 0 && (
				<div style={vertical}>
					{(node.children ?? []).map((child) => (
						<EmployeeNode key={child.id} node={child} />
					))}
				</div>
			)}
		</div>
	);
};

export default EmployeeNode;
