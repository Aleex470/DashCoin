import './style.css'
import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import PrimeVue from 'primevue/config';
// PrimeVue Styles
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'

// PrimeVue Components
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Tooltip from 'primevue/tooltip'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

// PrimeVue Icons
import 'primeicons/primeicons.css'

const app = createApp(App);

app.use(store);
app.use(PrimeVue);
app.use(ToastService);

// PrimeVue Components
app.component('PrimevueButton', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Dialog', Dialog);
app.component('Card', Card);
app.component('Chart', Chart);
app.component('Avatar', Avatar);
app.component('Badge', Badge);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Message', Message);
app.component('Toast', Toast);

// PrimeVue Directives
app.directive('tooltip', Tooltip);

app.mount('#app');
