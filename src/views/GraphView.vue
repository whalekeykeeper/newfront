<template>
  <div style="width: 80vw; height: 90vh; position: relative;">
    <h2>Graph Visualization</h2>

    <div class="search-bar">
      <input
          v-model="searchTerm"
          placeholder="Search node by text..."
      />
      <button @click="searchNode">Search</button>
    </div>

    <div id="cy" style="width: 100%; height: 100%"></div>
  </div>
</template>



<script>
import cytoscape from 'cytoscape'
import avsdf from 'cytoscape-avsdf'
import api from '../api/backend-api'

cytoscape.use(avsdf);

export default {
  name: 'GraphView',
  data() {
    return {
      graphData: {
        nodes: [
          {
            id: 1,
            lemma: 'big',
            mastery: 0.5
          },
          {
            id: 271,
            lemma: 'large',
            mastery: 0.7
          }
        ],
        edges: [
          {
            source: 1,
            target: 271,
            weight: 0.8042270976961936
          }
        ]
      },
      searchTerm: '',
      cy: null,
    }
  },
  created() {
    this.fetchGraphData();
  },
  methods: {
    fetchGraphData() {
      api.getGraph().then((response) => {
        this.graphData = response.data;
        this.initializeGraph();
      })
    },
    searchNode() {
      if (!this.searchTerm.trim()) return;

      this.cy.elements().removeClass('highlighted');

      const searchTermLower = this.searchTerm.trim().toLowerCase();

      const foundNode = this.cy.nodes().filter((node) => {
        return node.data('label').toLowerCase().includes(searchTermLower);
      });

      if (foundNode.length > 0) {
        const neighborhood = foundNode.closedNeighborhood();
        neighborhood.addClass('highlighted');
        this.cy.fit(neighborhood, 50);
      } else {
        alert('No matching node found.');
      }
    },
    initializeGraph() {
      const {nodes, edges} = this.graphData

      // Transform data into Cytoscape format
      const elements = [
        ...nodes.map((node) => ({
          data: {
            id: String(node.id),
            label: `${node.lemma} (${node.mastery})`
          }
        })),
        ...edges.map((edge) => ({
          data: {
            source: String(edge.source),
            target: String(edge.target),
            weight: edge.weight
          }
        }))
      ]

      // Initialize Cytoscape
     const cy = cytoscape({
  container: document.getElementById('cy'), // Container for the graph
  elements,
  style: [
    {
      selector: 'node',
      style: {
        'background-color': '#ce18ff',
        label: 'data(label)',
        'font-size': '5px',
        width: '5px',
        height: '5px',
      }
    },
    {
      selector: 'edge',
      style: {
        'line-color': '#ccc',
        width: 'mapData(weight, 0, 1, 1, 1)' // Scale width based on weight
      }
    }
  ],
  layout: {
    name: 'cose',
    fit: true,
    nodeSeparation: 60,
    idealEdgeLength: 0.1, // Increase the edge length to space nodes out more
    edgeElasticity: 1000, // Tension of edges
    nodeRepulsion: 4000, // Repulsion force between nodes
  }
});

// Event listener for node click (tap)
cy.on('tap', 'node', function(event) {
  const node = event.target; // The clicked node

  // Get all nodes connected to the clicked node, including indirect connections (edges)
  const allConnectedNodes = node.closedNeighborhood(); // Collect all nodes connected by edges to this node
  console.log(allConnectedNodes)
  // Create a subgraph with the node, its connected nodes, and the connecting edges
  const subgraph = allConnectedNodes;
  console.log(subgraph)
  // Apply styling to highlight the subgraph
  cy.elements().removeClass('highlighted'); // Remove previous highlights
  subgraph.addClass('highlighted'); // Add the highlighted class to the subgraph elements

  // Optionally, zoom and center on the subgraph
  cy.fit(subgraph, 30); // Zoom and center the view on the subgraph with a margin of 50px
});

// Styling for the highlighted subgraph elements
cy.style()
  .selector('.highlighted')
  .style({
    'background-color': '#ffcc00', // Highlight node color
    'line-color': '#ffcc00', // Highlight edge color
    'width': '5px', // Increase node size for highlighted nodes
    'height': '5px' // Increase node size for highlighted nodes
  })
  .update();
  this.cy = cy;

    }
  }
}
</script>

<style scoped>
.search-bar {
  position: absolute;
  top: 10px;
  right: 20px;
  display: flex;
  gap: 8px;
  align-items: center;
  z-index: 10;
}

.search-bar input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar button {
  padding: 5px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.search-bar button:hover {
  background-color: #0056b3;
}

</style>
