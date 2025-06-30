import React from "react";
import { useEmployeeContext } from "../../context/EmployeeProvider";
import SearchBox from "../sidebar/SearchBox";
import TeamFilter from "../sidebar/TeamFilter";
import EmployeeList from "../sidebar/EmployeeList";
import { Users, ChevronDown, ChevronUp } from "lucide-react";

interface MobileHeaderProps {
    logo: string;
    isExpanded: boolean;
    onToggle: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ logo, isExpanded, onToggle }) => {
    const { state } = useEmployeeContext();

    const visible = state.employees.filter((e) => {
        const matchesSearch = (e.name + e.designation + e.team)
            .toLowerCase()
            .includes(state.search.toLowerCase());
        const matchesTeam = state.teamFilter ? e.team === state.teamFilter : true;
        return matchesSearch && matchesTeam;
    });

    return (
        <>
            {/* Mobile Header */}
            <div style={{
                width: "100%",
                backgroundColor: "#fff",
                borderBottom: "2px solid #e1e5e9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "sticky",
                top: 0,
                zIndex: 1000
            }}>
                {/* Header Bar */}
                <div style={{
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#fff"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                    }}>
                        <img 
                            src={logo} 
                            alt="Company Logo" 
                            style={{ width: 24, height: 24 }}
                        />
                        <h2 style={{ 
                            margin: 0, 
                            fontSize: 16,
                            color: "#333",
                            fontWeight: "600"
                        }}>
                            Organization Chart
                        </h2>
                    </div>
                    
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                    }}>
                        <span style={{
                            fontSize: 12,
                            color: "#666",
                            backgroundColor: "#f0f0f0",
                            padding: "4px 8px",
                            borderRadius: 12
                        }}>
                            {visible.length}/{state.employees.length}
                        </span>
                        
                        <button
                            onClick={onToggle}
                            style={{
                                background: "#ff5a00",
                                color: "white",
                                border: "none",
                                borderRadius: 6,
                                padding: "8px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 2px 4px rgba(255,90,0,0.3)"
                            }}
                            title={isExpanded ? "Collapse" : "Expand"}
                        >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    </div>
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                    <div style={{
                        borderTop: "1px solid #e1e5e9",
                        backgroundColor: "#f8f9fa",
                        maxHeight: "70vh",
                        overflowY: "auto"
                    }}>

                        {/* Search and Filter Section */}
                        <div style={{
                            padding: 16,
                            backgroundColor: "#fff",
                            borderBottom: "1px solid #e1e5e9"
                        }}>
                            <div style={{ marginBottom: 12 }}>
                                <SearchBox />
                            </div>
                            <TeamFilter />
                        </div>

                        {/* Employee List Section */}
                        <div style={{
                            padding: 16,
                            maxHeight: "40vh",
                            overflowY: "auto"
                        }}>
                            <div style={{
                                marginBottom: 12,
                                fontSize: 14,
                                fontWeight: "600",
                                color: "#555",
                                display: "flex",
                                alignItems: "center",
                                gap: 6
                            }}>
                                <Users size={16} />
                                Employees
                            </div>
                            <EmployeeList />
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: "8px 16px",
                            backgroundColor: "#fff",
                            borderTop: "1px solid #e1e5e9",
                            fontSize: 11,
                            color: "#666",
                            textAlign: "center"
                        }}>
                             Showing {visible.length} of {state.employees.length} employees
                            {state.teamFilter && state.teamFilter !== "All Teams" && (
                                <div style={{ color: "#ff5a00", fontSize: 10 }}>
                                    Filtered by {state.teamFilter}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Overlay when expanded */}
            {isExpanded && (
                <div 
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.3)",
                        zIndex: 999
                    }}
                    onClick={onToggle}
                />
            )}
        </>
    );
};

export default MobileHeader;