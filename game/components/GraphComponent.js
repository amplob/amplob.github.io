import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GraphComponent = ({ numNodes, avgConnectivity }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Generate graph data
    const graphData = generateGraph(numNodes, avgConnectivity);
    
    // Draw the graph using D3
    drawGraph(graphData);
  }, [numNodes, avgConnectivity]);

  // Generate graph data function
  const generateGraph = (numNodes, avgConnectivity) => {
    const nodes = Array.from({ length: numNodes }, (_, i) => ({ id: i }));
    const links = [];

    nodes.forEach(node => {
      const numEdges = Math.floor(avgConnectivity + Math.random() * avgConnectivity);
      for (let i = 0; i < numEdges; i++) {
        const targetNode = nodes[Math.floor(Math.random() * numNodes)];
        if (targetNode.id !== node.id && !links.some(link => 
            (link.source === node.id && link.target === targetNode.id) ||
            (link.source === targetNode.id && link.target === node.id)
          )) {
          links.push({ source: node.id, target: targetNode.id });
        }
      }
    });

    return { nodes, links };
  };

  // Draw the graph function
  const drawGraph = (graphData) => {
    const svg = d3.select(svgRef.current)
      .attr('width', 800)
      .attr('height', 600);

    svg.selectAll('*').remove(); // Clear the SVG

    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(400, 300));

    // Draw links (edges)
    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graphData.links)
      .enter().append('line')
      .attr('stroke-width', 2)
      .attr('stroke', 'black'); // Make sure the stroke is set to be visible

    // Draw nodes
    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(graphData.nodes)
      .enter().append('circle')
      .attr('r', 10)
      .attr('fill', 'blue');

    node.append('title')
      .text(d => d.id);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });
  };

  return <svg ref={svgRef}></svg>;
};

export default GraphComponent;
