import { GoogleMapsAutoCompleteField } from './payload-types';
// import { extendWebpackConfig } from './webpack'
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
        required: config.required ?? false,
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
                   access:{
                    ...config?.access
                  },
                  admin: {
                    readOnly:true,
                    description: config.admin?.description ?? "",
                    disabled: config.admin?.disabled ?? false,
                    hidden: config.admin?.hidden ?? false,
                    position: config.admin?.position ?? '',
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
