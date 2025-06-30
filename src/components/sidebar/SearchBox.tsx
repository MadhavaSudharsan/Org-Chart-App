import React from "react";
import { useEmployeeContext } from "../../context/EmployeeProvider";

const SearchBox: React.FC = () => {
	const { state, dispatch } = useEmployeeContext();

	return (
		<input
			type="text"
			placeholder="Search by name, designation, team…"
			value={state.search}
			onChange={(e) => dispatch({ type: "SET_SEARCH", value: e.target.value })}
			style={{ width: '97%', height: 27, marginBottom: "0.5rem" }}
		/>
	);
};

export default SearchBox;
