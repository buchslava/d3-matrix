(function() {
  d3.layout.adjacencyMatrix = function() {
    var size = [1,1],
      xNodes = [],
      yNodes = [],
      edges = [],
      nodeID = function (d) {return d.id};

    function matrix() {
      var width = size[0],
      height = size[1],
      nodeWidth = width / xNodes.length,
      nodeHeight = height / xNodes.length,
      matrix = [],
      edgeHash = {},
      xScale = d3.scale.linear().domain([0,xNodes.length]).range([0,width]),
      yScale = d3.scale.linear().domain([0,yNodes.length]).range([0,height]);

      edges.forEach(function(edge) {
        var constructedEdge = {
          value: edge.value,
          source: edge.source,
          target: edge.target
        };

        if (typeof edge.source == "number") {
          constructedEdge.source = xNodes[edge.source];
        }
        if (typeof edge.target == "number") {
          constructedEdge.target = yNodes[edge.target];
        }

        var id = nodeID(constructedEdge.source) + "-" + nodeID(constructedEdge.target);

        if (!edgeHash[id]) {
          edgeHash[id] = constructedEdge;
        }
      });

      yNodes.forEach(function (sourceNode, a) {
       xNodes.forEach(function (targetNode, b) {
          var currentEdge = edgeHash[nodeID(targetNode) + "-" + nodeID(sourceNode)];
          var grid = {
            id: nodeID(targetNode) + "-" + nodeID(sourceNode),
            source: sourceNode,
            target: targetNode,
            value: !currentEdge ? 0 : currentEdge.value,
            x: xScale(b)+70,
            y: yScale(a)+70,
            height: nodeHeight,
            width: nodeWidth
          };

          matrix.push(grid);
        });
      });

      return matrix;
    }

    matrix.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return matrix;
    }

    matrix.xNodes = function(x) {
      if (!arguments.length) return xNodes;
      xNodes = x;
      return matrix;
    }

    matrix.yNodes = function(y) {
      if (!arguments.length) return yNodes;
      yNodes = y;
      return matrix;
    }

    matrix.links = function(x) {
      if (!arguments.length) return edges;
      edges = x;
      return matrix;
    }

    matrix.nodeID = function(x) {
      if (!arguments.length) return nodeID;
      if (typeof x === "function") {
        nodeID = x;
      }
      return matrix;
    }

    matrix.xAxis = function(calledG) {
      var nameScale = d3.scale.ordinal()
      .domain(xNodes.map(nodeID))
      .rangePoints([0,size[0]],1);

      var xAxis = d3.svg.axis().scale(nameScale).orient("top").tickSize(4);

      calledG
      .append("g")
      .attr("class", "am-xAxis am-axis")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "translate(60,40) rotate(90)");

    }

    matrix.yAxis = function(calledG) {
      var nameScale = d3.scale.ordinal()
      .domain(yNodes.map(nodeID))
      .rangePoints([0,size[1]],1);

      yAxis = d3.svg.axis().scale(nameScale)
      .orient("right")
      .tickSize(0);

      calledG.append("g")
      .attr("class", "am-yAxis am-axis")
      .call(yAxis)
      .selectAll("text")
      .attr("transform", "translate(40,70)")
      .style("text-anchor", "end");
    }

    return matrix;
  }
})();
