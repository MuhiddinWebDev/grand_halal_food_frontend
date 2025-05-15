<script setup>
import { ref, onMounted } from "vue";
import { YandexMap, YandexMarker, YandexClusterer } from 'vue-yandex-maps';
import { useI18n } from "vue-i18n";
import { useMessage } from "naive-ui";

const { locale, t } = useI18n();
const message = useMessage();
const props = defineProps(['data']);

const controls = ["geolocationControl", "searchControl"];
const detailedControls = { zoomControl: { position: { right: 10, top: 50 } } };
const zoom = 10; // Adjust the zoom level to fit Uzbekistan
const coordinates = ref([40.1177489,67.8163299]); // Center of Uzbekistan

// Define your locations and their balloon content
const locations = props.data;

const markers = ref([]);
const settings = ref({
    apiKey: '70747649-067b-4d31-9913-a76fef8faf1d', // Your API key
    lang: locale.value === 'en' ? 'en_US' : locale.value === 'ru' ? 'ru_RU' : 'uz_UZ',
    coordorder: 'latlong',
    enterprise: false,
    version: '2.1'
});

const onClick = (e) => {
    // coordinates.value = e.get("coords");
    // console.log(e);
};

const onMapLoad = (map) => {
    markers.value = map.geoObjects.getArray();
};

const onMarkerLoad = (item) => {
    console.log('Marker clicked:', item);
};

// onMounted(() => {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const latitude = position.coords.latitude;
//                 const longitude = position.coords.longitude;
//                 coordinates.value = [latitude, longitude];
//             },
//             (error) => {
//                 console.error(`Error Code: ${error.code}, Message: ${error.message}`);
//             }
//         );
//     } else {
//         message.warning(t('Geolocation is not supported by this browser'));
//     }
// });
</script>
<template>
    <div class="yandex-container">
        <yandex-map :settings="settings" :coordinates="coordinates" :detailed-controls="detailedControls"
            :controls="controls" map-type="map" :zoom="zoom" @click="onClick" @mapLoad="onMapLoad">
            <!-- Add the clusterer around the markers -->
            <yandex-clusterer :options="{ preset: 'islands#greenClusterIcons', gridSize: 64 }">
                <yandex-marker v-for="(item, index) in locations" :key="index" :coordinates="item.coords"
                    :options="item.icon" :hint-content="item.title" :marker-id="item.id" marker-events="['click']"
                    :balloon="{ header: 'header', body: 'body', footer: 'footer' }"
                    :icon="{ color: 'green', glyph: 'cinema' }" @click="onMarkerLoad(item)">
                </yandex-marker>
            </yandex-clusterer>
        </yandex-map>
    </div>
</template>
<style scoped>
.yandex-container {
    height: 500px;
    width: 100%;
}

.balloon-content {
    padding: 10px;
    font-size: 14px;
    color: #333;
    background-color: red;
    width: 100px;
}
</style>