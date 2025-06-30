// @ts-ignore – No types published for this package
import OrgChart from "@dabeng/react-orgchart";
import "@dabeng/react-orgchart/dist/ChartContainer.css";
import "@dabeng/react-orgchart/dist/ChartNode.css";
import "./orgchartOverrides.css";
import React, {
    useMemo,
    createContext,
    useState,
    useRef,
    useEffect,
} from "react";
import { useEmployeeContext } from "../../context/EmployeeProvider";
import { buildTree, TreeNode } from "../../utils/buildTree";
import EmployeeCard from "./EmployeeCard";
import ZoomControls from "./ZoomControls";

export const OrgChartMethodsContext = createContext<any>(null);

const OrgChartLib: React.FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    const { state } = useEmployeeContext();
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            const orgchartContainer = containerRef.current.querySelector('.orgchart-container');
            const orgchartElement = containerRef.current.querySelector('.orgchart');
            
            if (orgchartContainer && orgchartElement) {
                let existingHeader = orgchartContainer.querySelector('.orgchart-header');
                
                if (!isMobile) {
                    if (!existingHeader) {
                        const headerDiv = document.createElement('div');
                        headerDiv.className = 'orgchart-header';
                        headerDiv.innerHTML = '<h2>Organization Chart</h2>';
                        
                        orgchartContainer.insertBefore(headerDiv, orgchartElement);
                    }
                } else {
                    if (existingHeader) {
                        existingHeader.remove();
                    }
                }
                
                // Apply zoom transform
                (orgchartElement as HTMLElement).style.transform = `scale(${zoomLevel})`;
                (orgchartElement as HTMLElement).style.transformOrigin = 'center top';
                (orgchartElement as HTMLElement).style.transition = 'transform 0.2s ease-in-out';
            }
        }
    }, [zoomLevel, isMobile]);

    const handleZoomIn = () => {
        if (zoomLevel < 2) {
            setZoomLevel((prev) => Math.min(prev * 1.2, 2));
        }
    };

    const handleZoomOut = () => {
        if (zoomLevel > 0.5) {
            setZoomLevel((prev) => Math.max(prev * 0.8, 0.5));
        }
    };

    const handleResetZoom = () => {
        setZoomLevel(1);
    };

    const addStackFlag = (node: any, depth: number) => {
        if (depth === 1) {
            node.stackChildren = true;
        }
        if (node.children) {
            node.children.forEach((child: any) => addStackFlag(child, depth + 1));
        }
    };

    const datasource = useMemo(() => {
        // Apply optional team filter (show whole tree when no filter)
        let employees = state.employees;
        if (state.teamFilter && state.teamFilter !== "All Teams") {
            employees = employees.filter((e) => e.team === state.teamFilter);
        }
        const roots = buildTree(employees);

        // The library expects a single root; if multiple, add a virtual one
        if (Array.isArray(roots) && roots.length === 1) {
            const root = roots[0];
            addStackFlag(root, 0);
            return root;
        }
        const virtualRoot = {
            id: "virtual-root",
            name: "Company",
            designation: "",
            managerId: null,
            team: "",
            avatar: undefined,
            children: Array.isArray(roots) ? roots : [roots],
        } as any;
        addStackFlag(virtualRoot, 0);
        return virtualRoot;
    }, [state.employees, state.teamFilter]); // eslint-disable-line react-hooks/exhaustive-deps

    // NodeTemplate receives nodeData and should return JSX
    const renderNode = ({ nodeData }: { nodeData: any }) => {
        return <EmployeeCard node={nodeData as TreeNode} />;
    };

    if (!datasource) return null;

    return (
        <OrgChartMethodsContext.Provider value={null}>
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                    position: "relative",
                }}
            >
                <div
                    ref={containerRef}
                    style={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    <OrgChart
                        datasource={datasource}
                        pan
                        collapsible
                        NodeTemplate={renderNode}
                        style={{
                            width: "100%",
                            height: "100%",
                            transform: `scale(${zoomLevel})`,
                            transformOrigin: "center",
                        }}
                    />
                    
                    {!isMobile && children}
                    
                    <ZoomControls
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                        onResetZoom={handleResetZoom}
                    />

                    {isMobile && (
                        <div style={{ position: "absolute", bottom: 64, left: 10 }}>
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </OrgChartMethodsContext.Provider>
    );
};

export default OrgChartLib;
