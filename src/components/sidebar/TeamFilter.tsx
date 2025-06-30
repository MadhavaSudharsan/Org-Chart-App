import React from "react";
import { useEmployeeContext } from "../../context/EmployeeProvider";

const TeamFilter: React.FC = () => {
	const { state, dispatch } = useEmployeeContext();
	const teams = Array.from(new Set(state.employees.map((e) => e.team)));

	return (
		<select
			value={state.teamFilter ?? ""}
			onChange={(e) =>
				dispatch({
					type: "SET_TEAM_FILTER",
					value: e.target.value || null,
				})
			}
			style={{ width: '100%', height: 35, marginBottom: "0.5rem" }}
		>
			<option value="">All Teams</option>
			{teams.map((t) => (
				<option key={t}>{t}</option>
			))}
		</select>
	);
};

export default TeamFilter;
