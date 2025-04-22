
import { Node, Edge } from '@xyflow/react';

// Initial node position offset
const positionOffset = { x: 250, y: 120 };

export const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'input',
    position: { x: 100, y: 100 },
    data: { label: 'Start' },
    style: {
      background: '#f7f7f7',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '10px',
      width: 150,
    },
  },
  {
    id: 'application-1',
    type: 'application',
    position: { x: 100 + positionOffset.x, y: 100 },
    data: { 
      label: 'CRM API',
      description: 'Customer data source',
      icon: 'database',
    },
  },
  {
    id: 'tool-1',
    type: 'tool',
    position: { x: 100 + positionOffset.x * 2, y: 100 },
    data: { 
      label: 'Data Processor',
      description: 'Transforms customer data',
      icon: 'tool',
    },
  },
  {
    id: 'agent-1',
    type: 'agent',
    position: { x: 100 + positionOffset.x * 2, y: 100 + positionOffset.y },
    data: { 
      label: 'AI Assistant',
      description: 'Analyzes customer data',
      icon: 'brain',
    },
  },
  {
    id: 'end',
    type: 'output',
    position: { x: 100 + positionOffset.x * 3, y: 100 },
    data: { label: 'End' },
    style: {
      background: '#f7f7f7',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '10px',
      width: 150,
    },
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'e-start-app1',
    source: 'start',
    target: 'application-1',
    animated: true,
    style: { stroke: '#555', strokeWidth: 2 },
  },
  {
    id: 'e-app1-tool1',
    source: 'application-1',
    target: 'tool-1',
    animated: true,
    style: { stroke: '#555', strokeWidth: 2 },
  },
  {
    id: 'e-tool1-agent1',
    source: 'tool-1',
    target: 'agent-1',
    animated: true,
    style: { stroke: '#555', strokeWidth: 2 },
  },
  {
    id: 'e-agent1-end',
    source: 'agent-1',
    target: 'end',
    animated: true,
    style: { stroke: '#555', strokeWidth: 2 },
  },
];
