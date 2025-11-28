
import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { ComputedFeature } from '../types';

interface DependencyGraphProps {
  features: ComputedFeature[];
  onNodeClick: (feature: ComputedFeature) => void;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  status: 'active' | 'disabled-manual' | 'disabled-dependency';
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({ features, onNodeClick }) => {
  const ref = useRef<SVGSVGElement>(null);

  const { nodes, links } = useMemo(() => {
    const nodes: Node[] = features.map(f => ({ id: f.id, status: f.status }));
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
      .force("collide", d3.forceCollide().radius(40));

    // Arrow markers
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .enter().append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 24)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#4b5563");

    const link = svg.append("g")
      .attr("stroke", "#4b5563") // gray-600
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)");

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation) as any)
      .on('click', (event, d) => {
          const feature = features.find(f => f.id === d.id);
          if(feature) onNodeClick(feature);
      });

    // Status color logic
    const getColor = (status: string) => {
        switch(status) {
            case 'active': return '#22d3ee'; // cyan-400
            case 'disabled-manual': return '#f87171'; // red-400
            case 'disabled-dependency': return '#fb923c'; // orange-400
            default: return '#9ca3af';
        }
    };

    node.append("circle")
      .attr("r", 14)
      .attr("stroke", "#1f2937") // gray-800
      .attr("stroke-width", 3)
      .attr("fill", d => getColor(d.status))
      .style('cursor', 'pointer');
      
    node.append("text")
      .attr("x", 20)
      .attr("y", "0.31em")
      .text(d => d.id)
      .attr("fill", "#d1d5db") // gray-300
      .style("font-size", "12px")
      .style("font-family", "monospace")
      .style("pointer-events", "none")
      .style("text-shadow", "0 1px 2px rgba(0,0,0,0.8)");

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

  return <svg ref={ref} className="w-full h-[400px] bg-gray-900/50 rounded-lg"></svg>;
};

export default DependencyGraph;
