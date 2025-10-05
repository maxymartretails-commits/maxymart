"use client"
import React, { useEffect, useRef, useState } from "react";

//third-party
import * as d3 from "d3";

//types
import { SalesTrendChartProps } from "../types";

const SalesChart = ({ data, days, dark }: SalesTrendChartProps) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 240 });

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.offsetWidth, height: 240 });
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!dimensions.width) return;
    const width = dimensions.width;
    const height = dimensions.height;
    const padding = 48;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    // Scales
    const x = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([padding, width - padding]);
    const y = d3
      .scaleLinear()
      .domain([d3.min(data) ?? 0, d3.max(data) ?? 100])
      .range([height - padding, padding]);

    // Area generator
    const area = d3
      .area<number>()
      .x((d: number, i: number) => x(i))
      .y0(height - padding)
      .y1((d: number) => y(d))
      .curve(d3.curveMonotoneX);

    // Line generator
    const line = d3
      .line<number>()
      .x((d: number, i: number) => x(i))
      .y((d: number) => y(d))
      .curve(d3.curveMonotoneX);

    // Gradient
    const gradientId = dark ? "chart-gradient-dark" : "chart-gradient-light";
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", dark ? "#60a5fa" : "#3b82f6")
      .attr("stop-opacity", 0.4);
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", dark ? "#1e293b" : "#fff")
      .attr("stop-opacity", 0);

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - padding})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(data.length - 1)
          .tickFormat((d, i) => days[i] || "")
      )
      .selectAll("text")
      .attr("fill", dark ? "#cbd5e1" : "#64748b")
      .attr("font-size", 12);
    svg
      .append("g")
      .attr("transform", `translate(${padding},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .attr("fill", dark ? "#cbd5e1" : "#64748b")
      .attr("font-size", 12);

    // Axis labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 8)
      .attr("text-anchor", "middle")
      .attr("fill", dark ? "#cbd5e1" : "#64748b")
      .attr("font-size", 14)
      .text("Day");
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .attr("fill", dark ? "#cbd5e1" : "#64748b")
      .attr("font-size", 14)
      .text("Sales");

    // Area path
    svg
      .append("path")
      .datum(data)
      .attr("fill", `url(#${gradientId})`)
      .attr("d", area);

    // Line path with animation
    const path = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", dark ? "#60a5fa" : "#3b82f6")
      .attr("stroke-width", 4)
      .attr("d", line);
    const totalLength = (path.node() as SVGPathElement).getTotalLength();
    path
      .attr("stroke-dasharray", totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1200)
      .ease(d3.easeCubic)
      .attr("stroke-dashoffset", 0);

    // Points with tooltips and mouse tracking
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (_: number, i: number) => x(i))
      .attr("cy", (d: number) => y(d))
      .attr("r", 7)
      .attr("fill", dark ? "#60a5fa" : "#3b82f6")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("mouseover", function (event: MouseEvent, d: number) {
        const i = data.indexOf(d);
        d3.select(this).transition().attr("r", 11);
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = "1";
          tooltipRef.current.textContent = `${days[i] || ""}: ${d}`;
        }
      })
      .on("mousemove", function (event: MouseEvent) {
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${event.offsetX + 20}px`;
          tooltipRef.current.style.top = `${event.offsetY - 10}px`;
        }
      })
      .on("mouseout", function () {
        d3.select(this).transition().attr("r", 7);
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = "0";
        }
      });

    // Legend
    svg
      .append("rect")
      .attr("x", width - 140)
      .attr("y", padding - 30)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", `url(#${gradientId})`);
    svg
      .append("text")
      .attr("x", width - 115)
      .attr("y", padding - 16)
      .attr("fill", dark ? "#cbd5e1" : "#64748b")
      .attr("font-size", 14)
      .text("Sales (units)");
  }, [data, days, dark, dimensions]);
  return (
    <div
      ref={containerRef}
      className={`relative rounded-xl shadow-md p-6 mb-8 w-full ${dark ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h2
          className={`text-xl font-semibold ${dark ? "text-white" : "text-gray-900"}`}
        >
          Sales Trend (Last 7 Days)
        </h2>
      </div>
      <div className="relative w-full">
        <svg
          ref={ref}
          width={dimensions.width}
          height={dimensions.height}
          className="h-60"
        />
        <div
          ref={tooltipRef}
          style={{ opacity: 0 }}
          className="absolute z-10 px-2 py-1 rounded bg-blue-600 text-white text-xs pointer-events-none transition-opacity duration-200"
        />
      </div>
    </div>
  );
};

export default SalesChart;
