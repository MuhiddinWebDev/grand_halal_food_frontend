<script setup>
import * as echarts from "echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts"; // Import BarChart instead of PieChart
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, computed } from "vue";

use([
    CanvasRenderer,
    BarChart, 
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);

const props = defineProps(['data']);
const option = computed(() => {
    return props.data
});

provide(THEME_KEY, "light");

const restoreChart = () => {
    option.value.xAxis = [];
    option.value.series = [];
    setTimeout(() => {
        option.value.xAxis = props.data?.xAxis_data;
        option.value.series = props.data?.series;
    }, 500)
}

</script>
<template>
    <div class="chart-box">
        <v-chart  class="chart-home" ref="chartContainer" :option="option" autoresize></v-chart>
    </div>
</template>
