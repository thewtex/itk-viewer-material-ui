import React, { useEffect, useRef } from 'react'
import { useSelector } from '@xstate/react'

import '../style.css'
import { setup } from './transferFunctionWidgetUtils'
import { getSelectedImageContext } from './getSelectedImageContext'

const selectLookupTable = (state) => {
  const { selectedComponent } = getSelectedImageContext(state)
  const lookupTableProxy =
    state.context.images.lookupTableProxies?.get(selectedComponent)
  return [lookupTableProxy, lookupTableProxy?.getPresetName()]
}

const lookupProxyCompare = ([, oldName], [, newName]) => oldName === newName

function TransferFunctionWidget({ service }) {
  const transferFunctionWidgetContainer = useRef(null)
  const transferFunctionWidget = useRef(null)

  useEffect(() => {
    if (transferFunctionWidgetContainer.current) {
      transferFunctionWidget.current = setup(
        service.machine.context,
        transferFunctionWidgetContainer.current
      )
    }
  }, [transferFunctionWidgetContainer, service.machine.context])

  const [lookupTable, presetNameToTriggerUpdate] = useSelector(
    service,
    selectLookupTable,
    lookupProxyCompare
  )
  useEffect(() => {
    if (transferFunctionWidget.current && lookupTable) {
      transferFunctionWidget.current.setColorTransferFunction(
        lookupTable.getLookupTable()
      )
    }
  }, [transferFunctionWidget, presetNameToTriggerUpdate, lookupTable])

  return (
    <div className="uiRow" style={{ background: 'rgba(127, 127, 127, 0.5)' }}>
      <div className="piecewiseWidget" ref={transferFunctionWidgetContainer} />
    </div>
  )
}

export default TransferFunctionWidget
