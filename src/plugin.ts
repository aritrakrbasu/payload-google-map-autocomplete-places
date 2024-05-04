import { GoogleMapsAutoCompleteField } from './payload-types';
import { Field } from 'payload/types';
import { AutoCompleteSelectField } from './components/AutoCompleteSelectField';


export const googleMapAutoCompletePlaces = (incomingConfig:GoogleMapsAutoCompleteField) : Field[] => {
      let config = { ...incomingConfig }
      var point_path = null
      if ("latLng" in config && config.latLng) {
        if (typeof config.latLng === "boolean") {
          if (config.latLng) {
            point_path = config.name + "_point";
          }
        } else {
          point_path = config.latLng.name;
        }
      }



      const fields: Field[] = [
        {
        name: config.name,
        type: 'text',
        label: config.label ?? config.name,
        required: config.required ? config.required : false,
        access:{
          ...config?.access
        },
        admin:{
          ...config.admin,
          components:{
            ...config?.admin?.components,
            Field: AutoCompleteSelectField({
              apiKey: config.apiKey,
              name: config.name,
              point_path,
              path: config.name,
              label: typeof config.label === 'string' ? config.label : config.name,
              required: config.required ?config.required : false,
              onLoadFailed : config?.onLoadFailed,
              apiOptions : config?.apiOptions,
              minLengthAutocomplete : config?.minLengthAutocomplete,
              autocompletionRequest : config?.autocompletionRequest,
              withSessionToken : config?.withSessionToken,
              debounce : config?.debounce,
              
            }),

          }
        }
      },
      {
        name: config.name + '_rawData',
        type: 'json',
        admin:{
          hidden:true
        },
        access:{
          ...config?.access
        },
      }
    ]

    if("latLng" in config)
      {
        if(typeof config.latLng === "boolean")
          {
            if(config.latLng)
              {
                fields.push({
                  label: config.label ?? config.name +"(point)",
                  name: config.name + '_point',
                  type: 'point',
                  required: config.required ?config.required : false,
                   access:{
                    ...config?.access
                  },
                  admin: {
                    ...config.admin,
                    readOnly:config.admin?.readOnly ?? true,
                  }
                })
              }
          }else 
          {
            if ("latLng" in config && config.latLng && "name" in config.latLng) {
                fields.push({
                  label: config.latLng.label ?? config.name + "(point)",
                  name: config.latLng.name,
                  type: "point",
                  required: config.latLng.required ?config.latLng.required: false,
                  access:{
                    ...config?.latLng?.access
                  },
                  admin: config?.latLng?.admin ?{
                    ...config?.latLng?.admin,
                    hidden: !config.latLng.showFields,
                  }: {
                    readOnly: true,
                    hidden: !config.latLng.showFields,
                  }
                });
              }
          }

      }
      return fields
      
    }
