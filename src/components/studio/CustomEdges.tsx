
import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react';

// A standard edge with a delete button
const ButtonEdge = ({ 
  id, 
  sourceX, 
  sourceY, 
  targetX, 
  targetY, 
  sourcePosition, 
  targetPosition, 
  style = {}, 
  markerEnd, 
  label 
}: EdgeProps) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    evt.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {label && (
            <div className="px-2 py-1 bg-white rounded border text-sm">
              {label}
            </div>
          )}
          <button
            className="w-6 h-6 bg-white rounded-full border shadow flex items-center justify-center cursor-pointer"
            onClick={(event) => onEdgeClick(event, id)}
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

// Define all edge types
const edgeTypes = {
  default: ButtonEdge,
  buttonedge: ButtonEdge,
};

export default edgeTypes;
