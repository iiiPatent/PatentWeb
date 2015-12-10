
var width = 1060,
    height = 580,
	final_radius=15,
	ratio = 2,
    root;

var colorlist = ['red','yellow','blue','green','steelblue','black','#f20']
// var color = d3.scale.category20();	
	
var force = d3.layout.force()
    .size([width, height])
	.charge(function(d) { return d._children ? -d.size / 100 : -100; })  // 調整散開程度
	.linkDistance(function(d) { return d.target._children ? 100 : 40; })
    .on("tick", tick);

var svg = d3.select("#forceLayout").append("svg")
    .attr("width", width)
    .attr("height", height);

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

d3.json("./Patents_test.json", function(error, json) {
  if (error) throw error;

  root = json;
  update();
});

function update() {
  var nodes = flatten(root),
      links = d3.layout.tree().links(nodes);

  // Restart the force layout.
  force
      .nodes(nodes)
      .links(links)
      .start();

  // Update the links…
  link = link.data(links, function(d) { return d.target.id; });

  // Exit any old links.
  link.exit().remove();

  // Enter any new links.
  link.enter().insert("line", ".node")
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  // Update the nodes…
  node = node.data(nodes, function(d) { return d.id; })
			 .style("fill",color);
			 
  // Merge and make the ball bigger			 
  node.transition()
      .attr("r", function(d) { return d.children ? final_radius : Math.sqrt(d.size) / 10 * ratio; })
	  .style("fill",color);
	  
  // Show the Data Name
  node.append("title")  
      .text(function(d) { return d.name; });  
		
  // Exit any old nodes.
  node.exit().remove();
  
  

  // Enter any new nodes.
  node.enter().append("circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
	  .attr("r", function(d) { return d.children ? final_radius : Math.sqrt(d.size) / 10 * ratio; })
      // .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
      .style("fill",color)
      .on("click", click)
	  .on("dblclick",function(){ $('#submit2').submit();})  //按兩下連到遠方
      .call(force.drag);
}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

// Color leaf nodes orange, and packages white or blue.
function color(d) {
  return d._children ? "#3182bd" : d.children ? "#000" : colorlist[d.group];
}

// Toggle children on click.
function click(d) {
  if (!d3.event.defaultPrevented) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update();
  }
}

// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [], i = 0;
  
  function recurse(node) {
    if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
    if (!node.id) node.id = ++i;
    nodes.push(node);
    return node.size;
  }

  root.size = recurse(root);
	return nodes;
  // function recurse(node) {
    // if (node.children) node.children.forEach(recurse);
    // if (!node.id) node.id = ++i;
    // nodes.push(node);
  // }

  // recurse(root);
  
}

