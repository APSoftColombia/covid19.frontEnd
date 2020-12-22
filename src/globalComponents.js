/**
 * Vuely Global Components
 */
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import AppSectionLoader from 'Components/AppSectionLoader/AppSectionLoader'
import { RotateSquare2 } from 'vue-loading-spinner'

//vee-validate component
import {ValidationObserver, ValidationProvider} from 'vee-validate'

// delete Confirmation Dialog
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog'

// confirmation Dialog
import ConfirmationDialog from 'Components/ConfirmationDialog/ConfirmationDialog'

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar'

// Snackbar
import Snackbar from 'Components/Snackbar/Snackbar'

// stats card
import StatsCardV2 from 'Components/StatsCardV2/StatsCardV2';

// App Card component
import AppCard from 'Components/AppCard/AppCard'

// section tooltip
import SectionTooltip from 'Components/SectionTooltip/SectionTooltip'

// elemetos
import Elemento from 'Views/formularios/components/Elemento'
import ElementoCalculado from 'Views/formularios/components/ElementoCalculado'

// DataTable component
import DataTable from 'Components/DataTable/DataTable'

// Inputs components
import CDateRange from 'Components/Inputs/CDateRange'
import CDate from 'Components/Inputs/CDate'
import CTexto from 'Components/Inputs/CTexto'
import CNumber from 'Components/Inputs/CNumber'
import CSelectComplete from 'Components/Inputs/CSelectComplete'
import Postulador from 'Components/Inputs/Postulador'
import CIdentificacion from 'Components/Inputs/CIdentificacion'
import CRadio from 'Components/Inputs/CRadio'
import CCheck from 'Components/Inputs/CCheck'
import CTextArea from 'Components/Inputs/CTextArea'
import CChip from 'Components/Inputs/CChip'
import CComboBox from 'Components/Inputs/CComboBox'
import CLocation from 'Components/Inputs/CLocation'
import JitsiMeet from 'Components/Inputs/JitsiMeet'
import JitsiMeetButton from 'Components/Inputs/JitsiMeetButton'
import BuscadorIps from 'Components/Inputs/BuscadorIps'
import BuscadorAfiliado from 'Components/Inputs/BuscadorAfiliado'
import CCombo from 'Components/Inputs/CCombo'

import IconTooltip from 'Components/Inputs/IconTooltip'

//Iconos SVG
import IconBase from 'Components/Icons/IconBase'
import Autopsia from 'Components/Icons/Autopsia'

const GlobalComponents = {
   install(Vue) {
      Vue.component('appCard', AppCard)
      Vue.component('sectionTooltip', SectionTooltip)
      Vue.component('deleteConfirmationDialog', DeleteConfirmationDialog)
      Vue.component('vuePerfectScrollbar', VuePerfectScrollbar)
      Vue.component('appSectionLoader', AppSectionLoader)
      Vue.component('pageTitleBar', PageTitleBar)
      Vue.component('rotateSquare2', RotateSquare2)
      Vue.component('statsCardV2', StatsCardV2);

      Vue.component('ValidationProvider', ValidationProvider)
      Vue.component('ValidationObserver', ValidationObserver)
      Vue.component('Snackbar', Snackbar)
      Vue.component('Elemento', Elemento)
      Vue.component('ElementoCalculado', ElementoCalculado)
      Vue.component('ConfirmationDialog', ConfirmationDialog)

      Vue.component('DataTable', DataTable)

      Vue.component('CDate', CDate)
      Vue.component('CTexto', CTexto)
      Vue.component('CNumber', CNumber)
      Vue.component('CSelectComplete', CSelectComplete)
      Vue.component('Postulador', Postulador)
      Vue.component('CIdentificacion', CIdentificacion)
      Vue.component('CRadio', CRadio)
      Vue.component('CCheck', CCheck)
      Vue.component('CTextArea', CTextArea)
      Vue.component('CChip', CChip)
      Vue.component('CDateRange', CDateRange)
      Vue.component('CComboBox', CComboBox)
      Vue.component('CLocation', CLocation)
      Vue.component('JitsiMeet', JitsiMeet)
      Vue.component('JitsiMeetButton', JitsiMeetButton)
      Vue.component('BuscadorIps', BuscadorIps)
      Vue.component('IconTooltip', IconTooltip)
      Vue.component('BuscadorAfiliado', BuscadorAfiliado)
      Vue.component('CCombo', CCombo)
      //Iconos SVG
      Vue.component('IconBase', IconBase)
      Vue.component('Autopsia', Autopsia)
   }
}

export default GlobalComponents
