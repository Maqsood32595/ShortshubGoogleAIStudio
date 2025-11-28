
import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Feature } from '../types';

interface DependencyGraphProps {
  features: Feature[];
  onNodeClick: (feature: Feature) => void;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  enabled: boolean;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({ features, onNodeClick }) => {
  const ref = useRef<SVGSVGElement>(null);

  const { nodes, links } = useMemo(() => {
    const nodes: Node[] = features.map(f => ({ id: f.id, enabled: f.enabled }));
    const links: Link[] = [];
    features.forEach(feature => {
      feature.dependencies.requires.forEach(dep => {
        if (features.some(f => f.id === dep)) {
          links.push({ source: feature.id, target: dep });
        }
      });
    });
    return { nodes, links };
  }, [features]);

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous renders

    const width = ref.current.clientWidth;
    const height = 400;
    
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30));

    const link = svg.append("g")
      .attr("stroke", "#4b5563") // gray-600
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation) as any)
      .on('click', (event, d) => {
          const feature = features.find(f => f.id === d.id);
          if(feature) onNodeClick(feature);
      });

    node.append("circle")
      .attr("r", 12)
      .attr("stroke", "#1f2937") // gray-800
      .attr("stroke-width", 2)
      .attr("fill", d => d.enabled ? "#22d3ee" : "#f87171") // cyan-400 or red-400
      .style('cursor', 'pointer');
      
    node.append("text")
      .attr("x", 18)
      .attr("y", "0.31em")
      .text(d => d.id)
      .attr("fill", "#d1d5db") // gray-300
      .style("font-size", "12px")
      .style("font-family", "monospace")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

  }, [nodes, links, features, onNodeClick]);

  const drag = (simulation: d3.Simulation<Node, undefined>) => {
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, any>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, any>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, any>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  return <svg ref={ref} className="w-full h-[400px]"></svg>;
};

export default DependencyGraph;