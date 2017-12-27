(function() {
  d3.layout.adjacencyMatrix = function() {
    var directed = true,
      size = [1,1],
      xNodes = [],
      yNodes = [],
      edges = [],
      edgeWeight = function (d) {return 1},
      nodeID = function (d) {return d.id};

    function matrix() {
      var width = size[0],
      height = size[1],
      nodeWidth = width / xNodes.length,
      nodeHeight = height / xNodes.length,
      constructedMatrix = [],
      matrix = [],
      edgeHash = {},
      xScale = d3.scale.linear().domain([0,xNodes.length]).range([0,width]),
      yScale = d3.scale.linear().domain([0,yNodes.length]).range([0,height]);

      /*xNodes.forEach(function(node, i) {
        node.sortedIndex = i;
      });

      yNodes.forEach(function(node, i) {
        node.sortedIndex = i;
      });*/

      edges.forEach(function(edge) {
        var constructedEdge = {
          value: edge.value, 
          source: edge.source, 
          target: edge.target, 
          weight: edgeWeight(edge)
        };

        if (typeof edge.source == "number") {
          constructedEdge.source = xNodes[edge.source];
        }
        if (typeof edge.target == "number") {
          constructedEdge.target = yNodes[edge.target];
        }

        var id = nodeID(constructedEdge.source) + "-" + nodeID(constructedEdge.target);

        /*if (directed === false && constructedEdge.source.sortedIndex < constructedEdge.target.sortedIndex) {
          id = nodeID(constructedEdge.target) + "-" + nodeID(constructedEdge.source);
        }*/
        console.log('!!!', id);
        if (!edgeHash[id]) {
          edgeHash[id] = constructedEdge;
        } else {
          edgeHash[id].weight = edgeHash[id].weight + constructedEdge.weight;
        }
      });

      console.log(xNodes, yNodes);
      

      yNodes.forEach(function (sourceNode, a) {
       xNodes.forEach(function (targetNode, b) {
          var currentEdge = edgeHash[nodeID(sourceNode) + "-" + nodeID(targetNode)];
          console.log(currentEdge, nodeID(sourceNode) + "-" + nodeID(targetNode));
          var grid = {
            id: nodeID(sourceNode) + "-" + nodeID(targetNode), 
            source: sourceNode, 
            target: targetNode,
            value: !currentEdge ? 0 : currentEdge.value, 
            x: xScale(b), 
            y: yScale(a), 
            weight: 0, 
            height: nodeHeight, 
            width: nodeWidth
          };
          /*var edgeWeight = 0;
          if (edgeHash[grid.id]) {
            edgeWeight = edgeHash[grid.id].weight;
            grid.weight = edgeWeight;
          };*/

          //if (directed === true || b < a) {
            matrix.push(grid);
            /*if (directed === false) {
              var mirrorGrid = {
                id: nodeID(sourceNode) + "-" + nodeID(targetNode), 
                source: sourceNode, 
                target: targetNode, 
                value: !edgeHash[grid.id] ? 0 : edgeHash[grid.id].value,
                x: xScale(a), 
                y: yScale(b), 
                weight: 0, 
                height: nodeHeight, 
                width: nodeWidth};
              mirrorGrid.weight = edgeWeight;
              matrix.push(mirrorGrid);
            }*/
          //}
        });
      });

      console.log("matrix", matrix, matrix.length)

      return matrix;
    }

    matrix.directed = function(x) {
      if (!arguments.length) return directed;
      directed = x;
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

    matrix.edgeWeight = function(x) {
      if (!arguments.length) return edgeWeight;
      if (typeof x === "function") {
        edgeWeight = x;
      }
      else {
        edgeWeight = function () {return x};
      }
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
      .attr("transform", "translate(-10,-10) rotate(90)");

    }

    matrix.yAxis = function(calledG) {
      var nameScale = d3.scale.ordinal()
      .domain(yNodes.map(nodeID))
      .rangePoints([0,size[1]],1);

      yAxis = d3.svg.axis().scale(nameScale)
      .orient("left")
      .tickSize(4);

      calledG.append("g")
      .attr("class", "am-yAxis am-axis")
      .call(yAxis);
    }

    return matrix;
  }

})();
