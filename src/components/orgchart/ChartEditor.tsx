import React, { useEffect, useState } from "react";
import { useEmployeeContext } from "../../context/EmployeeProvider";
import { Employee } from "../../models/Employee";
import { Edit } from "lucide-react";

export type EditAction = "parent" | "siblings" | "children" | "remove";

const ChartEditor: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [nodeValues, setNodeValues] = useState<string>("");
	const [action, setAction] = useState<EditAction>("children");
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const { state, api } = useEmployeeContext();

	const handleClick = async () => {
		const vals = nodeValues
			.split(",")
			.map((v: string) => v.trim())
			.filter(Boolean);
		const selectedEl = document.querySelector(
			".org-node.selected"
		) as HTMLElement | null;

		if (action !== "parent" && !selectedEl) {
			alert("Please select a node first");
			return;
		}

		let updated = [...state.employees];
		const findEmpById = (id: string) => updated.find((e) => e.id === id);
		const selectedId = selectedEl?.getAttribute("data-id") ?? "";

		const newEmployees: Employee[] = [];

		for (const name of vals) {
			const newEmployee: Employee = {
				id: genId(),
				name,
				designation: "Employee",
				team: "General",
				managerId: selectedId,
				avatar: undefined,
			};

			switch (action) {
				case "children":
					newEmployee.managerId = selectedId;
					break;
				case "siblings":
					const parentId = findEmpById(selectedId)?.managerId ?? null;
					newEmployee.managerId = parentId;
					break;
				case "parent":
					if (!selectedEl) return;
					const prevParent = findEmpById(selectedId)?.managerId ?? null;
					newEmployee.managerId = prevParent;
					newEmployee.designation = "Manager";
					newEmployee.team = "Management";

					// Update selected employee to report to new parent
					const selectedEmployee = findEmpById(selectedId);
					if (selectedEmployee) {
						await api.updateManager(selectedId, newEmployee.id);
					}
					break;
			}

			newEmployees.push(newEmployee);
		}

		for (const emp of newEmployees) {
			await api.createEmployee(emp);
		}

		// Handle remove action
		if (action === "remove") {
			if (!selectedEl) {
				alert("Please select a node to remove");
				return;
			}

			const selectedId = selectedEl.getAttribute("data-id") ?? "";
			if (selectedId) {
				await api.deleteEmployee(selectedId);
			}
			return;
		}

		setNodeValues("");
	};

	const genId = () => `emp-${Math.random().toString(36).slice(2, 9)}`;

	return (
		<div
			style={{
				position: "fixed",
				bottom: 20,
				zIndex: 1000,
			}}
		>
			<button
				style={{
					border: "none",
					background: "#ff5a00",
					color: "white",
					width: 40,
					height: 40,
					borderRadius: "50%",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
				onClick={() => setOpen(!open)}
			>
				<Edit size={16} />
			</button>

			{open && (
				<div
					style={{
						marginTop: 10,
						display: "flex",
						flexDirection: isMobile ? "column" : "row",
						alignItems: isMobile ? "stretch" : "center",
						gap: isMobile ? 8 : 12,
						background: "#fff",
						padding: isMobile ? "10px" : "4px",
						borderRadius: 6,
						boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
						maxWidth: isMobile ? "90vw" : "95vw",
						width: isMobile ? "90vw" : "auto",
						marginLeft: isMobile ? "" : "20px",
					}}
				>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							justifyContent: isMobile ? "space-between" : "flex-start",
							gap: 8,
						}}
					>
						<label>
							<input
								type="radio"
								name="action"
								value="children"
								checked={action === "children"}
								onChange={() => setAction("children")}
							/>{" "}
							Add Children
						</label>
						<label>
							<input
								type="radio"
								name="action"
								value="siblings"
								checked={action === "siblings"}
								onChange={() => setAction("siblings")}
							/>{" "}
							Add Siblings
						</label>
						<label>
							<input
								type="radio"
								name="action"
								value="parent"
								checked={action === "parent"}
								onChange={() => setAction("parent")}
							/>{" "}
							Add Parent
						</label>
						<label>
							<input
								type="radio"
								name="action"
								value="remove"
								checked={action === "remove"}
								onChange={() => setAction("remove")}
							/>{" "}
							Remove Node
						</label>
					</div>

					<input
						type="text"
						placeholder="Node names (comma separated)"
						value={nodeValues}
						onChange={(e) => setNodeValues(e.target.value)}
						style={{
							width: isMobile ? "95%" : 260,
							height: 28,
							padding: "4px 8px",
							borderRadius: 4,
							border: "1px solid #ccc",
						}}
					/>
					<button
						onClick={handleClick}
						style={{
							background: "#ff5a00",
							color: "white",
							border: "none",
							padding: "6px 12px",
							borderRadius: 4,
							cursor: "pointer",
							width: isMobile ? "100%" : "auto",
						}}
					>
						Apply
					</button>
				</div>
			)}
		</div>
	);
};

export default ChartEditor;
