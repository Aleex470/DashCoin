<template>
    <div>
      <canvas ref="canvas"></canvas>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
  
  export default {
    props: ["chartData"],
    setup(props) {
      const canvas = ref(null);
      
      onMounted(() => {
        Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement);
        new Chart(canvas.value, {
          type: "line",
          data: props.chartData
        });
      });
  
      return { canvas };
    }
  };
  </script>
  