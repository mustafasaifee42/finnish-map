import React , { useEffect } from  'react';
import * as d3GeoProjection from 'd3-geo-projection';
import * as topojson from 'topojson';
import * as d3 from 'd3';
//const mapData = require('./pnro.json');  // uncomment for postal code map
const mapData = require('./finland-municipalities-topojson.json'); // comment this out for postal code map
const data:any = require('./data.json');

let mapNode!: SVGSVGElement | null;
const Map: React.FunctionComponent<{width:number , height:number , scale:number , translate:[number,number] }> = (props) => {
  const projection = d3.geoMercator()
                      .scale(props.scale)
                      .translate(props.translate);
  const path:any = d3.geoPath().projection(projection);
  let mapShape:any = mapData;
  const id = 'kuntarajat'; // comment this out for postal code map
  //const id = 'pnro-rgdal'; // uncomment for postal code map
  const mapShapeData:any = topojson.feature(mapShape, mapShape.objects[id])

  const colorScale = d3.scaleLinear<string>()
    .domain([0,18000])
    .range(['#ece7f2','#2b8cbe'])
  useEffect(() => {
    let Zoom:any = d3.zoom().scaleExtent([0.8, 10]).on('zoom', zoomed);

    let mapSVG = d3.select(mapNode).call(Zoom);
    let zoomGroup = mapSVG.append('g');

    zoomGroup.append('rect')
      .attr('class', 'bg')
      .attr('x',0)
      .attr('y',0)
      .attr('width', props.width)
      .attr('height', props.height)
      .attr('opacity', 0)
      .on('click', () => {
        mapSVG.transition().duration(500).call(Zoom.transform, d3.zoomIdentity);
      })

    function zoomed() {
      zoomGroup.attr('transform', d3.event.transform); // updated for d3 v4
    }
    zoomGroup
      .selectAll('.country')
      .data(mapShapeData.features)
      .enter()
      .append('path')
      .attr('class', `country`)
      .attr('d', path)
      .attr('fill', (d:any) => {
        return '#aaa'
        return colorScale(data[d.properties.pnro][0]['population'])
      })
      .on('mouseenter',(d:any) => {
        console.log(d)
      })
      .on('click',d => {
          let bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            zoomScale = Math.max(
              1,
              Math.min(10, 0.9 / Math.max(dx / props.width, dy / props.height)),
            ),
            translate = [props.width / 2 - zoomScale * x, props.height / 2 - zoomScale * y];

          mapSVG
            .transition()
            .duration(500)
            .call(
              Zoom.transform,
              d3.zoomIdentity
                .translate(translate[0], translate[1])
                .scale(zoomScale),
            );
      });
  });

  return ( 
    <div>
      <svg width={props.width} height={props.height} ref={node => mapNode = node}>
      </svg>
    </div>
  )
}

export default Map