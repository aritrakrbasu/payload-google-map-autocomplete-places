import {
  FieldDescription,
  Label,
  Select,
  SelectInput,
  TextInput,
  useField,
  useFieldType,
} from 'payload/components/forms'
import React, { useEffect } from 'react'
import './styles.scss'
import { GoogleMapsAutoCompleteField } from '../payload-types'
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-google-places-autocomplete'
import Chevron from 'payload/dist/admin/components/icons/Chevron'
import { ClearIndicator } from 'payload/dist/admin/components/elements/ReactSelect/ClearIndicator/index'
import { DocumentPermissions } from 'payload/dist/admin/components/utilities/DocumentInfo/types'
import { CollectionPermission, FieldPermissions } from 'payload/dist/auth'
import { Access, Condition, FieldAccess } from 'payload/types'
import { Description } from 'payload/dist/admin/components/forms/FieldDescription/types'

type Admin = {
  className?: string
  components?: {
    Cell?: React.ComponentType<any>
    Field?: React.ComponentType<any>
    Filter?: React.ComponentType<any>
  }
  /**
   * You can programmatically show / hide fields based on what other fields are doing.
   * This is also run on the server, to determine if the field should be validated.
   */
  condition?: Condition
  description?: Description
  disableBulkEdit?: boolean
  disabled?: boolean
  hidden?: boolean
  position?: 'sidebar'
  readOnly?: boolean
  style?: any
  width?: string
}

type JSONAdmin = Admin & {
  components?: {
    Error?: any
    Label?: any
  }
  editorOptions?: any
}

export const AutoCompleteSelectField: (config: {
  apiKey: string
  name: string
  point_path: string | null
}) => React.FC<{ apiKey: string }> = config => {
  const AutoCompleteSelect: React.FC<{
    path: string
    label: string
    required: boolean
    admin?: JSONAdmin
    name: string
  }> = prop => {
    const { apiKey, point_path } = config || {}
    const { name, path, label, required, admin } = prop
    const rawDatapath = path + '_rawData'
    const { value, setValue } = useField({ path })
    const { value: rawDataValue, setValue: rawDataSetValue } = useField({ path: rawDatapath })
    const { value: pointValue, setValue: pointSetValue } = useField({ path: point_path })
    const { description, position, disabled, hidden, readOnly } = admin || {}

    const classes = ['react-select'].filter(Boolean).join(' ')

    if (!apiKey) {
      return 'Please enter a valid api key'
    }

    return (
      <div className={'autocomplete_places__container'}>
        <Label htmlFor={path} label={label} required={required} />
        <GooglePlacesAutocomplete
          apiKey={apiKey}
          selectProps={{
            className: classes,
            cacheOptions: true,
            classNamePrefix: 'rs',
            isClearable: true,
            isDisabled: readOnly,
            onChange: __value => {
              setValue(__value?.label)
              rawDataSetValue(__value)
              if (point_path != null && __value) {
                geocodeByAddress(__value.label)
                  .then(results => {
                    return getLatLng(results[0])
                  })
                  .then(({ lng, lat }) => pointSetValue([lng, lat]))
              }
            },
            value: rawDataValue,
            components: {
              DropdownIndicator: Chevron,
              ClearIndicator: ClearIndicator,
            },
          }}
        />
        <FieldDescription
          className={`field-description-${path.replace(/\./g, '__')}`}
          description={description}
          path={path}
          value={value}
        />
      </div>
    )
  }

  return AutoCompleteSelect
}
