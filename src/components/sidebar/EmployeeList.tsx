import React, { useState, useEffect } from "react";
import { useEmployeeContext } from "../../context/EmployeeProvider";
import { Employee } from "../../models/Employee";
import { PencilIcon } from "lucide-react";
import ImageUpload from "../common/ImageUpload";

interface EditModalProps {
    employee: Employee;
    onSave: (updated: Employee) => void;
    onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ employee, onSave, onClose }) => {
    const [form, setForm] = useState(employee);
    
    const isCEO = employee.managerId === null;

    const handleSave = () => {
        onSave(form);
        onClose();
    };

    const handleImageChange = (imageUrl: string | null) => {
        setForm(prev => ({ ...prev, avatar: imageUrl || undefined }));
    };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 8,
                width: 400,
                maxHeight: "80vh",
                overflowY: "auto"
            }}>
                <h3 style={{ marginTop: 0, marginBottom: 20, color: '#333' }}>
                    Edit Employee {isCEO && <span style={{ color: '#ff5a00', fontSize: 14 }}>(CEO)</span>}
                </h3>
                
                <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
                        Name
                    </label>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        style={{ 
                            width: "95%", 
                            padding: 8, 
                            border: "1px solid #ccc", 
                            borderRadius: 4,
                            fontSize: 14
                        }}
                    />
                </div>
                
                <div style={{ marginBottom: 12 }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: 4, 
                        fontSize: 14, 
                        fontWeight: 'bold',
                        color: isCEO ? '#999' : 'inherit'
                    }}>
                        Designation {isCEO && <span style={{ fontSize: 12, color: '#999' }}>(Cannot be changed)</span>}
                    </label>
                    <input
                        type="text"
                        placeholder="Job Title"
                        value={form.designation}
                        onChange={(e) => setForm(prev => ({ ...prev, designation: e.target.value }))}
                        disabled={isCEO}
                        style={{ 
                            width: "95%", 
                            padding: 8, 
                            border: "1px solid #ccc", 
                            borderRadius: 4,
                            fontSize: 14,
                            backgroundColor: isCEO ? '#f5f5f5' : 'white',
                            color: isCEO ? '#999' : 'inherit',
                            cursor: isCEO ? 'not-allowed' : 'text'
                        }}
                    />
                </div>
                
                <div style={{ marginBottom: 12 }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: 4, 
                        fontSize: 14, 
                        fontWeight: 'bold',
                        color: isCEO ? '#999' : 'inherit'
                    }}>
                        Team {isCEO && <span style={{ fontSize: 12, color: '#999' }}>(Cannot be changed)</span>}
                    </label>
                    <input
                        type="text"
                        placeholder="Department/Team"
                        value={form.team}
                        onChange={(e) => setForm(prev => ({ ...prev, team: e.target.value }))}
                        disabled={isCEO}
                        style={{ 
                            width: "95%", 
                            padding: 8, 
                            border: "1px solid #ccc", 
                            borderRadius: 4,
                            fontSize: 14,
                            backgroundColor: isCEO ? '#f5f5f5' : 'white',
                            color: isCEO ? '#999' : 'inherit',
                            cursor: isCEO ? 'not-allowed' : 'text'
                        }}
                    />
                </div>
                
                <ImageUpload
                    currentImage={form.avatar}
                    onImageChange={handleImageChange}
                    maxSize={2} // 2MB limit
                />
                
                <div style={{ 
                    display: "flex", 
                    gap: 8, 
                    justifyContent: "flex-end",
                    marginTop: 20,
                    paddingTop: 16,
                    borderTop: '1px solid #eee'
                }}>
                    <button 
                        onClick={onClose} 
                        style={{ 
                            padding: "10px 20px", 
                            background: "#f5f5f5", 
                            color: "#333",
                            border: "1px solid #ccc", 
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 14
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave} 
                        style={{ 
                            padding: "10px 20px", 
                            background: "#ff5a00", 
                            color: "white", 
                            border: "none", 
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 14
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

const EmployeeList: React.FC = () => {
    const { state, api } = useEmployeeContext();
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const visible = state.employees.filter((e) => {
        const matchesSearch = (e.name + e.designation + e.team)
            .toLowerCase()
            .includes(state.search.toLowerCase());
        const matchesTeam = state.teamFilter ? e.team === state.teamFilter : true;
        return matchesSearch && matchesTeam;
    });

    const handleSaveEmployee = async (updated: Employee) => {
        try {            
            await api.updateEmployeeDetails(updated.id, {
                name: updated.name,
                designation: updated.designation,
                team: updated.team,
                avatar: updated.avatar,
                managerId: updated.managerId
            });
        } catch (error) {
            console.error("Failed to update employee:", error);
        }
    };

    return (
        <>
            <div style={{
                maxHeight: "calc(100vh - 160px)",
                overflowY: "auto",
                overflowX: "hidden",
                paddingRight: "4px",
				marginBottom: "8px",
                marginTop: "10px",
            }}>
                <ul style={{ 
                    listStyle: "none", 
                    padding: 0,
                    margin: 0 
                }}>
                    {visible.map((e) => (
                        <li key={e.id} style={{ 
                            marginBottom: isMobile ? "6px" : "8px", 
                            position: "relative",
                            padding: isMobile ? "8px" : "12px",
                            backgroundColor: "#f9f9f9",
                            borderRadius: 6,
                            border: "1px solid #e1e5e9"
                        }}>
                            <div style={{ 
                                paddingRight: 30,
                                display: "flex",
                                alignItems: "center",
                                gap: isMobile ? 8 : 10
                            }}>
                                {e.avatar && (
                                    <img
                                        src={e.avatar}
                                        alt={e.name}
                                        style={{
                                            width: isMobile ? 32 : 36,
                                            height: isMobile ? 32 : 36,
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            border: "2px solid #fff",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                            flexShrink: 0
                                        }}
                                    />
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <strong style={{ 
                                        fontSize: isMobile ? 13 : 14,
                                        color: "#333",
                                        display: "block",
                                        marginBottom: 2
                                    }}>
                                        {e.name}
                                    </strong>
                                    <small style={{ 
                                        color: "#666",
                                        fontSize: isMobile ? 11 : 12
                                    }}>
                                        {e.designation} – {e.team}
                                    </small>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditingEmployee(e)}
                                style={{
                                    position: "absolute",
                                    top: isMobile ? 6 : 8,
                                    right: isMobile ? 6 : 8,
                                    background: "#fff",
                                    color: "#666",
                                    border: "1px solid #ddd",
                                    borderRadius: 4,
                                    padding: isMobile ? "4px" : "6px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: isMobile ? 24 : 28,
                                    height: isMobile ? 24 : 28
                                }}
                                title="Edit employee"
                            >
                                <PencilIcon size={isMobile ? 12 : 14} />
                            </button>
                        </li>
                    ))}
                </ul>

                {visible.length === 0 && (
                    <div style={{
                        padding: isMobile ? "20px 10px" : "40px 20px",
                        textAlign: "center",
                        color: "#999",
                        fontSize: isMobile ? 12 : 14
                    }}>
                        {state.employees.length === 0 
                            ? "No employees found" 
                            : "No employees match your search/filter"
                        }
                    </div>
                )}
            </div>
            
            {editingEmployee && (
                <EditModal
                    employee={editingEmployee}
                    onSave={handleSaveEmployee}
                    onClose={() => setEditingEmployee(null)}
                />
            )}
        </>
    );
};

export default EmployeeList;
