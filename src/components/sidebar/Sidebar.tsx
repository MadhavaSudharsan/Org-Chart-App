import React from "react";
import { useEmployeeContext } from "../../context/EmployeeProvider";
import SearchBox from "./SearchBox";
import TeamFilter from "./TeamFilter";
import EmployeeList from "./EmployeeList";

const Sidebar: React.FC = () => {
    const { state } = useEmployeeContext();

    return (
        <div style={{
            width: 300,
            height: "100vh",
            backgroundColor: "#f8f9fa",
            borderRight: "1px solid #e1e5e9",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
        }}>
            <div style={{
                padding: 16,
                borderBottom: "1px solid #e1e5e9",
                backgroundColor: "#fff",
                flexShrink: 0
            }}>
                <h2 style={{ 
                    margin: 0, 
                    marginBottom: 16, 
                    fontSize: 18,
                    color: "#333",
                    fontWeight: "600"
                }}>
                    Organization
                </h2>
                
                {/* Search Box */}
                <div style={{ marginBottom: 12 }}>
                    <SearchBox />
                </div>
                
                {/* Team Filter */}
                <TeamFilter />
            </div>

            <div style={{
                flex: 1,
                padding: 16,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
            }}>
                <div style={{
                    marginBottom: 12,
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#555"
                }}>
                    Employees
                </div>
                
                <EmployeeList />
            </div>

            {state.loading && (
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(255,255,255,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    color: "#666"
                }}>
                    Loading employees...
                </div>
            )}
        </div>
    );
};

export default Sidebar;