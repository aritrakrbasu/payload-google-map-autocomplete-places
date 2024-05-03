import { CollectionConfig } from 'payload/types';
import { googleMapAutoCompletePlaces } from '../../../src';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.

const Examples: CollectionConfig = {
  slug: 'examples',
  admin: {
    useAsTitle: 'someField',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    ...googleMapAutoCompletePlaces({
      apiKey: "", //<google maps API Key Goes Here>
      name: 'google_location',
      label: 'Google Location',
      required: true,
      hidden: true,
      minLengthAutocomplete: 3,
      autocompletionRequest:{},
      debounce: 400,
      apiOptions:{},
      withSessionToken:true,
      admin:{
        description: "Please pick a location",
        disabled: false,
        hidden: false,
        position: 'sidebar',
        readOnly:false,
        placeholder :"Please select a location",
      },
      access:{
        // create:() => false,
        // read:() => false,
        // update:() => false
      },
      latLng :{
        showFields: true,
        name: 'latlng',
        label: "location coordinates",
        admin:{
        description: "Auto populated location coordinates",
        disabled: false,
        hidden: false,
        position: 'sidebar',
        readOnly:false,
        
      },
      access:{
        create:() => false,
        // read:() => false,
        update:() => false
      },
      }
    })
  ],
}

export default Examples;