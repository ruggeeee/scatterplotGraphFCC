document.addEventListener('DOMContentLoaded', function() {
    const dataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

    fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            const width = 800;
            const height = 400;
            const padding = 40;

            const svg = d3.select('#chart')
                .append('svg')
                .attr('width', width + 2 * padding)
                .attr('height', height + 2 * padding)
                .append('g')
                .attr('transform', `translate(${padding}, ${padding})`);

            const xScale = d3.scaleLinear()
                .domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1])
                .range([0, width]);

            const yScale = d3.scaleTime()
                .domain([d3.min(data, d => new Date(d.Seconds * 1000)), d3.max(data, d => new Date(d.Seconds * 1000))])
                .range([0, height]);

            const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
            const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

            svg.append('g')
                .attr('id', 'x-axis')
                .attr('transform', `translate(0, ${height})`)
                .call(xAxis);

            svg.append('g')
                .attr('id', 'y-axis')
                .call(yAxis);

            svg.selectAll('.dot')
                .data(data)
                .enter()
                .append('circle')
                .attr('class', 'dot')
                .attr('cx', d => xScale(d.Year))
                .attr('cy', d => yScale(new Date(d.Seconds * 1000)))
                .attr('r', 5)
                .attr('data-xvalue', d => d.Year)
                .attr('data-yvalue', d => new Date(d.Seconds * 1000));

            const tooltip = d3.select('body').append('div')
                .attr('id', 'tooltip')
                .style('opacity', 0);

            svg.selectAll('.dot')
                .on('mouseover', function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', .9);
                    tooltip.html(`Year: ${d.Year}<br>Time: ${d.Time}<br>${d.Name} (${d.Nationality})`)
                        .attr('data-year', d.Year)
                        .style('left', (event.pageX + 5) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseout', function() {
                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                });

            svg.append('text')
                .attr('id', 'legend')
                .attr('x', width - 120)
                .attr('y', height - 150)
                .text('No doping allegations');
        });
});
