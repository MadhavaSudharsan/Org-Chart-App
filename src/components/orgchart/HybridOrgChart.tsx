import React from "react";
import { TreeNode } from "../../utils/buildTree";
import EmployeeCard from "./EmployeeCard";

interface HybridOrgChartProps {
  rootNode: TreeNode;
  verticalDepth?: number; // Level at which to switch to vertical
  maxHorizontalChildren?: number;
}

const HybridOrgChart: React.FC<HybridOrgChartProps> = ({ 
  rootNode, 
  verticalDepth = 3, 
  maxHorizontalChildren = 4 
}) => {
  
  const renderNode = (node: TreeNode, currentDepth: number = 0): React.ReactNode => {
    const isVerticalLayout = currentDepth >= verticalDepth;
    const hasChildren = (node.children?.length ?? 0) > 0;
    
    if (isVerticalLayout) {
      // Vertical layout for deeper levels
      return (
        <div key={node.id} style={{ marginLeft: currentDepth > verticalDepth ? 20 : 0 }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center",
            marginBottom: 8,
            paddingLeft: currentDepth > verticalDepth ? 16 : 0,
            borderLeft: currentDepth > verticalDepth ? "2px solid #ddd" : "none"
          }}>
            <EmployeeCard node={node} />
          </div>
          
          {hasChildren && (
            <div style={{ 
              marginLeft: 20,
              borderLeft: "1px dashed #ccc",
              paddingLeft: 16
            }}>
              {(node.children ?? []).map((child) => 
                renderNode(child, currentDepth + 1)
              )}
            </div>
          )}
        </div>
      );
    } else {
      // Horizontal layout for upper levels
      return (
        <div key={node.id} style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          margin: "10px"
        }}>
          {/* Current Node */}
          <div style={{ marginBottom: hasChildren ? 20 : 0 }}>
            <EmployeeCard node={node} />
          </div>
          
          {/* Connection Line */}
          {hasChildren && (
            <div style={{
              width: 2,
              height: 20,
              backgroundColor: "#ddd",
              marginBottom: 10
            }} />
          )}
          
          {/* Children Container */}
          {hasChildren && (
            <div style={{
              display: "flex",
              flexDirection: currentDepth >= verticalDepth - 1 ? "column" : "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
              position: "relative"
            }}>
              {/* Horizontal connecting line for siblings */}
              {(node.children?.length ?? 0) > 1 && currentDepth < verticalDepth - 1 && (
                <div style={{
                  position: "absolute",
                  top: -10,
                  left: "10%",
                  right: "10%",
                  height: 2,
                  backgroundColor: "#ddd",
                  zIndex: 0
                }} />
              )}
              
              {(node.children ?? []).map((child, index) => (
                <div key={child.id} style={{ 
                  position: "relative",
                  zIndex: 1
                }}>
                  {/* Vertical line to parent */}
                  {currentDepth < verticalDepth - 1 && (
                    <div style={{
                      position: "absolute",
                      top: -30,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 2,
                      height: 20,
                      backgroundColor: "#ddd"
                    }} />
                  )}
                  {renderNode(child, currentDepth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div style={{ 
      padding: 20, 
      overflow: "auto",
      minHeight: "100vh",
      backgroundColor: "#f9f9f9"
    }}>
      {renderNode(rootNode)}
    </div>
  );
};

export default HybridOrgChart;